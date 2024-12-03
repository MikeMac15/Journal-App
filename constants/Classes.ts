

export interface JournalEntryData {
    date: string; // ISO date string
    location: string;
    local_photo_urls: string[]; // Array of URLs (strings)
    photo_urls: string[]; // Array of URLs (strings)
    summary: string;
    tags: string[]; // Array of tags (strings)
    text: string; // Main content text
}
