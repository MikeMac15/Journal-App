import { textStyles } from '@/Styles/Styles';
import { Text, View, StyleSheet } from 'react-native'

interface headerProps {
    date: string;
    location: string | undefined;
    tags: string[] | undefined;
}

const Header: React.FC<headerProps> = ({ date, location, tags }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={[styles.date, styles.text, textStyles.entryText]}>{date}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.location, styles.text, textStyles.entryText]}>{location}</Text>
            </View>
            <View style={styles.tagRow}>
                {
                    tags && tags.map((val,idx)=> (
                        <View key={idx} style={styles.tagSpace} >
                        <Text  style={[styles.tags, styles.text, textStyles.entryText]}>#{val}</Text>
                        </View >
                    ))
                }
            </View>
        </View>
    )
}

export default Header;



const styles = StyleSheet.create({
    container: {
        padding:20
    },
    row: {

    },
    tagRow: {
        flexDirection:'row',
        
    },
    text:{
        
        lineHeight: 26, // Add spacing between lines
        textAlign: 'justify', // Make text look clean and aligned
        color: '#444',
        fontStyle:'italic'
    },
    date: {
        fontSize: 20,

    },
    location: {
        fontSize: 18,
    },
    tags: {
        fontSize: 14,
    },
    tagSpace: {
        marginRight:15,
    }

})