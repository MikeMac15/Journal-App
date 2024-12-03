import { useUser } from '@/components/Context/UserContext';
import { JournalEntryData } from '@/constants/Classes';
import { textStyles } from '@/Styles/Styles';
import { SimpleLineIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';

interface LRUCarouselProps {}

const LRUCarousel: React.FC<LRUCarouselProps> = () => {
    const { LRUCache } = useUser();
    const [entries, setEntries] = useState<{
        key: string;
        value: JournalEntryData;
    }[]>([]);

    useEffect(() => {
        const entriesList = LRUCache.listEntries();
        setEntries(entriesList);
    }, [LRUCache]);

    useEffect(() => {
        if (entries) {
            entries.forEach((entry) => {
                if (entry.value.local_photo_urls?.[0]) {
                    FastImage.preload([{ uri: entry.value.local_photo_urls[0] }]);
                }
            });
        }
    }, [entries]);

    return (
        <View style={styles.container}>

        <FlatList
            data={entries}
            horizontal
            style={{ width: '100%' }}
            contentContainerStyle={{
                // flexGrow: 1,
                paddingHorizontal: 10, // Optional for padding
            }}
            // numColumns={4}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.entry} onPress={() => router.push(`/ViewEntry?date=${item.value.date}&firestore_id=${item.key}`)}>
                    { 
                    (item.value.local_photo_urls?.[0] || item.value.photo_urls?.[0]) ?
                    <FastImage
                        style={styles.image}
                        source={{
                            uri: item.value.local_photo_urls?.[0] || item.value.photo_urls?.[0],
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable, // Ensures the image is only loaded from the cache if available
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />

                        :
                        <View style={[styles.image,{justifyContent:'center', alignItems:'center'}]} >

                        <SimpleLineIcons name="book-open" size={24} color="#777" />
                        </View>

                    }


                    <Text style={[styles.date, textStyles.entryText]}>{new Date(item.value.date).toLocaleDateString()}</Text>
                </TouchableOpacity>
            )}
     
            />
            </View>
    );
};







export default LRUCarousel;

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        padding: 10,
        // width: '100%',
        // numColumns:,
    },
    entry: {
        width: 80,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    image: {
        width: 70,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#ffdbe7', // Fallback color while loading
        shadowColor: '#ccb8be',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderColor: '#edd5dd',
        borderWidth: 1,
    },
    date: {
        marginTop: 5,
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
});
