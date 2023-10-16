import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDeckByName } from '../selectors/deckSelectors';

function StudyScreen({ route, navigation }) {
  const { deckName } = route.params;
  const deck = useSelector((state) => selectDeckByName(state, deckName));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showSide, setShowSide] = useState(0); // Index of the side to show

  if (!deck) {
    return <Text>Deck not found!</Text>;
  }

  const { questions } = deck;

  // If there are no questions in the deck
  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>There are no cards in this deck.</Text>
      </View>
    );
  }

  const currentCard = questions[currentCardIndex];

  const handleFlipCard = () => {
    const nextSide = (showSide + 1) % currentCard.sides.length;
    setShowSide(nextSide);
  };

  const handleNextCard = () => {
    if (currentCardIndex < questions.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowSide(0);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleFlipCard}>
        <Text>{currentCard.sides[showSide]}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNextCard}>
        <Text>Next Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
  },
});

export default StudyScreen;
