import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { Ionicons } from '@expo/vector-icons'; // Remember to install this package

export default function CreateFlashcardScreen({ route, navigation }) {
  const { deckName } = route.params;
  const dispatch = useDispatch();

  const [sides, setSides] = useState(['', '']);

  const handleAddSide = () => {
    setSides(prevSides => [...prevSides, '']);
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

  return (
    <View style={styles.container}>
      {sides.map((side, index) => (
        <View key={index} style={styles.sideContainer}>
          <TextInput
            style={styles.input}
            value={side}
            onChangeText={(text) => handleSideChange(text, index)}
            placeholder={`Side ${index + 1}`}
          />
          {index > 1 && <Button title="Remove" onPress={() => handleRemoveSide(index)} />}
        </View>
      ))}

      {sides[sides.length - 1].trim() !== '' && (
        <TouchableOpacity onPress={handleAddSide} style={styles.iconButton}>
          <Ionicons name="add-circle-outline" size={32} color="blue" />
        </TouchableOpacity>
      )}

      <Button title="Add Flash Card" onPress={handleAddCard} />
      <Button title="Start Studying" onPress={handleStartStudying} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginRight: 10,
  },
  iconButton: {
    marginBottom: 20,
  },
});
