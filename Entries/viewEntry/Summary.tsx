import { textStyles } from '@/Styles/Styles';
import { useFonts } from 'expo-font';
import { Text, View, StyleSheet } from 'react-native'

interface SummaryProps {
    summary: string | undefined
}

////////////////   Make this page accessible for font sizes   //////////////////////

const Summary: React.FC<SummaryProps> = ({ summary }) => {

    

    return (
        <View style={styles.container}>
            <Text style={[textStyles.entryText, {fontSize: summary && summary?.length > 40 ? 12 : 20}]}>{summary}</Text>
        </View>
    )
}

export default Summary;



const styles = StyleSheet.create({
    container: {
      
        alignItems:'center'
    },
    sum: {
        fontSize: 20, // Adjust for readability
        lineHeight: 26, // Add spacing between lines
        textAlign: 'justify', // Make text look clean and aligned
        color: '#555',
        fontStyle:'italic'
    }

})