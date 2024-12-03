import { Text, View, StyleSheet } from 'react-native'
import { useFonts } from 'expo-font';
import { textStyles } from '@/Styles/Styles';
interface SummaryProps {
    message: string | undefined
}

////////////////   Make this page accessible for font sizes   //////////////////////

const Message: React.FC<SummaryProps> = ({ message }) => {

    

    return (
        <View style={styles.container}>
            <Text style={[textStyles.entryText,{fontSize:16}]}>{message}</Text>
        </View>
    )
}

export default Message;



const styles = StyleSheet.create({
    container: {
        paddingHorizontal:20,
        paddingTop:5
       
    },
    
    });
