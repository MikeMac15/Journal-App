
import { useUser } from "@/components/Context/UserContext"
import { SQLiteJournalMetaData } from "@/constants/LocalDB"
import { textStyles } from "@/Styles/Styles"
import { SimpleLineIcons } from "@expo/vector-icons"
import dayjs from "dayjs"
import { router } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image"

const EntryListItem = ({entryId}:{entryId:string}) => {
    const {journalMetaData} = useUser()
    const entry: SQLiteJournalMetaData | undefined = journalMetaData.find(entry => entry.firestore_id === entryId)
    if (!entry) return    
    return (
            <View>
                <Text style={[textStyles.entryText,{fontSize:30, borderColor:'#bbb', borderBottomWidth:0.25, marginVertical:10, lineHeight:40,}]} >{dayjs(entry.date).format('MM.DD.YY')}</Text>
                <TouchableOpacity style={[{
                    flexDirection:'row',
                    alignItems:'center',
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
            </View>
        )
    }

    export default EntryListItem;

    const styles = StyleSheet.create({
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
    });        