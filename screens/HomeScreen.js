import React from 'react';
import { View, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDecks } from '../selectors/deckSelectors';

function HomeScreen({ navigation }) {
  const decks = useSelector(selectDecks);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Create Deck" onPress={() => navigation.navigate('CreateDeck')} />
      {decks && decks.length > 0 &&
        <Button title="Study Deck" onPress={() => navigation.navigate('DeckBrowser')} />
      }
    </View>
  );
}

export default HomeScreen;
