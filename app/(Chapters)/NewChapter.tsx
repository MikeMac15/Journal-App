import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Button,
    SafeAreaView,
} from 'react-native';

import { router } from 'expo-router';
import PictureSelector from '@/Entries/createEntry/PictureSelector';
import { useUser } from '@/components/Context/UserContext';

interface NewChapterProps {
    
}

const NewChapter: React.FC<NewChapterProps> = ({  }) => {
    const {postNewChapterToFirestore} = useUser();

    const [chapterName, setChapterName] = useState('');
    const [chapterDescription, setChapterDescription] = useState('');
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);


    const handleSubmit = () => {
        if (!chapterName.trim()) {
            alert('Please enter a chapter name.');
            return;
        }
        postNewChapterToFirestore(chapterName, chapterDescription, photoUrls[0]);
        router.back(); // Navigate back to the previous page or chapter list
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Create a New Chapter</Text>

                {/* Chapter Name Input */}
                <Text style={styles.label}>Chapter Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter chapter name"
                    placeholderTextColor="#888"
                    value={chapterName}
                    onChangeText={setChapterName}
                />

                {/* Chapter Description Input */}
                <Text style={styles.label}>Chapter Description</Text>
                <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Enter chapter description"
                    placeholderTextColor="#888"
                    value={chapterDescription}
                    onChangeText={setChapterDescription}
                    multiline
                />

                {/* Picture Selector */}
                <Text style={styles.label}>Chapter Image</Text>
                <PictureSelector setPicUrls={setPhotoUrls} picUrls={photoUrls} />

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Save Chapter</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default NewChapter;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
