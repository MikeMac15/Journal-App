import { Text, View, StyleSheet, Dimensions } from 'react-native'
import NewEntryBtn from './NewEntryBtn';
import LRUCarousel from './LRUCarousel';
import { SQLiteJournalMetaData } from '@/constants/LocalDB';
import ListEntry from './ListEntry';

interface UnderCalendarProps {
    date : string;
    filteredJournalEntries: SQLiteJournalMetaData[];
}

const UnderCalendar: React.FC<UnderCalendarProps> = ({ date, filteredJournalEntries }) => {
    return (
        <View style={styles.container}>
            <NewEntryBtn date={date} />
            {/* photos */}
            {
                filteredJournalEntries.length > 0 ? (
                    filteredJournalEntries.map((entry, index) => (

                        <ListEntry key={index} entry={entry} />
                    ))
                ) : 
                <View>
            <LRUCarousel />
        </View>
            }
        </View>
    )
}

export default UnderCalendar;



const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        // padding: 20,
        // marginHorizontal: 20,
    },

})