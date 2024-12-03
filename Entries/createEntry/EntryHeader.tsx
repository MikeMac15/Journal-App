import { textStyles } from '@/Styles/Styles';
import { Text, View, StyleSheet } from 'react-native'

interface EntryHeaderProps {
date:string
}

const EntryHeader: React.FC<EntryHeaderProps> = ({date}) => {
    return (
        <View style={styles.container}>
            <Text style={textStyles.entryText}>{date}</Text>
        </View>
    )
}

export default EntryHeader;



const styles = StyleSheet.create({
    container: {

    },

})