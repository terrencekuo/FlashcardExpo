import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTopic, addTopic, addDeckToTopic } from '../redux/actions'; // Import actions

function TopicSelectionScreen({ route, navigation }) {
  const { selectedDecks, onTopicSelect } = route.params;
  const topics = useSelector(state => state.topics);
  const dispatch = useDispatch();
  const [newTopicName, setNewTopicName] = useState('');

  const handleTopicSelect = (topicName, isNewTopic = false) => {
    if (isNewTopic) {
        dispatch(addTopic(topicName));
    }

    // Move selected decks to the chosen topic
    selectedDecks.forEach(deckTitle => {
        dispatch(addDeckToTopic(topicName, deckTitle));
    });

    // Check if any topic becomes empty after moving decks
    const updatedTopics = { ...topics };
    Object.keys(updatedTopics).forEach(topic => {
        updatedTopics[topic] = updatedTopics[topic].filter(deckTitle => !selectedDecks.includes(deckTitle));
        if (updatedTopics[topic].length === 0) {
            // Delete empty topic
            dispatch(deleteTopic(topic));
        }
    });

    onTopicSelect(topicName, isNewTopic);
    navigation.goBack();
  };

  const createNewTopic = () => {
    if (newTopicName.trim() === '') {
      alert('Topic name cannot be empty');
      return;
    }
    handleTopicSelect(newTopicName, true);
  };

  return (
    <View style={styles.container}>
      {/* Existing Topics Section */}
      <View style={styles.topicsBox}>
        <Text style={styles.boxHeader}>Move to Existing Topic</Text>
        <FlatList
          data={Object.keys(topics)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.topicItem} onPress={() => handleTopicSelect(item)}>
              <Text style={styles.topicText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* New Topic Creation Section */}
      <View style={styles.newTopicBox}>
        <Text style={styles.boxHeader}>Create New Topic</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new topic name"
            value={newTopicName}
            onChangeText={setNewTopicName}
          />
          <Button title="Create" onPress={createNewTopic} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  topicsBox: {
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  newTopicBox: {
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    textAlign: 'center',
  },
  topicItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  topicText: {
    fontSize: 16,
  },
  inputContainer: {
    marginTop: 10,
    padding: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default TopicSelectionScreen;
