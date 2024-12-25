import { SQLiteJournalMetaData } from '@/constants/LocalDB';
import EntryListItem from '@/Entries/EntryListItem';
import { Text, View, StyleSheet } from 'react-native'

interface ChapterEntriesListProps {
    chapterEntries: string[]
}

const ChapterEntriesList: React.FC<ChapterEntriesListProps> = ({ chapterEntries }) => {
    console.log(chapterEntries)
    return (
        <View style={styles.container}>
            {
                chapterEntries.map((entryId, idx) => (
                    <View key={idx}>
                        <EntryListItem entryId={entryId} />
                    </View>
                ))
            }
        </View>
    )
}

export default ChapterEntriesList;



const styles = StyleSheet.create({
    container: {

    },

})