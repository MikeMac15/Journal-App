import { useUser } from '@/components/Context/UserContext';
import { SQLiteJournalMetaData } from '@/constants/LocalDB';
import EntryListItem from '@/Entries/EntryListItem';
import { textStyles } from '@/Styles/Styles';
import { SimpleLineIcons } from '@expo/vector-icons';
import dayjs, { Dayjs } from 'dayjs';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Dimensions, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import FastImage from 'react-native-fast-image';

interface indexProps {
  
}

const width = Dimensions.get('window').width;

const index: React.FC<indexProps> = ({}) => {
    const{journalMetaData} = useUser()
    const entries: SQLiteJournalMetaData[] = journalMetaData;

    console.log('All Entries Length: ', journalMetaData.length);
    useEffect(() => {
        if (entries) {
            entries.forEach((entry) => {
                if (entry.photo_uri) {
                    FastImage.preload([{ uri: entry.photo_uri }]);
                }
            });
        }
    }, [entries]);

    


  return (
<SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <TouchableOpacity
            style={{
                
            }}
            onPress={() => router.dismissAll()}
        >
        <Text style={[textStyles.entryText, {fontSize:30, lineHeight:40, textAlign:'center'}]}>{'< Back to Menu'}</Text>
    </TouchableOpacity>

    {/* <Text>All Entries Page</Text> */}
        {entries.map((entry) => (
            <View key={entry.firestore_id}>
            
            <EntryListItem entryId={entry.firestore_id}/>
    </View>
        ))}

        </ScrollView>
</SafeAreaView>
)
}

export default index;



const styles = StyleSheet.create({
container: {
    marginHorizontal: 20,
},

})