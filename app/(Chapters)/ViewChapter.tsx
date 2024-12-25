import ChapterEntriesList from '@/Chapters/ChapterEntriesList';
import { useUser } from '@/components/Context/UserContext';
import ViewNavBar from '@/Entries/viewEntry/ViewNavBar';
import NewEntryButton from '@/Home/HomeUI/NewEntryButton';
import NewEntryBtn from '@/Home/HomeUI/NewUI/NewEntryBtn';
import { textStyles } from '@/Styles/Styles';
import dayjs from 'dayjs';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image';

interface ViewChapterProps {

}

const ViewChapter: React.FC<ViewChapterProps> = ({ }) => {
    const { chapters } = useUser();
    const params = useLocalSearchParams();
    const { chapterId } = params;

    const chapter = chapters?.find(c => c.chapterID === chapterId);
    if (!chapter) {
        return (
            <View style={styles.container}>
                <Text>Chapter not found</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <ViewNavBar />
            <View>
                {chapter.photoURL &&
                    <FastImage
                        style={styles.chapterImage}
                        source={{
                            uri: chapter.photoURL, // Fallback to placeholder image
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                }
                <Text style={[textStyles.h1, { marginBottom: 5 }]}>{chapter.name}</Text>
                <Text style={[textStyles.h3, { marginBottom: 15 }]}>{chapter.description}</Text>
            </View>
                <NewEntryBtn date={dayjs().format('YYYY-MM-DD')} />
            <View>
                <Text style={[textStyles.h4, { marginTop: 15, textAlign: 'left', textDecorationLine: 'underline' }]}>Chapter Entries</Text>
                <ChapterEntriesList chapterEntries={chapter.entryIDs} />
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewChapter;



const styles = StyleSheet.create({
    container: {
        padding: 20,
        margin: 20,
    },
    chapterImage: {
        width: '100%',
        height: 220, // Fixed height
        borderRadius: 10,
        marginVertical: 20,
    },
})