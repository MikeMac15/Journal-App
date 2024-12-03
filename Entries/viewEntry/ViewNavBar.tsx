import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native'

interface ViewNavBarProps {
  
}

const ViewNavBar: React.FC<ViewNavBarProps> = ({}) => {
    // const [dark,setDark] = useState(false)

  return (
<View style={styles.container}>
    <Button title='< Back' onPress={()=> router.dismissAll()} />
    {/* <Button title='Update' onPress={()=> ''} /> */}
    <Button title='Update' onPress={()=> ''} color={'#ccc'} />
</View>
)
}

export default ViewNavBar;



const styles = StyleSheet.create({
container: {
    marginTop: 20,
    flexDirection:'row',
    justifyContent:'space-between'
},

})