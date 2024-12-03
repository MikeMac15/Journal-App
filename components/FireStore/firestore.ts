import { JournalEntryData } from "@/constants/Classes";
import { LRU } from "@/constants/LRU";
import { collection, doc, FirebaseFirestoreTypes, getDocFromCache, getDoc } from "@react-native-firebase/firestore";

// Helper to validate that the data matches the JournalEntryData type
const isJournalEntryData = (data: any): data is JournalEntryData => {
    return (
      typeof data.date === 'string' &&
      typeof data.location === 'string' &&
      Array.isArray(data.photo_urls) &&
      data.photo_urls.every((url: string) => typeof url === 'string') &&
      typeof data.summary === 'string' &&
      Array.isArray(data.tags) &&
      data.tags.every((tag:string) => typeof tag === 'string') &&
      typeof data.text === 'string'
    );
  };
  
  export const getEntryFromID = async (
    cache: LRU<string, JournalEntryData>,
    db: FirebaseFirestoreTypes.Module | null,
    userID: string | null,
    entryID: string
  ): Promise<JournalEntryData | null> => {
    try {
      // Check LRU cache first
      const LRUentry = cache.get(entryID);
      if (LRUentry) {
        return LRUentry;
      }
  
      // Validate database and user ID
      if (!db || !userID) {
        console.warn('Database or userID is null');
        return null;
      }
  
      // Fetch document from Firestore
      const entriesRef = doc(db, 'users', userID, 'entries', entryID);
      const docSnap = await getDoc(entriesRef);
  
      if (!docSnap.exists) {
        console.warn(`Document with ID ${entryID} does not exist`);
        return null;
      }
  
      const docData = docSnap.data();
  
      // Validate the fetched data against JournalEntryData
      if (!isJournalEntryData(docData)) {
        console.error('Invalid data format fetched from Firestore:', docData);
        throw new Error('Fetched data does not match JournalEntryData structure');
      }
  
      // Store the validated data in the LRU cache
      cache.update(entryID, docData);
  
      console.log('Cached Document Data:', docData);
  
      return docData;
    } catch (error) {
      console.error('Error fetching JournalEntryData:', error);
      return null;
    }
  };
