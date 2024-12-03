import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { textStyles } from '@/Styles/Styles';

interface NewEntryBtnProps {
    date?: string;
}

const NewEntryBtn: React.FC<NewEntryBtnProps> = ({ date }) => {
    const router = useRouter();

    const disabled = !date; // Disable button if no date is provided

    return (
        <TouchableOpacity
            style={[
                styles.shadowContainer,
                disabled && styles.disabledShadowContainer, // Apply disabled shadow style
            ]}
            activeOpacity={disabled ? 1 : 0.7} // Disable touch feedback when disabled
            onPress={() => !disabled && router.push({ pathname: '/NewEntry', params: { date } })} // Prevent navigation when disabled
        >
            <LinearGradient
                colors={disabled ? ['#e0e0e0', '#c0c0c0'] : ['#f9c1d3', '#f1a6be', '#f9c1d3']} // Disabled gradient
                start={{ x: 0, y: 4 }}
                end={{ x: 4, y: 0 }}
                style={[styles.button, disabled && styles.disabledButton]} // Apply disabled button style
            >
                <MaterialCommunityIcons
                    style={styles.icon}
                    name="pencil-plus-outline"
                    size={24}
                    color={disabled ? '#a0a0a0' : '#fff'} // Disabled icon color
                />
                <Text style={[textStyles.entryText, styles.text, disabled && styles.disabledText, ]}>
                    Create a New Journal Entry!
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default NewEntryBtn;

const styles = StyleSheet.create({
    shadowContainer: {
        shadowColor: '#f7abc4',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        marginVertical: 20,
        marginHorizontal: 40,
    },
    disabledShadowContainer: {
        shadowColor: '#c0c0c0', // Dimmer shadow for disabled state
        shadowOpacity: 0.2,
        elevation: 2,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    disabledButton: {
        opacity: 0.7, // Slightly faded button
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
        shadowColor: '#999',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: '900',
        color: '#fff',
        shadowColor: '#999',
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.6,
    },
    disabledText: {
        color: '#a0a0a0', // Gray text for disabled state
    },
});