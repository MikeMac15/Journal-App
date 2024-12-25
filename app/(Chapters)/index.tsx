import ChapterListView from '@/Chapters/ChapterListView';
import NewChapterButton from '@/Chapters/NewChapterButton';
import ViewNavBar from '@/Entries/viewEntry/ViewNavBar';
import { textStyles } from '@/Styles/Styles';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native'

interface indexProps {

}

const index: React.FC<indexProps> = ({ }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ViewNavBar />
      <Text style={[textStyles.entryText,textStyles.h1]}>Journal Chapters</Text>
      <ChapterListView />
        <NewChapterButton />
    </SafeAreaView>
  )
}

export default index;



const styles = StyleSheet.create({
  container: {

  },


})