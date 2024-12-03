import { useUser } from '@/components/Context/UserContext';
import Header from '@/Entries/viewEntry/Header';
import Message from '@/Entries/viewEntry/Message';
import Pics from '@/Entries/viewEntry/Pics';
import Summary from '@/Entries/viewEntry/Summary';
import { useLocalSearchParams } from 'expo-router';
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native'

import { useState, useEffect } from 'react';
import { JournalEntryData } from '@/constants/Classes';
import ViewNavBar from '@/Entries/viewEntry/ViewNavBar';

interface ViewEntryProps {
  
}

const ViewEntry: React.FC<ViewEntryProps> = ({}) => {
    const{date,firestore_id} = useLocalSearchParams();
    console.log('date',date);
    console.log('firestore_id',firestore_id);
    const {getEntryData} = useUser()

    const [entry,setEntry] = useState<JournalEntryData>();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getEntryData(String(firestore_id));
            if (data !== null) {
                setEntry(data);
            }
        };
        fetchData();
    }, [firestore_id]);
    
   


  return (
    <SafeAreaView>

<ScrollView style={styles.container}>
    <ViewNavBar />
    <Header date={String(date)} location={entry?.location}  tags={entry?.tags} />
    <Summary summary={entry?.summary} />
    <Message message={entry?.text} />
    <Pics urls={entry?.photo_urls} />

    <View style={{height:200}} />
    {/* <Text>{firestore_id}</Text> */}
</ScrollView>
    </SafeAreaView>
)
}

export default ViewEntry;



const styles = StyleSheet.create({
container: {
    
},

})