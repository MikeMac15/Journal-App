import { useUser } from '@/components/Context/UserContext';
import { SQLiteJournalMetaData } from '@/constants/LocalDB';
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
    const [entries, setEntries] = useState<SQLiteJournalMetaData[]>(journalMetaData);

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

    const EntryListItem = ({entry}:{entry:SQLiteJournalMetaData}) => {
        return (
            
                <TouchableOpacity style={[{
                    flexDirection:'row',
                    alignItems:'center',
                    // justifyContent:'space-evenly',
                    // width:Dimensions.get('window').width * 0.9,
                    }, styles.entryContainer]}
                    onPress={() => router.push(`/ViewEntry?date=${entry.date}&firestore_id=${entry.firestore_id}`)}>
                { 
                    entry.photo_uri 
                    ?
                    <FastImage
                        style={styles.image}
                        source={{
                            uri: entry.photo_uri,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable, // Ensures the image is only loaded from the cache if available
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        />

                        :
                        <View style={[styles.image,{justifyContent:'center', alignItems:'center'}]} >

                        <SimpleLineIcons name="book-open" size={24} color="black" />
                        </View>

                    }
            <View style={{
                flexDirection:'column',
                alignItems:'center',
                width:250
                }}>
                <Text style={[textStyles.entryText, {textAlign:'center'}]}>{entry.location}</Text>
                <Text style={[textStyles.entryText, {textAlign:'center', fontSize:20}]} numberOfLines={1} ellipsizeMode='tail'>{entry.summary}</Text>
            </View>
            </TouchableOpacity>
        )
    }


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
            <Text style={[textStyles.entryText,{fontSize:30, borderColor:'#bbb', borderBottomWidth:0.25, marginVertical:10, lineHeight:40,}]} >{dayjs(entry.date).format('MM.DD.YY')}</Text>
            <EntryListItem entry={entry}/>
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
image: {
    width: 100,
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
entryContainer: {   
    backgroundColor: 'rgba(225, 225, 225, 0.5)',
    borderRadius: 10,
},

})