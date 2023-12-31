import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDeckByName } from '../redux/selectors';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';


function DeckInfoScreen({ navigation, route }) {
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
      <View style={styles.titleContainer}>
        <CommunityIcon name="cards-outline" style={styles.cardIcon} />
        <Text style={styles.customHeader}>{deck.title}</Text>

      </View>

      <View style={styles.newDeckBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Study', { deckName: deck.title, backTitle: 'DeckDetail' })}
        >
          <Text style={styles.buttonText}>Start Studying</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate('CreateFlashcard', {
            deckName: deck.title,
            cardType: deck.cardInfo.cardType,
            backTitle: 'DeckDetail'
          })}
        >
          <Text style={styles.buttonText}>Add Cards</Text>
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#B89081',
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
});

export default DeckInfoScreen;
