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
import { CommonActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { addDeck } from '../redux/actions';
import { CardTypeEnum } from '../utils/constants';

function CreateDeckScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [cardType, setCardType] = useState(CardTypeEnum.CHINESE);
  const dispatch = useDispatch();

  // reset the route so that user can't go back after creating a deck
  const navigateToCreateFlashcard = (deckName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'CreateFlashcard',
            params: {
              deckName: deckName,
              cardType: cardType,
              backTitle: 'CreateDeck',
            }
          },
        ],
      })
    );
  };

  const handleSubmit = () => {
    if (title.trim() === '') {
      setShowError(true);
      return;
    }
    dispatch(addDeck(title));
    setTitle('');
    navigateToCreateFlashcard(title)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.customHeader}>Create New Deck</Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.newDeckBox}>
          <Text style={styles.label}>Deck Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter deck title"
            value={title}
            onChangeText={setTitle}
          />
          {showError && <Text style={styles.errorText}>Deck name cannot be empty.</Text>}
          <Text style={styles.label}>Deck Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={cardType}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue) => setCardType(itemValue)}>
              {Object.entries(CardTypeEnum).map(([key, value]) => (
                <Picker.Item key={key} label={value} value={value} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Deck</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: "#534A4A",
    paddingHorizontal: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    color: "#534A4A",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 16, // Smaller text size for the items
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
  input: {
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: '#F8485E',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#B89081',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default CreateDeckScreen;
