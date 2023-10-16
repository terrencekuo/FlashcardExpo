import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const MAX_SIDES = 3;

export default function CreateFlashcardScreen({ route, navigation }) {
    const { deckName } = route.params;
    const dispatch = useDispatch();

    const defaultSides = [
        { label: 'Native Language', value: '' },
        { label: 'Chinese Characters', value: '' },
        { label: 'Pinyin', value: '' }
    ];
    const [sides, setSides] = useState(defaultSides);
    const [editingSide, setEditingSide] = useState(0);
    const cardInputRef = useRef(null);

    // Function to handle addition of a new side
    const handleAddSide = () => {
        if (sides.length < MAX_SIDES) {
            setSides(prevSides => [...prevSides, '']);
        }
    };

    // Function to remove a side based on its index
    const handleRemoveSide = (indexToRemove) => {
        setSides(prevSides => prevSides.filter((_, index) => index !== indexToRemove));
    };

    // Function to handle changing the text of a side
    const handleSideChange = (text, index) => {
        const newSides = [...sides];
        newSides[index].value = text;
        setSides(newSides);
    };

    const handleAddCard = () => {
        if (sides.some(side => side.value.trim() === '')) {
            alert('Please fill out all sides!');
            return;
        }

        const cardValues = sides.map(side => side.value);
        dispatch(addCardToDeck(deckName, { sides: cardValues }));
        setSides(defaultSides);
    };

    // Navigation function to return to the home screen
    const handleStartStudying = () => {
        navigation.navigate('Home');
    };

    // Function to handle when a side input is focused
    const handleSideFocus = (index) => {
        setEditingSide(index);
        cardInputRef.current.focus();
    };

    const lastTapRef = useRef(null);
    const tapCountRef = useRef(0);

    return (
      <KeyboardAwareScrollView style={styles.container}>

          {/* Sides Input Rows */}
          <View style={styles.rowSection}>
            {sides.map((side, index) => (
                <View key={index} style={styles.sideContainer}>
                    <Text>{side.label}</Text>
                    <TextInput
                        onFocus={() => handleSideFocus(index)}
                        style={[
                            styles.input,
                            (index === sides.length - 1 && index >= 2) && styles.inputWithTab,
                            editingSide === index && styles.activeInput
                        ]}
                        value={side.value}
                        onChangeText={(text) => handleSideChange(text, index)}
                        placeholder={`Enter ${side.label}`}
                    />
                    {index === sides.length - 1 && index >= 2 && (
                        <TouchableOpacity onPress={() => handleRemoveSide(index)} style={styles.deleteTab} />
                    )}
                </View>
            ))}
            {sides.length < MAX_SIDES && (
                <TouchableOpacity onPress={handleAddSide} style={styles.addButtonContainer}>
                    <Ionicons name="add-circle-outline" size={24} color="blue" />
                </TouchableOpacity>
            )}
          </View>

          {/* Card Overlay */}
          <View style={styles.cardSection}>
              <View style={styles.card}>
                  <TextInput
                      ref={cardInputRef}
                      value={sides[editingSide]}
                      onChangeText={(text) => handleSideChange(text, editingSide)}
                      style={styles.cardTextInput}
                  />
              </View>
          </View>

          {/* Footer buttons */}
          <View style={styles.bottomSection}>
              <Button title="Start Studying" onPress={handleStartStudying} />
              <Button title="Add Flash Card" onPress={handleAddCard} />
          </View>

      </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    rowSection: {
        marginBottom: 15,  // gives some space between rows and card
    },
    sideContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
    },
    inputWithTab: {
        marginRight: 8,
    },
    deleteTab: {
        width: 8,
        height: '100%',
        backgroundColor: 'red',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    addButtonContainer: {
        alignItems: 'flex-end',
        marginBottom: 15,
    },
    cardSection: {
        marginBottom: 20,  // gives some space between card and footer
    },
    card: {
        width: '100%',
        height: 300,
        backgroundColor: '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    cardTextInput: {
        fontSize: 16,
        color: '#333',
    },
    bottomSection: {
        marginTop: 'auto',  // this pushes the footer to the bottom
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activeInput: {
      borderColor: 'blue',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
  },
});
