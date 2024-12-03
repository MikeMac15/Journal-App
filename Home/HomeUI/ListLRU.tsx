import { JournalEntryData } from '@/constants/Classes';
import { LRU } from '@/constants/LRU';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DateTitle from './DateTitle';

interface ListLRUProps {
    LRU: LRU<string, JournalEntryData>;
 
}

const ListLRU: React.FC<ListLRUProps> = ({ LRU,  }) => {
    const LRUArray = LRU.listEntries();
    if (LRUArray.length === 0) {
        return <DateTitle date='' />;
    }
    return (
        <View style={styles.container}>
            {LRUArray.map((entry: { key: string; value: JournalEntryData }, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.entryContainer}
                    onPress={() => 'onEntryPress(entry.value)'}
                >
                    <Text style={styles.entryNumber}>Entry #{i + 1}</Text>
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>{entry.value.summary}</Text>
                        <Text style={styles.dateText}>{entry.value.date}</Text>
                    </View>
                    <View style={styles.separator} />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ListLRU;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#faf3e0', // Light beige for a journal-like feel
    },
    entryContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    entryNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5d4037', // Dark brown for a classic journal look
        marginBottom: 5,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width:'100%'
    },
    summaryText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
    separator: {
        marginTop: 10,
        height: 1,
        backgroundColor: '#ddd',
    },
});