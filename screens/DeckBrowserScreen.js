import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectDecks } from '../selectors/deckSelectors';

function DeckBrowserScreen({ navigation }) {
    const decks = useSelector(selectDecks);

    const renderDeck = ({ item }) => (
      <TouchableOpacity style={{ padding: 20 }} onPress={() => navigation.navigate('Study', { deckName: item.title })}>
          <Text>{item.title}</Text>
      </TouchableOpacity>
  );

    return (
        <View style={{ padding: 20 }}>
            {decks && decks.length ? (
                <FlatList 
                    data={decks}
                    renderItem={renderDeck}
                    keyExtractor={item => item.title}
                />
            ) : (
                <Text>No decks available. Create one!</Text>
            )}
        </View>
    );
}

export default DeckBrowserScreen;
