import dayjs from 'dayjs';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface DateTitleProps {
    date: string;
}

const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Covers 11th to 19th
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};

const DateTitle: React.FC<DateTitleProps> = ({ date }) => {
        const dateObj = dayjs(date);
        const day = dateObj.date(); // Day of the month
        const month = dateObj.format('MMMM'); // Full month name
        const year = dateObj.year();
    
    if (date !== "") {
    return (
        <View style={styles.container}>
            <Text style={styles.day}>{dateObj.format('dddd')}</Text>
            <Text style={styles.date}>
                {`${month} ${day}${getOrdinalSuffix(day)}, ${year}`}
            </Text>
        </View>
    );}
    
    return (
        <View style={styles.container}>
        
        <Text style={styles.date}>
            Select a date from the calendar above!
        </Text>
    </View>
    )
};
export default DateTitle;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        // borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        marginVertical: 10,
    },
    day: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4a90e2',
        textTransform: 'uppercase',
    },
    date: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333',
        marginTop: 5,
    },
});