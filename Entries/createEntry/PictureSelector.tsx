import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    FlatList,
    Modal,
    Pressable,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FastImage from 'react-native-fast-image';

interface PictureSelectorProps {
    setPicUrls: React.Dispatch<React.SetStateAction<string[]>>;
    picUrls: string[];
}

const PictureSelector: React.FC<PictureSelectorProps> = ({ setPicUrls, picUrls }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const newImageUri = result.assets[0].uri;
            setPicUrls((prevPicUrls) => [...prevPicUrls, newImageUri]);
        }
    };

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedIndex(0);
    };

    const deletePhoto = (index: number) => {
      const newUrls = picUrls?.filter((_, idx) => idx !== index);
      setPicUrls(newUrls || []);
  }

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity onPress={() => openModal(index)} style={styles.imageContainer}>
            <TouchableOpacity style={{position:'absolute', top:0, right:0, zIndex:1}} onPress={()=>deletePhoto(index)}>
                <Text style={{color:'red', fontSize:20, backgroundColor:'rgba(20,20,20,0.75)', borderRadius:0, padding:5}}>✕</Text>
            </TouchableOpacity>
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
            <Button title="Add an image from camera roll" onPress={pickImage} />
            {picUrls.length > 0 && (
                <FlatList
                    data={picUrls}
                    horizontal
                    renderItem={renderItem}
                    keyExtractor={(_, idx) => idx.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageList}
                />
            )}

            {/* Modal for Fullscreen Image */}
            {modalVisible && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <SafeAreaView style={styles.modalBackground}>
                      
                        
                        
                        <Pressable style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeText}>✕</Text>
                        </Pressable>
                      
                        <FlatList
                            data={picUrls}
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

                    </SafeAreaView>

                </Modal>
            )}
        </View>
    );
};

export default PictureSelector;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    imageList: {
        marginTop: 10,
        flexDirection: 'row',
    },
    imageContainer: {
        marginRight: 8,
    },
    image: {
        width: 70,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#eaeaea',
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
