import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

function TopicSelectionScreen({ route, navigation }) {
  const { selectedDecks, onTopicSelect } = route.params;
  const topics = useSelector(state => state.topics);
  const [newTopicName, setNewTopicName] = useState('');
  const dispatch = useDispatch();

  const handleTopicSelect = (topicName, isNewTopic = false) => {
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
      <FlatList
        data={Object.keys(topics)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.topicItem} onPress={() => handleTopicSelect(item)}>
            <Text style={styles.topicText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.newTopicContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new topic name"
          value={newTopicName}
          onChangeText={setNewTopicName}
        />
        <Button title="Create New Topic" onPress={createNewTopic} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topicItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  topicText: {
    fontSize: 18,
  },
  newTopicContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default TopicSelectionScreen;
