import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDeckByName } from '../redux/selectors';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

function StudyScreen({ route, navigation }) {
  const { deckName } = route.params;
  const deck = useSelector((state) => selectDeckByName(state, deckName));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showSide, setShowSide] = useState(0); // Index of the side to show

  if (!deck) {
    return <Text>Deck not found!</Text>;
  }

  const { cards } = deck;

  // If there are no questions in the deck
  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <CommunityIcon name="cards-outline" style={styles.cardIcon} />
          <Text style={styles.customHeader}>{deckName}</Text>
        </View>
        <View style={styles.noCardsContainer}>
          <Text style={styles.noCardsText}>There are no cards in this deck.</Text>
        </View>

      </View>
    );
  }

  const currentCard = cards[currentCardIndex];
  // console.info("currentCard:", currentCard);

  const handleFlipCard = () => {
    const nextSide = (showSide + 1) % currentCard.sides.length;
    setShowSide(nextSide);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowSide(0);
    } else {
      navigation.navigate('Flashcards', { backTitle: 'Study' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <CommunityIcon name="cards-outline" style={styles.cardIcon} />
        <Text style={styles.customHeader}>{deckName}</Text>
      </View>

      <View style={styles.newDeckBox}>
        <TouchableOpacity style={styles.card} onPress={handleFlipCard}>
          <Text>{currentCard.sides[showSide].value}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNextCard}>
          <Text style={styles.buttonText}>Next Card</Text>
        </TouchableOpacity>
      </View>
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
  newDeckBox: {
    marginHorizontal: 20,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 20,
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
    backgroundColor: '#B89081', // Same background color as in DeckInfoScreen
    padding: 15, // Same padding
    borderRadius: 5, // Same border radius
    width: '100%', // Full width
    alignItems: 'center', // Center text horizontally
    marginBottom: 15, // Margin at the bottom
  },
  buttonText: {
    color: 'white', // Same text color as in DeckInfoScreen
    fontSize: 16 // Same font size
  },
  noCardsContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    height: 300, // Set a fixed height to allow for vertical centering
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  noCardsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555', // A mild color that matches the theme
    textAlign: 'center', // Center align the text
    marginBottom: 10,
  },
});

export default StudyScreen;
