import * as SQLite from 'expo-sqlite';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { JournalEntryData } from './Classes';

import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SYNC_TIME_KEY = 'lastSyncTime';

export const getLastSyncTime = async (): Promise<number> => {
    const lastSyncTime = await AsyncStorage.getItem(LAST_SYNC_TIME_KEY);
    return lastSyncTime ? parseInt(lastSyncTime, 10) : 0;
};

export const setLastSyncTime = async (time: number): Promise<void> => {
    await AsyncStorage.setItem(LAST_SYNC_TIME_KEY, time.toString());
};


export const openDb = async() => {
    const db = await SQLite.openDatabaseAsync('myjournal.db');
    return db;
};

export const tableSetUp = async () => {
    try {
        const db = await openDb();
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS journalEntries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firestore_id TEXT UNIQUE NOT NULL,
                date TEXT NOT NULL,
                location TEXT,
                photo_uri TEXT,
                summary TEXT,
                num_of_photos INTEGER,
                last_updated TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS locations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL
            );
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL
            );`)
        
    } catch (error) {
        console.error("Error setting up tables:", error);
    }
};


const addLocation = async (db: SQLite.SQLiteDatabase, locationName: string): Promise<void> => {
    try {
        await db.runAsync(
            `INSERT INTO locations (name) VALUES (?) ON CONFLICT(name) DO NOTHING;`,
            [locationName]
          );
    } catch (error) {
        console.error("Error adding location:", error);
        throw error;
    }
};

const addTags = async (db: SQLite.SQLiteDatabase, tags: string[]): Promise<void> => {
    try {
        for (const tagName of tags) {
            // Insert the tag into the tags table, ignoring conflicts
            await db.runAsync(
                `INSERT INTO tags (name) VALUES (?) ON CONFLICT(name) DO NOTHING;`,
                [tagName]
            );

            // Optionally, fetch the tag ID if needed
            const result = await db.runAsync(
                `SELECT id FROM tags WHERE name = ?;`,
                [tagName]
            );
            
            console.log('Tag ID:', result);
        }
    } catch (error) {
        console.error("Error adding tags:", error);
        throw error;
    }
};
export interface SQLiteJournalMetaData {
    firestore_id: string;
    date: string;
    location: string | null;
    photo_uri: string | null;
    summary: string | null;
    num_of_photos: number;
    tags?: string[] | null;
    last_updated: string;
}

export const addJournalEntry = async (
    entryData: SQLiteJournalMetaData
): Promise<void> => {
    try {
        const db = await openDb();

        // Add location if provided
        if (entryData.location) {
            await addLocation(db, entryData.location);
        }

        // Insert the journal entry
        await db.runAsync(
            `INSERT INTO journalEntries (firestore_id, date, location, photo_uri, summary, num_of_photos)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [
                entryData.firestore_id,
                entryData.date,
                entryData.location || null,
                entryData.photo_uri || null,
                entryData.summary || null,
                entryData.num_of_photos || 0,
            ]
        );

        // Add tags if provided
        if (entryData.tags && entryData.tags.length > 0) {
            await addTags(db, entryData.tags);

            // Link tags to the journal entry
        }

        console.log("Journal entry added successfully.");
    } catch (error) {
        console.error("Error adding journal entry:", error);
        throw error;
    }
};


export const getAllTags = async (): Promise<string[]> => {
    try {
        const db = await openDb();
        const tagsData : string[] = await db.getAllAsync(`SELECT name FROM tags ORDER BY name ASC;`);
        return tagsData;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};


export const getAllLocations = async (): Promise<string[]> => {
    try {
        const db = await openDb();
        const tagsData : string[] = await db.getAllAsync(`SELECT name FROM locations ORDER BY name ASC;`);
        return tagsData;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error;
    }
};

export const getAllEntries = async (): Promise<
SQLiteJournalMetaData[]> => {
    try {
        const db = await openDb();
        const entries:{
            firestore_id: string;
            date: string;
            location: string | null;
            photo_uri: string | null;
            summary: string | null;
            num_of_photos: number;
            last_updated: string;
        }[] = await db.getAllAsync(`SELECT firestore_id, date, location, photo_uri, summary, num_of_photos FROM journalEntries;`);
        return entries;
    } catch (error) {
        console.error("Error fetching entries:", error);
        throw error;
    }
}

export const deleteDB = async () => {
    try {
        const db = await openDb();
        await db.execAsync(`
            DROP TABLE IF EXISTS journalEntries;
            DROP TABLE IF EXISTS locations;
            DROP TABLE IF EXISTS tags;
        `);
    } catch (error) {
        console.error("Error deleting tables:", error);
    }
}