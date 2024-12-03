import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import firebase, { utils } from "@react-native-firebase/app";
import firestore, { addDoc, collection, doc, FirebaseFirestoreTypes, getDocs, query, updateDoc, where } from "@react-native-firebase/firestore";
import GoogleSignInButton, { getUserIdNameFromAsyncStorage, signUserOut } from "../GoogleSignIn";

import { JournalEntryData } from "@/constants/Classes";
import firebaseConfig from "@/firebaseConfig";
import { LRU } from "@/constants/LRU";
import { addJournalEntry, getAllEntries, getLastSyncTime, openDb, SQLiteJournalMetaData, tableSetUp } from "@/constants/LocalDB";
import Animated from 'react-native-reanimated';
import { getEntryFromID } from "../FireStore/firestore";

import storage, { getDownloadURL, ref, uploadBytes } from '@react-native-firebase/storage';
import { View } from "react-native";



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
    postToFirestore: (collectionName: string, data: JournalEntryData) => Promise<void>;
    LRUCache: LRU<string, JournalEntryData>;
    getEntryData: (entryID: string) => Promise<JournalEntryData | null>;
    journalMetaData: SQLiteJournalMetaData[];
    postAudioToStorage: (audioUri: string) => Promise<string | null>;
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

    const [journalMetaData, setJournalMetaData] = useState<SQLiteJournalMetaData[]>([]);

    useEffect(() => {
        console.log("");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("UserProvider");
        // Initialize Firebase app and Firestore
        // if (!firebase.apps.length) {
            const app = firebase.initializeApp(firebaseConfig);
            // }
            const firestoreInstance = firestore();
            setDb(firestoreInstance);
            console.log("Firestore initialized:  Success");
            
            //picture storage
            
            
            
            
            
            // Load user data from AsyncStorage
            const loadUser = async () => {
                try {
                    await tableSetUp();
                    
                    const userInfo = await getUserIdNameFromAsyncStorage();
                    if (userInfo && userInfo.userID !== null) {
                        console.log("User loaded from AsyncStorage");
                        setUser({ userID: userInfo.userID, displayName: userInfo.displayName });
                        setIsUserSignedIn(true);
                    } else {
                        setIsUserSignedIn(false);
                    }
                    // console.log("User loaded from AsyncStorage:", userInfo);
                } catch (error) {
                    console.error("Error loading user from AsyncStorage:", error);
                    setIsUserSignedIn(false);
                }
            };
            const setUpLRU = async () => {
                try {
                    // Instantiate the LRU cache with a max size of 10
                    const lruCache = new LRU<string, JournalEntryData>(10);
                    
                    // Attempt to initialize the LRU cache from AsyncStorage
                    await lruCache.InitializeFromStorage();
                    
                    
                    // If the LRU cache is empty, fetch the entries from Firestore then Update SQLite -> LRU cache -> asyncstorage
                    if (lruCache.isEmpty() && db) {
                        console.log("%cLRU cache is empty. Fetching from Firestore...",'color:red;');
                        
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
                    
                    
                    
                    console.log("LRU cache initialized successfully.",lruCache.lengthOfCache());
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
            
            // Load user data and set up LRU cache
            const initialize = async () => {
                await loadUser(); // Load user info
                
                await setUpLRU(); // Set up the LRU cache
                await fetchJournalEntries();
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                console.log("");

            
        };

        initialize();
    }, []);


//     useEffect(() => {
//         const initializeSync = async () => {
//             const localDB = await openDb();
//             const firestoreDB = db; // Firestore instance from your context
//             await syncData(localDB, firestoreDB, user.userID);
//         };
    
//         initializeSync();
//     }, []);


//     const syncData = async (localDB, firestoreDB, userID) => {
//         try {
//             const firestoreChanges = await pullChangesFromFirestore(firestoreDB, userID);
//             await updateSQLiteFromFirestore(localDB, firestoreChanges);
            
//             await setLastSyncTime(Date.now());
//             console.log("Synchronization complete.");
//         } catch (error) {
//             console.error("Error during synchronization:", error);
//         }
//     };


// const pullChangesFromFirestore = async () => {
//     const lastSyncTime = await getLastSyncTime();

//     if (!db || !user.userID || !lastSyncTime) {
//         console.error("Firestore is not initialized, user ID is null, or last sync time is null");
//         return;
//     }
//     const entriesRef = collection(db, `users/${user.userID}/entries`);
//     const q = query(entriesRef, where('lastUpdated', '>', lastSyncTime));
//     const querySnapshot = await getDocs(q);

//     const changes = querySnapshot.docs.map(doc => ({
//         ...doc.data(),
//         firestore_id: doc.id,
//     }));

//     console.log("Pulled changes from Firestore:", changes);
//     return changes;
// };

// const updateSQLiteFromFirestore = async (localDB, firestoreChanges) => {
//     for (const entry of firestoreChanges) {
//         const exists = await localDB.getAsync(
//             `SELECT COUNT(*) as count FROM journalEntries WHERE firestore_id = ?;`,
//             [entry.firestore_id]
//         );

//         if (exists.count === 0) {
//             // Insert new entry
//             await localDB.runAsync(
//                 `INSERT INTO journalEntries (firestore_id, date, location, photo_uri, summary, num_of_photos, lastUpdated)
//                  VALUES (?, ?, ?, ?, ?, ?, ?);`,
//                 [
//                     entry.firestore_id,
//                     entry.date,
//                     entry.location || null,
//                     entry.photo_uri || null,
//                     entry.summary || null,
//                     entry.num_of_photos || 0,
//                     entry.lastUpdated,
//                 ]
//             );
//         } else {
//             // Update existing entry
//             await localDB.runAsync(
//                 `UPDATE journalEntries SET date = ?, location = ?, photo_uri = ?, summary = ?, num_of_photos = ?, lastUpdated = ?
//                  WHERE firestore_id = ?;`,
//                 [
//                     entry.date,
//                     entry.location || null,
//                     entry.photo_uri || null,
//                     entry.summary || null,
//                     entry.num_of_photos || 0,
//                     entry.lastUpdated,
//                     entry.firestore_id,
//                 ]
//             );
//         }
//     }

//     console.log("SQLite updated with Firestore changes.");
// };




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
      

    const postToFirestore = async (collectionName: string, data: JournalEntryData) => {
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

    const getEntryData = async(entryID:string): Promise<JournalEntryData | null> => {
        return getEntryFromID(LRUCache,db,user.userID,entryID)
    }


    return (
        <UserContext.Provider value={{ user, setUser, signOut, isUserSignedIn, db, postToFirestore, LRUCache, getEntryData, journalMetaData, postAudioToStorage }}>
            {isUserSignedIn ? children :
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
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
