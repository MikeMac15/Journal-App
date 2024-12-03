import { textStyles } from '@/Styles/Styles';
import dayjs from 'dayjs';
import { Text, View, StyleSheet } from 'react-native'

interface DateProps {
    date:string
}

const Date: React.FC<DateProps> = ({ date }) => {
    if (date === '') date = dayjs().format('YYYY-MM-DD')
    const dateObj = dayjs(date);

    if (date !== "") {
        return (
            <View style={styles.container}>
                <Text style={[styles.day, textStyles.entryText]}>{dateObj.format('dddd')}</Text> 
                <Text style={[styles.date, textStyles.entryText]}>{dateObj.format('MM.DD.YY')}</Text>
            </View>
        );
    }
    return null;

}

export default Date;



const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        // marginBottom: 10,
    },
    day: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555', // Subtle color for the day of the week
    },
    date: {
        fontSize: 22,
        // fontWeight: 'bold',
        color: '#333', // Darker color for the date
    },
})