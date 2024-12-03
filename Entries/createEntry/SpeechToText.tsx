import { Text, View, StyleSheet, Alert, Button } from 'react-native'
import { useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets } from 'expo-audio';
import React, { useEffect } from 'react';
import { useUser } from '@/components/Context/UserContext';

interface SpeechToTextProps {
    setText: React.Dispatch<React.SetStateAction<string>>;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ setText }) => {
    const {postAudioToStorage} = useUser();
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
    const userID = 'exampleUserID'; // Replace with your user identification logic
  
    const record = () => audioRecorder.record();
  
    const stopRecording = async () => {
      await audioRecorder.stop();
      if (audioRecorder.uri) {
        const downloadUrl = await postAudioToStorage(audioRecorder.uri);
        if (downloadUrl) {
          Alert.alert('Audio uploaded successfully!', downloadUrl);
          console.log('Download URL:', downloadUrl);
        } else {
          Alert.alert('Failed to upload audio');
        }
      }
    };
  
    useEffect(() => {
      (async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission to access microphone was denied');
        }
      })();
    }, []);
  
    return (
      <View style={styles.container}>
        <Button
          title={audioRecorder.isRecording ? 'Stop Recording' : 'Start Recording'}
          onPress={audioRecorder.isRecording ? stopRecording : record}
        />
      </View>
    );
  };

export default SpeechToText;



const styles = StyleSheet.create({
    container: {

    },

})