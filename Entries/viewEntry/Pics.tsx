import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs'; // For checking file existence

interface PicsProps {
    urls: string[] | undefined; // Google Storage URLs
    localUrls: string[] | undefined; // Local file paths
}

const Pics: React.FC<PicsProps> = ({ urls, localUrls }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [filteredUrls, setFilteredUrls] = useState<string[]>([]);

    useEffect(() => {
        const checkLocalFiles = async () => {
            const resolvedUrls: string[] = [];
            if (localUrls && urls) {
                for (let i = 0; i < localUrls.length; i++) {
                    const localPath = localUrls[i];
                    const exists = await RNFS.exists(localPath); // Check if local file exists
                    resolvedUrls.push(exists ? localPath : urls[i]); // Use local or fallback to remote URL
                }
            } else if (urls) {
                resolvedUrls.push(...urls); // Default to URLs if local files are not provided
            }
            setFilteredUrls(resolvedUrls);
        };

        checkLocalFiles();
    }, [urls, localUrls]);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedIndex(0);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity onPress={() => openModal(index)}>
            <FastImage
                style={styles.image}
                source={{
                    uri: item,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </TouchableOpacity>
    );

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            {filteredUrls.length > 0 && (
                <FlatList
                    data={filteredUrls}
                    horizontal
                    renderItem={renderItem}
                    keyExtractor={(_, idx) => idx.toString()}
                    showsHorizontalScrollIndicator={false}
                />
            )}

            {/* Modal for fullscreen carousel */}
            {filteredUrls.length > 0 && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalBackground}>
                        <Pressable style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeText}>✕</Text>
                        </Pressable>
                        <FlatList
                            data={filteredUrls}
                            horizontal
                            pagingEnabled
                            initialScrollIndex={selectedIndex}
                            renderItem={({ item }) => (
                                <FastImage
                                    style={styles.fullscreenImage}
                                    source={{
                                        uri: item,
                                        priority: FastImage.priority.high,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            )}
                            keyExtractor={(_, idx) => idx.toString()}
                            showsHorizontalScrollIndicator={false}
                            getItemLayout={(_, index) => ({
                                length: screenWidth,
                                offset: screenWidth * index,
                                index,
                            })}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default Pics;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 20,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: Dimensions.get('window').width,
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 20,
        padding: 5,
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
});
