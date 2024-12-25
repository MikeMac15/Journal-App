

export interface JournalEntryData {
    date: string; // ISO date string
    location: string;
    local_photo_urls: string[]; // Array of URLs (strings)
    photo_urls: string[]; // Array of URLs (strings)
    summary: string;
    tags: string[]; // Array of tags (strings)
    text: string; // Main content text
    last_updated: string; // ISO date string
}


export interface Chapter {
    chapterID: string;               // Unique ID of the chapter
    name: string;                    // Chapter name
    description: string;             // Description of the chapter
    photoURL?: string;               // Optional photo URL for the chapter
    entryIDs: string[];              // Array of journal entry IDs
    createdAt: string;              // Optional: Date the chapter was created
  }
  