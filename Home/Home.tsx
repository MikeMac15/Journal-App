import { Text, View, StyleSheet, Button, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import { UserContextType, useUser } from '@/components/Context/UserContext';
import { useEffect, useState } from 'react';
import WelcomeAnimation from './IntroAnimation';
import Calendar from './HomeUI/Calendar';
import { deleteDB, getAllEntries, SQLiteJournalMetaData } from '@/constants/LocalDB';
import AboveCalendar from './HomeUI/NewUI/AboveCalendar';
import dayjs from 'dayjs';
import UnderCalendar from './HomeUI/NewUI/UnderCalendar';
import Menu from './Menu/Menu';

interface HomeProps {

}

const Home: React.FC<HomeProps> = () => {
    const userContext: UserContextType = useUser();
    const [showIntroAnimation, setShowIntroAnimation] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(String(dayjs().format('YYYY-MM-DD')));
    const [view, setView] = useState<number>(0);
    const [filteredJournalEntries, setFilteredJournalEntries] = useState<SQLiteJournalMetaData[]>([]);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    
    useEffect(() => {
        if (userContext.journalMetaData) {
            const hasData = userContext.journalMetaData.length > 0;
            setJournalMetaData(userContext.journalMetaData);
            setIsEmpty(!hasData); // Mark as empty if no data exists
            setLoading(false); // Data fetching is complete
        }
    }, [userContext.journalMetaData]);
    
    
    // Fetch journal entries on mount
    
    const [journalMetaData, setJournalMetaData] = useState<SQLiteJournalMetaData[]>(userContext.journalMetaData);


    // Update filtered entries when selectedDate or journalMetaData changes
    useEffect(() => {
        setFilteredJournalEntries([]);
        setFilteredJournalEntries(journalMetaData.filter(entry => entry.date === selectedDate));
    }, [selectedDate]);



    if (loading) {
        // Show a loading spinner or placeholder while waiting for data
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    // const deleteErryTing = async () => {
    //     await deleteDB();
    //     userContext.LRUCache.ClearCache();
    //     console.log('Deleted everything');
    // }


    // Extract dates for calendar highlights
    const journalEntryDates = journalMetaData.map(entry => entry.date);

    return (
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView>
            {/* <Button title="Delete DB" onPress={()=>deleteErryTing() } /> */}
            <View style={{}}>

                <AboveCalendar date={selectedDate} setShowMenu={setShowMenu} showMenu={showMenu} />
            </View>
            <View style={{}}>
                <Menu showMenu={showMenu} setShowMenu={setShowMenu}/>
            </View>
           
            <View style={{transform:[{scale:.95}]}}>

                <Calendar setDate={setSelectedDate} journalEntryDates={journalEntryDates} />
            </View>
            <View style={{}}>
                <UnderCalendar date={selectedDate} filteredJournalEntries={filteredJournalEntries} />
            </View>
           
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;



const styles = StyleSheet.create({
    container: {

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})