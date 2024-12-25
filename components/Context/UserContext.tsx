import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import firebase, { utils } from "@react-native-firebase/app";
import firestore, { addDoc, arrayUnion, collection, doc, FirebaseFirestoreTypes, getDocs, query, updateDoc, where } from "@react-native-firebase/firestore";
import GoogleSignInButton, { getUserIdNameFromAsyncStorage, signUserOut } from "../GoogleSignIn";

import { Chapter, JournalEntryData } from "@/constants/Classes";
import firebaseConfig from "@/firebaseConfig";
import { LRU } from "@/constants/LRU";
import { addJournalEntry, getAllEntries, getLastSyncTime, openDb, setLastSyncTime, SQLiteJournalMetaData, tableSetUp } from "@/constants/LocalDB";
import Animated from 'react-native-reanimated';
import { getEntryFromID } from "../FireStore/firestore";

import storage, { getDownloadURL, ref, uploadBytes } from '@react-native-firebase/storage';
import { View } from "react-native";
import { SQLiteDatabase } from "expo-sqlite";
import dayjs from "dayjs";


export interface FirestoreJournalEntry {
    firestore_id: string; // Firestore document ID
    date: string;
    location: string | null;
    photo_uri: string | null;
    summary: string | null;
    num_of_photos: number;
    last_updated: number; // Timestamp in milliseconds
    tags?: string[] | null;
}

export interface User {
    userID: string | null;
    displayName: string | null;
}

export interface UserContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    signOut: () => Promise<void>;
    isUserSignedIn: boolean;
    db: FirebaseFirestoreTypes.Module | null;
    postToFirestore: ( data: JournalEntryData, chapterID?:string) => Promise<void>;
    LRUCache: LRU<string, JournalEntryData>;
    getEntryData: (entryID: string) => Promise<JournalEntryData | null>;
    journalMetaData: SQLiteJournalMetaData[];
    postAudioToStorage: (audioUri: string) => Promise<string | null>;
    chapters: Chapter[] | null;
    postNewChapterToFirestore: (chapterName: string, chapterDescription: string, chapterImage: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>({ userID: null, displayName: null });
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const [db, setDb] = useState<FirebaseFirestoreTypes.Module | null>(null);
    const [LRUCache, setLRUCache] = useState<LRU<string, JournalEntryData>>(new LRU<string, JournalEntryData>(10));

    const setUpLRU = async () => {
        try {
            // Instantiate the LRU cache with a max size of 10
            const lruCache = new LRU<string, JournalEntryData>(10);

            // Attempt to initialize the LRU cache from AsyncStorage
            await lruCache.InitializeFromStorage();


            // If the LRU cache is empty, fetch the entries from Firestore then Update SQLite -> LRU cache -> asyncstorage
            if (lruCache.isEmpty() && db) {
                console.log("%cLRU cache is empty. Fetching from Firestore...", 'color:red;');

                // Fetch journal entries from Firestore
                const journalEntriesSnapshot = await getDocs(
                    collection(db, `users/${user.userID}/entries`)
                );

                const entries = journalEntriesSnapshot.docs.map((doc) => {
                    const data = doc.data() as JournalEntryData;
                    return {
                        id: doc.id,
                        ...data,
                    };
                });

                console.log("Fetched Firestore entries:", entries);

                // Populate local SQLite database with Firestore entries
                entries.forEach(async (entry) => {
                    try {
                        // Map Firestore entry to SQLiteJournalMetaData format
                        const entryData: SQLiteJournalMetaData = {
                            firestore_id: entry.id,
                            date: entry.date,
                            location: entry.location || null,
                            photo_uri: entry.photo_urls?.[0] || null,
                            summary: entry.summary || null,
                            num_of_photos: entry.photo_urls?.length || 0,
                            tags: entry.tags || null, // Assuming tags are part of Firestore entry
                            last_updated: entry.last_updated,
                        };

                        // Add entry to SQLite using your existing function
                        await addJournalEntry(entryData);
                    } catch (error) {
                        console.error("Error adding journal entry:", error, entry);
                    }
                });
                console.log("SQLite database updated with Firestore entries.");

                // Update LRU cache with the 10 most recent entries from Firestore
                entries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
                    .slice(0, 10) // Take the most recent 10 entries
                    .forEach((entry) => {
                        lruCache.update(entry.id, entry); // Add to LRU
                    });

                console.log("LRU cache updated with the most recent 10 entries.");
            }
            lruCache.SaveCacheToStorage();
            // Update the state with the initialized LRU cache
            setLRUCache(lruCache);



            console.log("LRU cache initialized successfully.", lruCache.lengthOfCache());
        } catch (error) {
            console.error("Error setting up LRU cache:", error);
        }
    };
    const fetchJournalEntries = async () => {
        try {
            const journalEntries = await getAllEntries();

            // Ensure data is sorted by date (newest first)
            const sortedEntries = journalEntries.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            // Update state with sorted data
            setJournalMetaData(sortedEntries);
            console.log('Fetched and sorted journal entries successfully.');
        } catch (error) {
            console.error('Error fetching journal entries:', error);
        }
    };
    const [journalMetaData, setJournalMetaData] = useState<SQLiteJournalMetaData[]>([]);



    const [isReadyForSync, setIsReadyForSync] = useState(false);
    const [chapters, setChapters] = useState<Chapter[] | null>(null);


    const getAllChaptersFromFirestore = async (): Promise<Chapter[] | null> => {
        if (!db) {
            console.error("Firestore is not initialized");
            return null;
        }
        if (!user.userID) {
            console.error("User ID is null");
            return null;
        }
    
        try {
            console.log("Fetching all chapters...");
    
            // Reference the user's "chapters" collection
            const chaptersRef = collection(db, 'users', user.userID, 'chapters');
    
            // Get all documents from the "chapters" collection
            const snapshot = await getDocs(chaptersRef);
    
            // Map the Firestore documents to the Chapter interface
            const chapters: Chapter[] = snapshot.docs.map((doc:any) => {
                const data = doc.data();
                return {
                    chapterID: doc.id,
                    name: data.name || '',
                    description: data.description || '',
                    photoURL: data.image || '',
                    entryIDs: data.entryIDs || [],
                    createdAt: data.createdAt?.toDate().toISOString() || '',
                };
            });
    
            console.log("Chapters fetched successfully:", chapters);
            return chapters;
        } catch (error) {
            console.error("Error fetching chapters: ", error);
            return null;
        }
    };
    

    const fetchChapters = async () => {
        const chapters = await getAllChaptersFromFirestore();
        if (chapters) {
            setChapters(chapters);
        } else {
            setChapters([]);
        }
    }


    useEffect(() => {
        const initializeFirestore = async () => {
            try {
                console.log("Initializing Firestore...");
                const app = firebase.initializeApp(firebaseConfig);
                const firestoreInstance = firestore();
                setDb(firestoreInstance);
                console.log("Firestore initialized successfully.");
            } catch (error) {
                console.error("Error initializing Firestore:", error);
            }
        };
        initializeFirestore();
    }, []);

    useEffect(() => {
        if (db) {
            const loadUserData = async () => {
                try {
                    await tableSetUp();
                    const userInfo = await getUserIdNameFromAsyncStorage();
                    if (userInfo && userInfo.userID) {
                        console.log("User loaded from AsyncStorage");
                        setUser({ userID: userInfo.userID, displayName: userInfo.displayName });
                        setIsUserSignedIn(true);
                    } else {
                        setIsUserSignedIn(false);
                    }
                } catch (error) {
                    console.error("Error loading user from AsyncStorage:", error);
                    setIsUserSignedIn(false);
                }
            };
            loadUserData();
        }
    }, [db]);

    useEffect(() => {
        if (db && user.userID) {
            const initializeData = async () => {
                try {
                    await setUpLRU();
                    await fetchJournalEntries();
                    await fetchChapters();
                    setIsReadyForSync(true);
                    console.log("Initialization complete.");
                } catch (error) {
                    console.error("Error during initialization:", error);
                }
            };
            initializeData();
        }
    }, [db, user.userID]);

    useEffect(() => {
        if (isReadyForSync) {
            const syncDataWithFirestore = async () => {
                try {
                    const localDB = await openDb();
                    await syncData(localDB, db);
                } catch (error) {
                    console.error("Error during synchronization:", error);
                }
            };
            syncDataWithFirestore();
        } else {
            console.log("Waiting for Firestore and user to be ready before syncing...");
        }
    }, [isReadyForSync]);




    const syncData = async (localDB: SQLiteDatabase, firestoreDB: FirebaseFirestoreTypes.Module | null) => {
        if (!firestoreDB || !user.userID) {
            console.error("Cannot sync data: Firestore is not initialized or user ID is null.");
            return;
        }

        try {
            const firestoreChanges = await pullChangesFromFirestore();
            await updateSQLiteFromFirestore(localDB, firestoreChanges);
            await setLastSyncTime(Date.now());
            console.log("Synchronization complete.");
        } catch (error) {
            console.error("Error during synchronization:", error);
        }
    };

    const pullChangesFromFirestore = async (): Promise<FirestoreJournalEntry[]> => {
        if (!db || !user.userID) {
            console.error("Firestore is not initialized or user ID is null");
            return [];
        }

        const lastSyncTime = await getLastSyncTime();
        const entriesRef = collection(db, `users/${user.userID}/entries`);
        const q = query(entriesRef, where('lastUpdated', '>', lastSyncTime));
        const querySnapshot = await getDocs(q);

        const changes: FirestoreJournalEntry[] = querySnapshot.docs.map(doc => ({
            firestore_id: doc.id,
            ...doc.data(),
        }) as FirestoreJournalEntry);

        console.log("Pulled changes from Firestore:", changes);
        return changes;
    };

    const updateSQLiteFromFirestore = async (
        localDB: SQLiteDatabase,
        firestoreChanges: FirestoreJournalEntry[]
    ): Promise<void> => {
        for (const entry of firestoreChanges) {
            const exists = await localDB.getAllAsync(
                `SELECT COUNT(*) as count FROM journalEntries WHERE firestore_id = ?;`,
                [entry.firestore_id]
            );

            if (exists.length === 0) {
                // Insert new entry
                await localDB.runAsync(
                    `INSERT INTO journalEntries (firestore_id, date, location, photo_uri, summary, num_of_photos, lastUpdated)
                     VALUES (?, ?, ?, ?, ?, ?, ?);`,
                    [
                        entry.firestore_id,
                        entry.date,
                        entry.location || null,
                        entry.photo_uri || null,
                        entry.summary || null,
                        entry.num_of_photos || 0,
                        entry.last_updated,
                    ]
                );
            } else {
                // Update existing entry
                await localDB.runAsync(
                    `UPDATE journalEntries SET date = ?, location = ?, photo_uri = ?, summary = ?, num_of_photos = ?, lastUpdated = ?
                     WHERE firestore_id = ?;`,
                    [
                        entry.date,
                        entry.location || null,
                        entry.photo_uri || null,
                        entry.summary || null,
                        entry.num_of_photos || 0,
                        entry.last_updated,
                        entry.firestore_id,
                    ]
                );
            }
        }

        console.log("SQLite updated with Firestore changes.");
    };



    const signOut = async () => {
        try {
            console.log("Signing out user...");
            await signUserOut();
            setUser({ userID: null, displayName: null });
            setIsUserSignedIn(false);
            console.log("User signed out and state cleared.");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };


    const postAudioToStorage = async (audioUri: string): Promise<string | null> => {
        try {
            const fileName = `${user.userID}/audio/${audioUri.split('/').pop()}`;
            const reference = storage().ref(fileName);

            // Upload file from URI
            await reference.putFile(audioUri);

            // Get the download URL
            return await reference.getDownloadURL();
        } catch (error) {
            console.error('Failed to upload audio:', error);
            return null;
        }
    };


    //////// Future Optimisation allow first check to be a local url for the chapter image, if not found then check firestore //////////////
    const postSinglePictureToStorage = async (photoUri: string): Promise<string | null> => {
        try {
            const fileName = `${user.userID}/images/${photoUri.split('/').pop()}`;
            const reference = storage().ref(fileName);

            // Upload file from URI
            await reference.putFile(photoUri);

            // Get the download URL
            return await reference.getDownloadURL();
        } catch (error) {
            console.error('Failed to upload photo:', error);
            return null;
        }
    }


    const postPicturesToStorage = async (photo_urls: string[]): Promise<string[]> => {
        if (photo_urls.length === 0) {
            return [];
        }

        const uploadPromises = photo_urls.map(async (url: string) => {
            try {
                const fileName = `${user.userID}/images/${url.split('/').pop()}`; // Create unique file name
                const reference = storage().ref(fileName);


                await reference.putFile(url);

                // Return the public download URL
                return await reference.getDownloadURL();
            } catch (error) {
                console.error(`Failed to upload ${url}:`, error);
                return null; // Handle upload failure
            }
        });

        const downloadUrls = await Promise.all(uploadPromises);
        return downloadUrls.filter((url) => url !== null) as string[];
    };

    const postNewChapterToFirestore = async (chapterName: string, chapterDescription: string, chapterImage:string) => {

        if (!db) {
            console.error("Firestore is not initialized");
            return;
        }
        if (!user.userID) {
            console.error("User ID is null");
            return;
        }

        try {
            ////////// First add pics to cloud storage /////////////
            const cloudStoragePicUrl = await postSinglePictureToStorage(chapterImage);
            
            /////////// add all data + pic urls to firestore //////////////////

            // Reference the user's "chapters" collection
            const chaptersRef = collection(db, 'users', user.userID, 'chapters');

            // Add a new document to the "chapters" collection
            const docRef = await addDoc(chaptersRef, {
                name: chapterName,
                description: chapterDescription,
                image: cloudStoragePicUrl,
                entryIDs: [],
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }





    const postToFirestore = async ( data: JournalEntryData, chapterID?: string ) => {
        if (!db) {
            console.error("Firestore is not initialized");
            return;
        }
        if (!user.userID) {
            console.error("User ID is null");
            return;
        }

        try {

            ////////// First add pics to cloud storage /////////////
            data.local_photo_urls = data.photo_urls
            const cloudStoragePicUrls = await postPicturesToStorage(data.photo_urls);

            data.photo_urls = cloudStoragePicUrls;

            /////////// add all data + pic urls to firestore //////////////////


            // Reference the user's "entries" subcollection
            const entriesRef = collection(db, 'users', user.userID, 'entries');

            // Add a new document to the "entries" subcollection
            const docRef = await addDoc(entriesRef, data);
            console.log("Document written with ID: ", docRef.id);

            // Update the chapter document (if a chapterID is provided)
            if (chapterID) {
                const chapterRef = doc(db, 'users', user.userID, 'chapters', chapterID);
                await updateDoc(chapterRef, {
                    entryIDs: arrayUnion(docRef.id) // Add the new entry's ID to the chapter
                });
                console.log(`Entry added to chapter: ${chapterID}`);
            }


            // Add to SQLite
            try {
                await addJournalEntry({
                    firestore_id: docRef.id,
                    date: data.date,
                    location: data.location,
                    photo_uri: data.photo_urls[0],
                    summary: data.summary,
                    num_of_photos: data.photo_urls.length || 0,
                    tags: data.tags || [],
                    last_updated: dayjs().toISOString(),
                });
            } catch (error) {
                console.error("Error adding journal entry to SQLite: ", error);
            }
            // Update LRU cache
            const updatedLRU = new LRU<string, JournalEntryData>(LRUCache.capacity, LRUCache);
            updatedLRU.update(docRef.id, data);
            setLRUCache(updatedLRU);
            await updatedLRU.SaveCacheToStorage();

        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const getEntryData = async (entryID: string): Promise<JournalEntryData | null> => {
        return getEntryFromID(LRUCache, db, user.userID, entryID)
    }


    return (
        <UserContext.Provider value={{ user, setUser, signOut, isUserSignedIn, db, postToFirestore, LRUCache, getEntryData, journalMetaData, postAudioToStorage, chapters, postNewChapterToFirestore }}>
            {isUserSignedIn ? children :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <GoogleSignInButton setIsUserSignedIn={setIsUserSignedIn} />
                </View>
            }

        </UserContext.Provider>
    );

    // return (
    //     <Animated.View>
    //         {isUserSignedIn ? children : <GoogleSignInButton setIsUserSignedIn={setIsUserSignedIn} />}
    //     </Animated.View>
    // )
};
