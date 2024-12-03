import { Text, View, StyleSheet } from 'react-native'
import Date from './Date';
import FlowerLogo from './FlowerLogo';
import MainHeader from '../MainHeader';

interface AboveCalendarProps {
  date:string
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
  showMenu: boolean;
}

const AboveCalendar: React.FC<AboveCalendarProps> = ({date, setShowMenu, showMenu}) => {
  return (
<View style={styles.container}>
    <View style={{alignItems:'center',paddingRight:20, width:'33%'}}>

    <MainHeader setShowMenu={setShowMenu} showMenu={showMenu}/>
    </View>
    <FlowerLogo />
    <View style={{width:'33%'}}>

    <Date date={date} />
    </View>
</View>
)
}

export default AboveCalendar;



const styles = StyleSheet.create({
container: {
    width:'100%',
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between'
},

})