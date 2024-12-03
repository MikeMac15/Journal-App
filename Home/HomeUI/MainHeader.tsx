import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View, StyleSheet } from 'react-native'

interface MainHeaderProps {
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
    showMenu: boolean;
}

const MainHeader: React.FC<MainHeaderProps> = ({ setShowMenu,showMenu }) => {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name='menu' size={24} onPress={()=>setShowMenu((prev)=>!prev)} />
        </View>
    )
}

export default MainHeader;



const styles = StyleSheet.create({
    container: {

    },

})