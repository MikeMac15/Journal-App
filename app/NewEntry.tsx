
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Button, SafeAreaView, Text } from "react-native";
import { JournalEntryData } from "@/constants/Classes";
import { useUser } from "@/components/Context/UserContext";
import EntryHeader from "@/Entries/createEntry/EntryHeader";
import ShortTextInput from "@/Entries/createEntry/ShortTextInput";
import TextInputField from "@/Entries/createEntry/TextInputField";
import TagsInput from "@/Entries/createEntry/TagsInput";
import PictureSelector from "@/Entries/createEntry/PictureSelector";
import SaveExit from "@/Entries/createEntry/SaveExit";
import SpeechToText from "@/Entries/createEntry/SpeechToText";
import dayjs from "dayjs";
import ChapterPicker from "@/Entries/createEntry/ChapterPicker";

interface NewEntryProps {
    
    
    }
const NewEntry: React.FC = () => {
  const { db, user, postToFirestore, chapters } = useUser();
  
  const { date } = useLocalSearchParams();
  const [currDate, setDate] = useState<string>(date as string);
  const [chapterID, setChapterID] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [picUrls, setPicUrls] = useState<string[]>([]);

  const publishEntry = () => {
    try{
        const data: JournalEntryData = {
            date: currDate as string,
            text: text,
            location: location,
            summary: summary,
            local_photo_urls: picUrls,
            photo_urls: picUrls,
            tags: tags,
            last_updated: dayjs().toISOString(),
        };
        console.log(data);
        postToFirestore(data, chapterID !== "" ? chapterID : undefined);
        router.dismiss();
       
    } catch (error) {
        console.error("Error posting to Firestore: ", error);
    }
  };

  console.log("New Entry Props: ", currDate);

  return (
    <SafeAreaView style={{marginHorizontal:20}}>

    <ScrollView style={styles.container}>
      <SaveExit publishEntry={publishEntry}/>
      <EntryHeader date={String(currDate)} setDate={setDate} />
      <ShortTextInput setText={setLocation} type="Location" text={location} />
      <ShortTextInput setText={setSummary} type="Summary" text={summary} />
      {/* <SpeechToText setText={setText} /> */}
      <TextInputField setText={setText} />
      <Text style={{color:'#999', textDecorationLine:'underline'}}>Optional:</Text>
      <ChapterPicker chapters={chapters} chapterID={chapterID} setChapterID={setChapterID} />
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
