import React, {
    useState,
    useRef,
    useLayoutEffect,
} from 'react';  // Added useRef
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
import {
    getCardInfo,
    CardTypeEnum,
} from '../utils/constants';
import ImagePickerButton from '../components/ExtractTextFromImage';
import {
    EnglishToHanzi,
    EnglishToFrench,
    EnglishToSpanish,
} from '../components/TranslateLang';
import pinyin from "pinyin";

export default function CreateFlashcardScreen({ route, navigation }) {
    const { deckName, cardType } = route.params;
    const dispatch = useDispatch();
    const theCardInfo = getCardInfo(cardType)

    // Default sides for the flashcard
    const [sides, setSides] = useState(getCardInfo(cardType).sideType);

    // Create refs for the TextInput components
    const inputRefs = useRef(sides.map(() => React.createRef()));

    // Handle changing the text of a side
    // TODO: no need to call hook everytime text changes
    const handleSideChange = (text, index) => {
        const newSides = [...sides];
        newSides[index].value = text;
        setSides(newSides);
    };

    // Handle text input complete
    const handleCompleteSideInput = (text, index) => {
        // do not auto complete text if the input is empty
        if (text.length == 0) return

        if (theCardInfo.cardType == CardTypeEnum.CHINESE) {
            if (index == 0) {
                EnglishToHanzi(text).then(hanziOutput => {
                    const newSides = [...sides];
                    newSides[1].value = hanziOutput;

                    const pinyinOutput = pinyin(hanziOutput, {
                        segment: true,
                        group: true
                    })

                    console.log(pinyinOutput)
                    let pinyinStr = ""
                    for (pinyinList of pinyinOutput) {
                        console.log("list", pinyinList)
                        pinyinStr += pinyinList[0]
                    }
                    newSides[2].value = pinyinStr;

                    setSides(newSides);
                })
            }
        } else if (theCardInfo.cardType == CardTypeEnum.FRENCH) {
            if (index == 0) {
                EnglishToFrench(text).then(output => {
                    const newSides = [...sides];
                    newSides[1].value = output;
                    setSides(newSides);
                })
            }
        } else if (theCardInfo.cardType == CardTypeEnum.SPANISH) {
            if (index == 0) {
                EnglishToSpanish(text).then(output => {
                    const newSides = [...sides];
                    newSides[1].value = output;
                    setSides(newSides);
                })
            }
        }
    };

    // Handle adding the card to the deck
    const handleAddCard = () => {
        if (sides.some(side => side.value.trim() === '')) {
            alert('Please fill out all sides!');
            return;
        }

        const epochTimeMilliseconds = Date.now();

        dispatch(addCardToDeck(deckName, theCardInfo.cardType, sides, epochTimeMilliseconds));
        setSides(getCardInfo(cardType).sideType);
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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigateToFlashcards()}
                    style={{ marginRight: 10 }}>
                    <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

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
                                onBlur={() => handleCompleteSideInput(side.value, index)} // Added onBlur event
                                placeholder={`Enter ${side.label}`}
                                onSubmitEditing={() => {
                                    handleCompleteSideInput(side.value, index)
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
                            scrollEnabled={false} // resolves the VirtualizedLists error
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
    doneButton: {
        marginRight: 15,
        color: '#B89081', // Replace with your desired color
    },
});