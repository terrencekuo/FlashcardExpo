import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function CreateFlashcardScreen({ route, navigation }) {
  // Extracting deckName from route parameters
  const { deckName } = route.params;

  // Setting up Redux dispatch
  const dispatch = useDispatch();

  // State for managing the content of the sides
  const [sides, setSides] = useState(['', '']);

  // State to determine which side is being edited
  const [editingSide, setEditingSide] = useState(0);

  // Reference to the main input inside the card for setting focus
  const cardInputRef = useRef(null);

  // Function to add a new side (up to 4 sides)
  const handleAddSide = () => {
    if (sides.length < 4) {
      setSides(prevSides => [...prevSides, '']);
    }
  };

  // Function to remove a side by its index
  const handleRemoveSide = (indexToRemove) => {
    setSides(prevSides => prevSides.filter((_, index) => index !== indexToRemove));
  };

  // Function to handle change of content on a side
  const handleSideChange = (text, index) => {
    const newSides = [...sides];
    newSides[index] = text;
    setSides(newSides);
  };

  // Function to dispatch the creation of a new card to Redux
  const handleAddCard = () => {
    if (sides.some(side => side.trim() === '')) {
      alert('Please fill out all sides!');
      return;
    }
    dispatch(addCardToDeck(deckName, { sides }));
    setSides(['', '']);
  };

  // Function to navigate back to the Home screen
  const handleStartStudying = () => {
    navigation.navigate('Home');
  };

  // Function to handle the focus shift to the main card input
  const handleSideFocus = (index) => {
    setEditingSide(index);
    cardInputRef.current.focus();
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>

      {/* Top Section: Sides Input */}
      <View style={styles.topSection}>
        {sides.map((side, index) => (
          <View key={index} style={styles.sideContainer}>
            <TextInput
              onFocus={() => handleSideFocus(index)}
              style={[styles.input, (index === sides.length - 1 && index >= 2) && styles.inputWithTab]}
              value={side}
              onChangeText={(text) => handleSideChange(text, index)}
              placeholder={`Side ${index + 1}`}
            />
            {index === sides.length - 1 && index >= 2 && (
              <TouchableOpacity onPress={() => handleRemoveSide(index)} style={styles.deleteTab} />
            )}
          </View>
        ))}
        {sides.length < 4 && (
          <TouchableOpacity onPress={handleAddSide} style={styles.addButtonContainer}>
            <Ionicons name="add-circle-outline" size={24} color="blue" />
          </TouchableOpacity>
        )}
      </View>

      {/* Middle Section: Card Overlay */}
      <View style={styles.middleSection}>
        <View style={styles.card}>
          <TextInput
            ref={cardInputRef}
            value={sides[editingSide]}
            onChangeText={(text) => handleSideChange(text, editingSide)}
            style={styles.cardTextInput}
          />
        </View>
      </View>

      {/* Bottom Section: Footer buttons */}
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
  topSection: {
    height: 250,
  },
  sideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
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
  middleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomSection: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
