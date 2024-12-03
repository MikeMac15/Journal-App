import { textStyles } from '@/Styles/Styles';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

interface TagsInputProps {
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    tags: string[];
}

const TagsInput: React.FC<TagsInputProps> = ({ setTags, tags }) => {
    const [text, setText] = useState<string>("");

    const addTag = (text: string) => {
        if (text.trim() !== "") {
            setTags([...tags, text.trim()]);
            setText("");
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title,textStyles.entryText,{textAlign:'center', fontSize:24}]}>Tags</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.textInput, textStyles.entryText]}
                    placeholder="Enter a tag..."
                    value={text}
                    onChangeText={(text) => setText(text)}
                    onSubmitEditing={() => addTag(text)} // Allow adding tags by pressing enter
                />
                <TouchableOpacity style={styles.addButton} onPress={() => addTag(text)}>
                    <Text style={[textStyles.entryText,styles.addButtonText,]}>Add Tag</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={tags}
                horizontal
                keyExtractor={(item, index) => `${item}-${index}`}
                contentContainerStyle={styles.tagsContainer}
                renderItem={({ item, index }) => (
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item}</Text>
                        <TouchableOpacity onPress={() => removeTag(index)}>
                            <Text style={styles.removeTagText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

export default TagsInput;

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f2f2f2',
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    textInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        
        padding: 10,
        // marginLeft: 8,
    },
    addButtonText: {
        fontSize: 20,
        color: '#007AFF',
        // fontWeight: 'bold',
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9c1d3',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#333',
    },
    removeTagText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
    },
});