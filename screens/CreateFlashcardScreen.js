import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, ScrollView} from 'react-native';
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { Ionicons } from '@expo/vector-icons'; // Remember to install this package

export default function CreateFlashcardScreen({ route, navigation }) {
  const { deckName } = route.params;
  const dispatch = useDispatch();

  const [sides, setSides] = useState(['', '']);

  const handleAddSide = () => {
    if (sides.length < 4) {
      setSides(prevSides => [...prevSides, '']);
    }
  };

  const handleRemoveSide = (indexToRemove) => {
    setSides(prevSides => prevSides.filter((_, index) => index !== indexToRemove));
  };

  const handleSideChange = (text, index) => {
    const newSides = [...sides];
    newSides[index] = text;
    setSides(newSides);
  };

  const handleAddCard = () => {
    if (sides.some(side => side.trim() === '')) {
      alert('Please fill out all sides!');
      return;
    }

    dispatch(addCardToDeck(deckName, { sides }));
    setSides(['', '']); // Reset after adding
  };

  const handleStartStudying = () => {
    navigation.navigate('Home'); // Navigate back to home page
  };

  const [editingSide, setEditingSide] = useState(0);

  const handleSideClick = (index) => {
    setEditingSide(index);
  };

  return (
    <View style={styles.container}>

      {/* 1. Top Section: Sides Input */}
      <View style={styles.topSection}>
        {sides.map((side, index) => (
          <View key={index} style={styles.sideContainer}>
            <TextInput
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

      {/* 2. Middle Section: Card Overlay */}
      <View style={styles.middleSection}>
        <TouchableOpacity style={styles.card}>
          <Text>{sides[editingSide]}</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Bottom Section: Footer buttons */}
      <View style={styles.bottomSection}>
        <Button title="Start Studying" onPress={handleStartStudying} />
        <Button title="Add Flash Card" onPress={handleAddCard} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  // 1. Top Section: Sides Input
  topSection: {
    height: 250, // FIXME. shouldnt be hardcoded
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

  // 2. Middle Section: Card Overlay
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

  // 3. Bottom Section: Footer buttons
  bottomSection: {
    height: 60, // Approximate height for buttons
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
