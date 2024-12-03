import { SQLiteJournalMetaData } from '@/constants/LocalDB';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

interface PrevEntryListProps {
    setView: React.Dispatch<React.SetStateAction<number>>;
    date: string;
    entries: SQLiteJournalMetaData[];
}

const PrevEntryList: React.FC<PrevEntryListProps> = ({setView,date,entries }) => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (entries && entries.length > 0 && entries[0].summary) {
            setText(entries[0].summary);
        } else {
            setText(""); // Reset text if entries is empty or invalid
        }
        console.log('entries', entries);
    }, [entries]);
    
    
    if (entries.length === 0) return 

    return (
        <TouchableOpacity
        style={styles.container}
        onPress={() => router.push(`/ViewEntry?date=${date}&firestore_id=${entries[0].firestore_id}`)}
    >
        <Text>{date}</Text>
        {text && <Text>{text}</Text>}
    </TouchableOpacity>
    
    )
}

export default PrevEntryList;



const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        // borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        marginVertical: 10,
    },

})