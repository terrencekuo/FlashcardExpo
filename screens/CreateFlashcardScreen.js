import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addCardToDeck } from '../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

        dispatch(addCardToDeck(deckName, sides));
        setSides(defaultSides);
    };

    // Navigation function to return to the home screen
    const done = () => {
        navigation.navigate('Home');
    };

    return (
      <KeyboardAwareScrollView style={styles.container}>
          {/* Render each side input */}
          {sides.map((side, index) => (
              <View key={index} style={styles.sideContainer}>
                  <Text>{side.label}</Text>
                  <TextInput
                      style={styles.input}
                      value={side.value}
                      onChangeText={(text) => handleSideChange(text, index)}
                      placeholder={`Enter ${side.label}`}
                  />
              </View>
          ))}

          {/* Footer buttons */}
          <View style={styles.bottomSection}>
              <Button title="Done" onPress={done} />
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
    bottomSection: {
        marginTop: 'auto',  // this pushes the footer to the bottom
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});