import React, { useState, useRef } from 'react';  // Added useRef
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
    FlatList,
} from 'react-native';  // Added Keyboard
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../redux/actions';
import { selectFlashcardsByDeck } from '../redux/selectors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
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

    // reset the route so that user can't go back after creating a deck
    const navigateToFlashcards = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Flashcards', params: { backTitle: 'CreateFlashcard' } },
                ],
            })
        );
    };

    // Navigation function to return to the home screen
    const handleStartStudying = () => {
        navigateToFlashcards()
    };

    // Fetch the flashcards for the specific deck
    const flashcards = useSelector(state => selectFlashcardsByDeck(state, deckName));

    // Render Item for FlatList
    const renderItem = ({ item }) => (
        <View style={styles.cardItem}>
            {item.sides.map((side, index) => (
                <Text key={index} style={styles.cardSideText}>{side.label}: {side.value}</Text>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <CommunityIcon name="cards-outline" style={styles.cardIcon} />
                <Text style={styles.customHeader}>{deckName}</Text>
            </View>
            <KeyboardAwareScrollView style={styles.keyboardAwareScrollView}>
                <View style={styles.newDeckBox}>
                    <Text style={styles.sideTitle}>Create Flashcard</Text>
                    {/* Render each side input */}
                    {sides.map((side, index) => (
                        <View key={index} style={styles.sideContainer}>
                            <Text style={styles.sideLabel}>{side.label}</Text>
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
                        <TouchableOpacity onPress={handleStartStudying} style={styles.button}>
                            <Text style={styles.buttonText}>Start Studying</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAddCard} style={styles.button}>
                            <Text style={styles.buttonText}>Add Flash Card</Text>
                        </TouchableOpacity>
                        {/* TODO: bring back image picker */}
                        {/* <ImagePickerButton></ImagePickerButton> */}
                    </View>
                </View>

                {/* Section to display current flashcards */}
                {flashcards && flashcards.length > 0 && (
                    <View style={styles.flashcardsListContainer}>
                        <Text style={styles.sideTitle}>Deck Flashcards</Text>
                        <FlatList
                            data={flashcards}
                            keyExtractor={(item, index) => `flashcard-${index}`}
                            renderItem={renderItem}
                        />
                    </View>
                )}
            </KeyboardAwareScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center', // Center items vertically
        paddingHorizontal: 15,
    },
    cardIcon: {
        fontSize: 34, // Adjust icon size
        color: '#534A4A', // Adjust icon color
        marginRight: 10, // Spacing between icon and text
    },
    customHeader: {
        fontSize: 34,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 15,
        color: "#534A4A",
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardAwareScrollView: {
        paddingHorizontal: 20,
    },
    sideTitle: {
        fontSize: 28,
        marginBottom: 10,
        color: '#55527C',
        fontWeight: 'bold',
    },
    sideLabel: {
        fontSize: 18,
        marginBottom: 5,
        color: '#534A4A',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#B89081',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    sideContainer: {
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    newDeckBox: {
        marginHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    flashcardsListContainer: {
        marginHorizontal: 5,
        marginTop: 35,
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f7f7f7',
        borderRadius: 5,
        marginVertical: 5,
    },
    cardSideText: {
        fontSize: 16,
        color: '#333',
    },
});