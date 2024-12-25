import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Chapter } from '@/constants/Classes';

interface ChapterPickerProps {
  chapters: Chapter[]|null;
  chapterID: string;
  setChapterID: React.Dispatch<React.SetStateAction<string>>;
}

const ChapterPicker: React.FC<ChapterPickerProps> = ({ chapters, chapterID, setChapterID }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const handleSelectChapter = (id: string) => {
    setChapterID(id);
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Button to open the modal */}
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>
          {chapterID
            ? `${chapters?.find((c) => c.chapterID === chapterID)?.name || 'None'}`
            : 'Select a Chapter'}
        </Text>
      </TouchableOpacity>

      {/* Modal with the list of chapters */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Chapter</Text>

            {/* List of chapters */}
            <FlatList
              data={chapters}
              keyExtractor={(item) => item.chapterID}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.listItem,
                    chapterID === item.chapterID && styles.selectedItem,
                  ]}
                  onPress={() => handleSelectChapter(item.chapterID)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      chapterID === item.chapterID && styles.selectedText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />

            {/* Close button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChapterPicker;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#fc569e',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fc569e',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
