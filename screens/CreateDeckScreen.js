import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addDeck } from '../actions/index';

function CreateDeckScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(addDeck(title));
    setTitle('');
    navigation.navigate('CreateFlashcard', { deckName: title });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ borderWidth: 1, padding: 10, width: '80%', marginBottom: 20 }}
        placeholder="Enter deck title"
        value={title}
        onChangeText={setTitle}
      />
      <Button title="Create Deck" onPress={handleSubmit} />
    </View>
  );
}

export default CreateDeckScreen;
