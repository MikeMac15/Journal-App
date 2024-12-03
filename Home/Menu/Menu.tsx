import { textStyles } from '@/Styles/Styles';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native'

interface MenuProps {
    showMenu: boolean;
    setShowMenu: (showMenu: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({ showMenu, setShowMenu }) => {
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate height
        Animated.timing(animatedHeight, {
            toValue: showMenu ? 200 : 0, // Target height
            duration: 300, // Duration of height animation
            easing: Easing.ease,
            useNativeDriver: false, // Height animations cannot use native driver
        }).start(() => {
            // After height animation, fade in or out menu items
            Animated.timing(animatedOpacity, {
                toValue: showMenu ? 1 : 0, // Fully visible if showMenu is true
                duration: 200, // Duration of the fade animation
                easing: Easing.ease,
                useNativeDriver: true, // Opacity animations can use native driver
            }).start();
        });
    }, [showMenu]);

    const MenuItem = ({ title, location }: { title: string; location: string }) => {
        const navToLocation = () => {
            switch (location) {
                case 'Search':
                    // router.push('/(Search)');
                    break;
                case 'Settings':
                    router.push('/(Settings)');
                    break;
                case 'Chapters':
                    router.push('/(Chapters)');
                    break;
                case 'All Entries':
                    router.push('/(AllEntries)');
                    break;
                default:
                    break;
            }
        };

        return (
            <TouchableOpacity onPress={navToLocation} style={{alignItems:'center'}}>
                <Text style={[styles.titleText, textStyles.entryText]}>{title}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
            <Animated.View style={{ opacity: animatedOpacity }}>
                <MenuItem title="Chapters" location="Chapters" />
                <MenuItem title="All Entries" location="All Entries" />
                <MenuItem title="Search" location="Search" />
                <MenuItem title="Settings" location="Settings" />
            </Animated.View>
        </Animated.View>
    );
};


export default Menu;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fbfbfb', // Optional for better visibility
    },
    menuList: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },
    titleText: {
        padding: 10,
        fontSize: 20,
        lineHeight: 30,
        letterSpacing: 5,
        borderColor:'#000',
        borderBottomWidth:0.25,
        textAlign:'center'
        
    },
});