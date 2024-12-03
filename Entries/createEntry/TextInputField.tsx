import { textStyles } from '@/Styles/Styles';
import { Text, View, StyleSheet, TextInput, Keyboard } from 'react-native'

interface TextInputFieldProps {
  setText:React.Dispatch<React.SetStateAction<string>>
}

const TextInputField: React.FC<TextInputFieldProps> = ({ setText }) => {
    return (
        <View style={styles.container}>
         




         <TextInput
        style={textStyles.entryText}
        placeholder="Write your journal entry here..."
        placeholderTextColor="#888"
        multiline
        returnKeyType="done" // Displays the "done" button on the keyboard
        onSubmitEditing={() => Keyboard.dismiss()} // Dismisses the keyboard when "done" is pressed
        onChangeText={setText}
      />


          {/* <View style={styles.linesContainer}>
            {Array.from({ length: 15 }).map((_, index) => (
              <View key={index} style={styles.line} />
            ))}
          </View>
          
         
          <TextInput
        style={styles.textInput}
        placeholder="Write your journal entry here..."
        placeholderTextColor="#888"
        multiline
        returnKeyType="done" // Displays the "done" button on the keyboard
        onSubmitEditing={() => Keyboard.dismiss()} // Dismisses the keyboard when "done" is pressed
        onChangeText={setText}
      /> */}
        </View>
      );
    };
    export default TextInputField;
    
    const styles = StyleSheet.create({
      container: {
        height:300,
        width:'85%',
        marginHorizontal:20,
        marginTop:10
      }
      // container: {
      //   margin: 16,
      //   padding: 8,
      //   backgroundColor: '#FAF0E6', // light beige for journal paper
      //   borderRadius: 10,
      //   shadowColor: '#000',
      //   shadowOpacity: 0.1,
      //   shadowRadius: 4,
      //   elevation: 4,
      //   borderWidth: 1,
      //   borderColor: '#D1C4B4', // subtle border to look like the edge of a page
      // },
      // linesContainer: {
      //   position: 'absolute',
      //   top: 0,
      //   left: 0,
      //   right: 0,
      //   bottom: 0,
      //   zIndex: -1, // Place it behind the TextInput
      // },
      // line: {
      //   borderBottomWidth: 1,
      //   borderColor: '#D3C4B4',
      //   marginBottom: 22.3, // Adjust spacing for line height
      // },
      // textInput: {
      //   height: 300,
      //   fontSize: 18,
      //   lineHeight: 24,
      //   paddingVertical: 12,
      //   paddingHorizontal: 16,
      //   fontFamily: 'serif', // Use a typewriter or journal-style font if available
      //   color: '#333',
      //   textAlignVertical: 'top',
      // },
    });
    