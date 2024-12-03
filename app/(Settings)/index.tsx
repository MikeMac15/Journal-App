import ViewNavBar from '@/Entries/viewEntry/ViewNavBar';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native'

interface indexProps {
  
}

const index: React.FC<indexProps> = ({}) => {
  return (
<SafeAreaView style={styles.container}>
<ViewNavBar />
<Text>Settings page</Text>
<Text>*show user info</Text>
<Text>*delete local storage</Text>
<Text>*delete profile</Text>

</SafeAreaView>
)
}

export default index;



const styles = StyleSheet.create({
container: {

},

})