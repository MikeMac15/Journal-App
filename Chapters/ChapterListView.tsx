import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image'; // Import FastImage
import { useUser } from '@/components/Context/UserContext';
import { Chapter } from '@/constants/Classes';
import { router } from 'expo-router';
import { textStyles } from '@/Styles/Styles';
import NewChapterButton from './NewChapterButton';
import LottieView from 'lottie-react-native';

interface ChapterListViewProps {}

const ChapterListView: React.FC<ChapterListViewProps> = ({}) => {
    const { chapters } = useUser();

    const animation = useRef<LottieView>(null);

    if (!chapters) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={textStyles.h4}>Loading...</Text>
            </View>
        );
    }

    const ChapterView: React.FC<Chapter> = ({ chapterID, name, description, photoURL }) => {
        return (
            <TouchableOpacity
                style={styles.chapterContainer}
                onPress={() => router.push(`/(Chapters)/ViewChapter?chapterId=${chapterID}`)}
            >
                { photoURL ?
                <FastImage
                    style={styles.chapterImage}
                    source={{
                        uri: photoURL, // Fallback to placeholder image
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                :
                <LottieView
                autoPlay
                
                ref={animation}
                style={{
                    width: 150,
                    height: 150,
                    // backgroundColor: '#eee',
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('@/assets/lotties/bird_flowers.json')}
            />
            }
                <Text style={[textStyles.h4,{lineHeight:20, marginTop:10,paddingTop:10}]} >
                    {name}
                </Text>
                
                
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {chapters.map((chapter) => (
                <ChapterView key={chapter.chapterID} {...chapter} />
            ))}
        </View>
    );
};

export default ChapterListView;

const styles = StyleSheet.create({
    container: {
        
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    loadingContainer: {
        
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterContainer: {
        width: Dimensions.get('window').width / 2 - 20, // Responsive 2-column layout
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3, // Shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        padding: 10,
    },
    chapterImage: {
        width: '100%',
        height: 150, // Fixed height
        borderRadius: 10,
    },
    chapterDescription: {
        fontSize: 12,
        color: '#666',
        paddingHorizontal: 8,
        paddingBottom: 10,
    },
});
