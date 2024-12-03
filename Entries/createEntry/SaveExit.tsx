import { textStyles } from '@/Styles/Styles'
import { router } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

interface SaveExitProps {
    publishEntry: () => void;
}

const SaveExit: React.FC<SaveExitProps> = ({ publishEntry }) => {

    const Button = ({title, color}:{title:string, color:string}) => {
        return (
            <TouchableOpacity style={styles.button} onPress={()=> title==='Cancel' ? router.dismiss() : publishEntry()}>
                <Text style={[ textStyles.entryText,{color:color, fontSize:20},]}>{title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <Button title="Cancel"  color={'red'}/>
            <Button title="Publish Entry" color={'#007AFF'} />
        </View>
    )
}

export default SaveExit;



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginHorizontal: 0
    },
    button:{
        width: 120,
        height: 50,
        
        
        justifyContent: 'center',
        alignItems: 'center'
    }

})