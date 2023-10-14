import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
  
      <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
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
        { sides.length < 4 && (
            <TouchableOpacity onPress={handleAddSide} style={styles.addButtonContainer}>
                <Ionicons name="add-circle-outline" size={24} color="blue" />
            </TouchableOpacity>
        )}
      </ScrollView>
  
      <View style={styles.footer}>
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
    justifyContent: 'space-between',
  },
  scrollViewContainer: {
    height: '65%', // rough estimate to show 4 rows, adjust as needed
  },
  sideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,  // reduced padding between rows
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 5, // reduced padding to make input smaller
    fontSize: 14,  // reduced font size
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,  // clearance at the bottom
  },
});
