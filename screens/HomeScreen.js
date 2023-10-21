import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTopic,
  addDeckToTopic,
  deleteDeck,
  deleteTopic
} from '../actions';
import { selectDecks } from '../selectors/deckSelectors';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import the MaterialIcons
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
  const decks = useSelector(selectDecks);
  const topics = useSelector((state) => state.topics || {});
  const dispatch = useDispatch();

  // Local state to manage selection mode
  const [inSelectionMode, setSelectionMode] = useState(false);
  const [selectedDecks, setSelectedDecks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [showEmptyTextWarning, setShowEmptyTextWarning] = useState(false);

  const handleGroupDecks = () => {
    setShowTopicsModal(true);
  };

  const handleSelectTopic = (selectedTopic) => {
      if (selectedTopic === '<Create new topic>') {
          setShowTopicsModal(false);  // Close the topics modal first
          setTimeout(() => setModalVisible(true), 300);  // Delay the opening of the next modal to prevent flashing
      } else {
          selectedDecks.forEach((deckTitle) => {
              dispatch(addDeckToTopic(selectedTopic, deckTitle));
          });
          setSelectedDecks([]);
          setShowTopicsModal(false);
      }
  };

  const cancelTopicCreation = () => {
      setModalVisible(false);
      setTopicName('');  // Clear the text box
      setShowEmptyTextWarning(false);  // Reset the warning
  };

  const confirmGrouping = () => {
      if (!topicName.trim()) {
          setShowEmptyTextWarning(true);
          return;
      }
      dispatch(addTopic(topicName));
      selectedDecks.forEach((deckTitle) => {
          dispatch(addDeckToTopic(topicName, deckTitle));
      });
      setSelectedDecks([]);
      setSelectionMode(false);
      setModalVisible(false);
      setTopicName('');  // Reset the topic name after confirming
      setShowEmptyTextWarning(false);  // Reset the warning
  };

  const cancelGrouping = () => {
    setShowTopicsModal(false);
    setSelectedDecks([]);  // Reset the selected decks
  };

  const renderRightAction = (onDelete) => (
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const handleDeleteDeck = (deckTitle) => {
    dispatch(deleteDeck(deckTitle));  // Dispatch deleteDeck action to delete the deck
  };

  const handleDeleteTopic = (topic) => {
    dispatch(deleteTopic(topic));  // Dispatch deleteTopic action to delete the topic
  };

  // Get all deck titles that are associated with any topic
  const getDecksInTopics = () => {
    let decksInTopics = [];
    Object.values(topics).forEach(topicDecks => {
      decksInTopics = [...decksInTopics, ...topicDecks];
    });
    return decksInTopics;
  };

  const decksInTopics = getDecksInTopics();

  // Filter out decks that are associated with a topic
  const standaloneDecks = decks.filter(deck => deck && deck.title && !decksInTopics.includes(deck.title));


  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert('Storage successfully cleared!');
    } catch (e) {
      alert('Failed to clear the storage.');
    }
  };  
  return (
    <View style={styles.container}>
  
      {/* Displaying Topics and their respective Decks */}
      {Object.keys(topics).map((topic) => (
        <Swipeable key={topic} renderRightActions={() => renderRightAction(() => handleDeleteTopic(topic))}>
          {/* Display Topic Titles */}
          <Text style={styles.topicTitle}>{topic}</Text>
          {topics[topic].map((deckTitle) => (
            <TouchableOpacity
              key={deckTitle}
              style={[
                styles.deckItem,
                inSelectionMode && selectedDecks.includes(deckTitle) ? styles.selectedDeck : {},
              ]}
              onPress={() => {
                if (inSelectionMode) {
                  setSelectedDecks((prev) => {
                    if (prev.includes(deckTitle)) return prev.filter((deck) => deck !== deckTitle);
                    return [...prev, deckTitle];
                  });
                } else {
                  navigation.navigate('DeckDetail', { deckName: deckTitle });
                }
              }}
            >
              <Text style={styles.deckTitle}>{deckTitle}</Text>
            </TouchableOpacity>
          ))}
        </Swipeable>
      ))}

      {/* Header for Standalone Decks */}
      {standaloneDecks.length > 0 && (
        <View style={styles.standaloneDeckContainer}>
          <Text style={styles.standaloneDeckHeader}>Standalone Decks</Text>
          <Text style={styles.standaloneDeckDescription}>Decks without a topic</Text>
        </View>
      )}

      {/* Displaying Standalone Decks */}
      <FlatList
        data={standaloneDecks}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightAction(() => handleDeleteDeck(item.title))}>
            <TouchableOpacity
              style={[
                styles.deckItem,
                inSelectionMode && selectedDecks.includes(item.title) ? styles.selectedDeck : {},
              ]}
              onPress={() => {
                if (inSelectionMode) {
                  setSelectedDecks((prev) => {
                    if (prev.includes(item.title)) return prev.filter((deck) => deck !== item.title);
                    return [...prev, item.title];
                  });
                } else {
                  navigation.navigate('DeckDetail', { deckName: item.title });
                }
              }}
            >
              <Text style={styles.deckTitle}>{item.title}</Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      <Modal animationType="slide" visible={showTopicsModal}>
          <View style={styles.modalContainer}>
              {Object.keys(topics).map((topic) => (
                  <TouchableOpacity key={topic} style={styles.topicItem} onPress={() => handleSelectTopic(topic)}>
                      <Text>{topic}</Text>
                  </TouchableOpacity>
              ))}
              
              <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => handleSelectTopic('<Create new topic>')}>
                      <Text>Create new topic</Text>
                  </TouchableOpacity>
                  
                  {/* Cancel Button */}
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelGrouping}>
                      <Text>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
  
      {/* Modal for topic name input */}
      <Modal animationType="slide" visible={isModalVisible}>
          <View style={styles.modalContainer}>
              <TextInput
                  style={styles.input}
                  placeholder="Enter topic name"
                  value={topicName}
                  onChangeText={(text) => {
                      setTopicName(text);
                      setShowEmptyTextWarning(false);  // Reset the warning when the user starts typing
                  }}
              />
              {showEmptyTextWarning && <Text style={{ color: 'red', marginBottom: 10 }}>Please enter a topic name.</Text>}
              <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={confirmGrouping}>
                      <Text>Confirm</Text>
                  </TouchableOpacity>
                  {/* Cancel Button */}
                  <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelTopicCreation}>
                      <Text>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>

      <View style={styles.fabContainer}>
        {/* In Selection Mode - Display Confirm and Cancel Icons */}
        {inSelectionMode ? (
          <>
            <TouchableOpacity style={styles.confirmIconContainer} onPress={handleGroupDecks}>
                <Icon name="check-circle" size={30} color="green" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelIconContainer} onPress={() => {
                setSelectionMode(false);
                setSelectedDecks([]); // Deselect all items when cancelling
            }}>
                <Icon name="cancel" size={30} color="red" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Clear Storage Button */}
            <TouchableOpacity style={styles.clearStorageIconContainer} onPress={clearStorage}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>

            {/* Not in Selection Mode - Display Group Decks Icon */}
            {decks.length > 0 && (
              <TouchableOpacity style={styles.groupIconContainer} onPress={() => setSelectionMode(true)}>
                <Icon name="group" size={30} color="white" />
              </TouchableOpacity>
            )}

            {/* FAB to add a new deck */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateDeck')}>
              <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  deckItem: {
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  selectedDeck: {
    backgroundColor: '#E0E0E0',
  },
  deckTitle: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  fabContainer: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  groupIconContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginRight: 5,
  },
  fab: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabIcon: {
    color: 'white',
    fontSize: 30,
  },
  clearStorageIconContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginRight: 5,
  },
  confirmIconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginRight: 10,
  },
  cancelIconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 100,
  },
  deleteText: {
    color: 'white',
    padding: 20,
  },
  standaloneDeckContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    padding: 5,
    marginTop: 20,
  },
  standaloneDeckHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  standaloneDeckDescription: {
    fontSize: 12,
    color: 'gray',
  },
  topicItem: {
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
      flex: 0.45,  // Adjust this to control the width
      padding: 15,
      backgroundColor: '#007BFF',
      borderRadius: 8,
      alignItems: 'center',
      margin: 5,   // Add some margin around the buttons
  },
  cancelButton: {
      backgroundColor: 'red',
      flex: 0.45,  // Adjust this to control the width
  },
});

export default HomeScreen;
