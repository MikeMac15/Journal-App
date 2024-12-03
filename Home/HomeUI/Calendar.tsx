import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

interface CalendarProps {
    setDate: React.Dispatch<React.SetStateAction<string>>;
    journalEntryDates: string[];
}

const width = Dimensions.get("window").width;

const MyCalendar: React.FC<CalendarProps> = ({ setDate, journalEntryDates }) => {
    const [selected, setSelected] = useState("");

    // Create markedDates object for journal entry dates
    const markedDates = journalEntryDates.reduce((acc, date) => {
        const formattedDate = dayjs(date).format("YYYY-MM-DD");
        acc[formattedDate] = {
            marked: true,
            dotColor: selected === formattedDate ? 'white' : 'pink',
            selected: selected === formattedDate,
            selectedColor: selected === formattedDate ? "#333" : 'pink',
        };
        return acc;
    }, {} as Record<string, any>);

    // Add the selected date to markedDates
    if (selected) {
        markedDates[selected] = {
            ...markedDates[selected], // Preserve existing properties if it overlaps with a journal entry date
            selected: true,
            selectedColor: journalEntryDates.includes(selected) ? "pink" : "#888",
        };
    }

    return (
        <View style={[styles.container]}>
            <Calendar
                style={{
                    width: width-20,
                    
                }}
                theme={{
                    textDayFontFamily: 'Handlee-Regular',
                    textMonthFontFamily: 'Handlee-Regular',
                    textDayHeaderFontFamily: 'Handlee-Regular',
                    textDayFontSize: 16,
                    textMonthFontSize: 22,
                    textDayHeaderFontSize: 14,
                  }}
                onDayPress={(day: { dateString: string }) => {
                    setSelected((prev)=>prev === day.dateString ? dayjs().format('YYYY-MM-DD') : day.dateString); // Update selected date
                    setDate((prev)=>prev === day.dateString ? dayjs().format('YYYY-MM-DD') : day.dateString); // Pass selected date to parent
                }}
                markedDates={markedDates} // Pass combined markedDates
            />
        </View>
    );
};

export default MyCalendar;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 10,
        // transform:'scale(.95)'
    },
});