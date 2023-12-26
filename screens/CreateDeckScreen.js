import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addDeck } from '../redux/actions';

function CreateDeckScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (title.trim() === '') {
      setShowError(true);
      return;
    }
    dispatch(addDeck(title));
    setTitle('');
    navigation.navigate('CreateFlashcard', { deckName: title, backTitle: 'CreateDeck' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter deck title"
          value={title}
          onChangeText={setTitle}
        />
        {showError && <Text style={styles.errorText}>Deck name cannot be empty.</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Deck</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  errorText: {
    color: '#F8485E',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#B89081',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default CreateDeckScreen;
