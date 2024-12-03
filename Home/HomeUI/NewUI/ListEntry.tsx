import React, { useRef } from 'react';
import { SQLiteJournalMetaData } from '@/constants/LocalDB';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { textStyles } from '@/Styles/Styles';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import LottieView from 'lottie-react-native';

interface ListEntryProps {
    entry: SQLiteJournalMetaData;
}

const ListEntry: React.FC<ListEntryProps> = ({ entry }) => {
    const animation = useRef<LottieView>(null);

    const formatDate = (dateString: string): string => {
        return dayjs(dateString).format('MM.DD.YY');
    };

    if (!entry) {
        return null;
    }
    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push(`/ViewEntry?date=${entry.date}&firestore_id=${entry.firestore_id}`)}>
            <View style={styles.imageContainer}>
                { entry.photo_uri ?
                <FastImage
                    style={styles.image}
                    source={{ uri: entry.photo_uri  }} // Placeholder URL
                    resizeMode={FastImage.resizeMode.cover}
                />
                :
                <LottieView
                autoPlay
                
                ref={animation}
                style={{
                    width: 100,
                    height: 100,
                    // backgroundColor: '#eee',
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('@/assets/lotties/bird_flowers.json')}
            />
            }
                {entry.num_of_photos > 1 &&
                    <View style={styles.photoCountContainer}>
                        <Text style={styles.photoCountText}>+{entry.num_of_photos - 1}</Text>
                    </View>
                }
            </View>
            <View style={styles.textContainer}>
                <Text style={[textStyles.entryText, styles.date]}>{entry.summary || 'No summary available.'}</Text>
                <View style={{flexDirection:'row', justifyContent:'center'}}>

                <Text style={[textStyles.entryText, styles.summary, {marginHorizontal:5}]}>{formatDate(entry.date) || 'No date available.'}</Text>
                <Text style={[textStyles.entryText, styles.summary, {marginHorizontal:5}]}>{entry.location || 'No location available.'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ListEntry;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 8,
        // marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // For Android shadow
    },

    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    summary: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        lineHeight: 16,
    },
    date: {
        textAlign: 'center',
        fontSize: 20,
        color: '#333',
    },
    imageContainer: {
        position: 'relative', // Allows positioning of child elements relative to this container
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden', // Ensures the circle doesn't overflow the image
    },
    image: {
        width: '100%',
        height: '100%',
    },
    photoCountContainer: {
        position: 'absolute',
        bottom: 8, // Slightly above the bottom edge
        right: 8, // Slightly left of the right edge
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
        borderRadius: 12, // Ensures a perfect circle
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoCountText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
