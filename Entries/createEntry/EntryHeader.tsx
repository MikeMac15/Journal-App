import React, { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    Pressable,
} from "react-native";
import { textStyles } from "@/Styles/Styles";
import MyCalendar from "@/Home/HomeUI/Calendar";
 // Import your existing calendar component

interface EntryHeaderProps {
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
}

const EntryHeader: React.FC<EntryHeaderProps> = ({ date, setDate }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    return (
        <View>
            {/* Touchable to display the date and open the modal */}
            <TouchableOpacity style={{}} onPress={openModal}>
                <Text style={textStyles.entryText}>{date}</Text>
            </TouchableOpacity>

            {/* Modal with Calendar */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <SafeAreaView style={styles.modalBackground}>
                    {/* Close Button */}
                    <Pressable style={styles.closeButton} onPress={closeModal}>
                        <Text style={styles.closeText}>✕</Text>
                    </Pressable>

                    {/* Calendar Component */}
                    <MyCalendar
                        setDate={(newDate) => {
                            setDate(newDate);
                            closeModal(); // Close modal after selecting a date
                        }}
                        journalEntryDates={[]} // Provide any journal dates if applicable
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default EntryHeader;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ddd",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});
