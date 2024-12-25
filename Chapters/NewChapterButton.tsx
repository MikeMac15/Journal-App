import { router } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

interface NewChapterButtonProps {
  
}

const NewChapterButton: React.FC<NewChapterButtonProps> = ({}) => {
  return (
     <TouchableOpacity style={styles.container} onPress={() => {router.push('/(Chapters)/NewChapter')}}>
        <Text>New Chapter</Text>
     </TouchableOpacity>
)
}

export default NewChapterButton;



const styles = StyleSheet.create({
   container: {

},

})