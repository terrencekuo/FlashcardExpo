import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCardToDeck } from '../actions/index';
import { selectDeckByName } from '../selectors/deckSelectors';


function CreateFlashcardScreen({ route, navigation }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const dispatch = useDispatch();

  const deckName = route.params.deckName;
  const deck = useSelector(state => selectDeckByName(state, deckName));

  const handleSubmit = () => {
    dispatch(addCardToDeck(route.params.deckName, { front, back }));
    setFront('');
    setBack('');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ borderWidth: 1, padding: 10, width: '80%', marginBottom: 20 }}
        placeholder="Enter front"
        value={front}
        onChangeText={setFront}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, width: '80%', marginBottom: 20 }}
        placeholder="Enter back"
        value={back}
        onChangeText={setBack}
      />
      <Button title="Add Flashcard" onPress={handleSubmit} />
      {deck && deck.questions.length > 0 && 
        <Button title="Start Studying" onPress={() => navigation.navigate('Home')} />
      }
    </View>
  );
}

export default CreateFlashcardScreen;
