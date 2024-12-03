
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Button, SafeAreaView } from "react-native";
import { JournalEntryData } from "@/constants/Classes";
import { useUser } from "@/components/Context/UserContext";
import EntryHeader from "@/Entries/createEntry/EntryHeader";
import ShortTextInput from "@/Entries/createEntry/ShortTextInput";
import TextInputField from "@/Entries/createEntry/TextInputField";
import TagsInput from "@/Entries/createEntry/TagsInput";
import PictureSelector from "@/Entries/createEntry/PictureSelector";
import SaveExit from "@/Entries/createEntry/SaveExit";
import SpeechToText from "@/Entries/createEntry/SpeechToText";

interface NewEntryProps {
    
    
    }
const NewEntry: React.FC = () => {
  const { db, user, postToFirestore } = useUser();
  
  const { date } = useLocalSearchParams();
 

  const [text, setText] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [picUrls, setPicUrls] = useState<string[]>([]);

  const publishEntry = () => {
    try{

        const data: JournalEntryData = {
            date: date as string,
            text: text,
            location: location,
            summary: summary,
            local_photo_urls: picUrls,
            photo_urls: picUrls,
            tags: tags,
        };
        console.log(data);
        postToFirestore("entries", data);
        router.dismiss();
       
    } catch (error) {
        console.error("Error posting to Firestore: ", error);
    }
  };

  console.log("New Entry Props: ", date);

  return (
    <SafeAreaView style={{marginHorizontal:20}}>

    <ScrollView style={styles.container}>
      <SaveExit publishEntry={publishEntry}/>
      <EntryHeader date={String(date)} />
      <ShortTextInput setText={setLocation} type="Location" text={location} />
      <ShortTextInput setText={setSummary} type="Summary" text={summary} />
      <SpeechToText setText={setText} />
      <TextInputField setText={setText} />
      <TagsInput setTags={setTags} tags={tags} />
      <PictureSelector setPicUrls={setPicUrls} picUrls={picUrls} />
      {/* <Button title="Publish Journal Entry" onPress={publishEntry} /> */}
    </ScrollView>
    </SafeAreaView>
  );
};

export default NewEntry;

const styles = StyleSheet.create({
  container: {
    // marginTop: 50,
  },
});
