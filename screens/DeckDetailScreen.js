import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDeckByName } from '../selectors/deckSelectors';

function DeckDetailScreen({ navigation, route }) {
  const { deckName } = route.params;
  const deck = useSelector(state => selectDeckByName(state, deckName));

  if (!deck) {
    return (
      <View style={styles.container}>
        <Text>Error: Deck not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deck.title}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Study', { deckName: deck.title })}
      >
        <Text style={styles.buttonText}>Start Studying</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.buttonSecondary]}
        onPress={() => navigation.navigate('CreateFlashcard', { deckName: deck.title })}
      >
        <Text style={styles.buttonText}>Add Cards</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  buttonSecondary: {
    backgroundColor: '#555'
  }
});

export default DeckDetailScreen;
