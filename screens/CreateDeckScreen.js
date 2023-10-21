import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { addDeck } from '../actions/index';

function CreateDeckScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);  // State to control the visibility of the error message

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (title.trim() === '') {
      setShowError(true);
      return;
    }
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
      {showError && <Text style={{ color: 'red', marginBottom: 10 }}>Deck name cannot be empty.</Text>}
      <Button title="Create Deck" onPress={handleSubmit} />
    </View>
  );
}

export default CreateDeckScreen;
