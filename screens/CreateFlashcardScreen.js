import React, { useState, useRef } from 'react';  // Added useRef
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Keyboard,
 } from 'react-native';  // Added Keyboard
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePickerButton from '../components/ExtractTextFromImage';

const CardTypeEnum = {
    CUSTOM: 'Custom',
    CHINESE: 'Chinese',
  };

export default function CreateFlashcardScreen({ route, navigation }) {
    const { deckName } = route.params;
    const dispatch = useDispatch();

    // Default sides for the flashcard
    const defaultSides = [
        { label: 'Native Language', value: '' },
        { label: 'Chinese Characters', value: '' },
        { label: 'Pinyin', value: '' }
    ];
    const [sides, setSides] = useState(defaultSides);

    // Create refs for the TextInput components
    const inputRefs = useRef(sides.map(() => React.createRef()));

    // Handle changing the text of a side
    const handleSideChange = (text, index) => {
        const newSides = [...sides];
        newSides[index].value = text;
        setSides(newSides);
    };

    // Handle adding the card to the deck
    const handleAddCard = () => {
        if (sides.some(side => side.value.trim() === '')) {
            alert('Please fill out all sides!');
            return;
        }

        const epochTimeMilliseconds = Date.now();

        dispatch(addCardToDeck(deckName, CardTypeEnum.CHINESE, sides, epochTimeMilliseconds));
        setSides(defaultSides);
    };

    // Navigation function to return to the home screen
    const handleStartStudying = () => {
        navigation.navigate('Home');
    };

    return (
        <KeyboardAwareScrollView style={styles.container}>
            {/* Render each side input */}
            {sides.map((side, index) => (
                <View key={index} style={styles.sideContainer}>
                    <Text>{side.label}</Text>
                    <TextInput
                        ref={inputRefs.current[index]}
                        style={styles.input}
                        value={side.value}
                        onChangeText={(text) => handleSideChange(text, index)}
                        placeholder={`Enter ${side.label}`}
                        onSubmitEditing={() => {
                            if (index < sides.length - 1) {
                                inputRefs.current[index + 1].current.focus();
                            } else {
                                Keyboard.dismiss();
                            }
                        }}
                        returnKeyType={index < sides.length - 1 ? "next" : "done"}
                    />
                </View>
            ))}
  
            {/* Footer buttons */}
            <View style={styles.bottomSection}>
                <Button title="Start Studying" onPress={handleStartStudying} />
                <Button title="Add Flash Card" onPress={handleAddCard} />
                <ImagePickerButton></ImagePickerButton>
            </View>

        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',  // Pushes children to the edges
        marginBottom: 15,
    },
    input: {
        flex: 1,  // Takes up all available space
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        marginLeft: 10,  // Adds some spacing between the Text and TextInput
    },
    bottomSection: {
        marginTop: 'auto',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    bottomSection: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});