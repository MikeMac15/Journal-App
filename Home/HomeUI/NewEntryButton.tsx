import { extraStyles, styles } from '@/Styles/Styles';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, router } from 'expo-router';
import { UserContextType } from '@/components/Context/UserContext';



interface NewEntryButtonProps {

    setView: React.Dispatch<React.SetStateAction<number>>

}
const NewEntryButton: React.FC<NewEntryButtonProps> = ({ setView }) => {
    return (
        
            <TouchableOpacity style={[styles2.container, extraStyles.pinkShadow]} activeOpacity={0.8} onPress={()=> setView(1)}>
                <MaterialCommunityIcons style={{ marginRight: 15 }} name="pencil-plus-outline" size={24} color="#f797b7" />
                <Text> Create a New Journal Entry</Text>
            </TouchableOpacity>
    )
}

export default NewEntryButton;



const styles2 = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width - 30,
        padding: 10,
        flexDirection: 'row',
        
        justifyContent: 'center',
        alignItems: 'center',

    },

})