import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

function SelectDeckScreen({ navigation }) {
  const decks = useSelector(state => Object.values(state));

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', }}>
      <FlatList 
        data={decks}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: 'gray' }}
            onPress={() => navigation.navigate('Study', { deckName: item.title, backTitle: 'SelectDeck' })}
          >
            <Text style={{ fontSize: 20 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.title}
      />
    </View>
  );
}

export default SelectDeckScreen;
