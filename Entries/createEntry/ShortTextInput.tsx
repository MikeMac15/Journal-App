import { textStyles } from '@/Styles/Styles';
import { Text, View, StyleSheet, TextInput } from 'react-native'

interface ShortTextInputProps {
    setText: React.Dispatch<React.SetStateAction<string>>;
    text: string;
    type: string;
}

const ShortTextInput: React.FC<ShortTextInputProps> = ({ setText , type, text }) => {
    return (
        <View style={{}}>
            <TextInput style={textStyles.entryText} placeholder={type} value={text} onChangeText={setText} />
        </View>
    )
}

export default ShortTextInput;



const styles = StyleSheet.create({
    container: {

    },

})