import React, {
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTopic,
  addDeckToTopic,
  deleteDeck,
  deleteTopic,
  resetState
} from '../redux/actions';
import { selectDecks } from '../redux/selectors';
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
  const slideAnim = useState(new Animated.Value(0))[0]; // Initial value for sliding

  const Footer = () => {
    const hasSelectedDecks = selectedDecks.length > 0;
    if (!inSelectionMode || !hasSelectedDecks) return null;

    const handleDeleteSelected = () => {
      selectedDecks.forEach((deckTitle) => {
        // Dispatch deleteDeck action to delete the deck
        dispatch(deleteDeck(deckTitle));

        // Check if the deck is part of a topic
        Object.keys(topics).forEach(topic => {
          if (topics[topic].includes(deckTitle)) {
            // Remove deck from topic
            dispatch(removeDeckFromTopic(topic, deckTitle));

            // Check if the topic is now empty
            if (topics[topic].length === 1) {
              // If empty, delete the topic
              dispatch(deleteTopic(topic));
            }
          }
        });
      });

      // Reset selection mode and selected decks
      setSelectedDecks([]);
      setSelectionMode(false);
    };

    const handleCreateNewTopic = () => {
      setShowTopicsModal(true);
    };

    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={handleDeleteSelected}>
          <Icon name="delete" size={30} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateNewTopic}>
          <Icon name="add-circle-outline" size={30} color="green" />
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    // This effect runs when 'inSelectionMode' changes.
    if (!inSelectionMode) {
      setSelectedDecks([]); // Reset the selected decks when exiting selection mode
    }
  }, [inSelectionMode]);

  // Update the navigation options
  React.useLayoutEffect(() => {
    if (decks.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => setSelectionMode(prevMode => !prevMode)}>
            <Text style={{ marginRight: 15 }}>{inSelectionMode ? 'Done' : 'Edit'}</Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ headerRight: null });
    }
  }, [navigation, inSelectionMode, decks.length]);

  const handleDeckPress = (deckTitle) => {
    if (inSelectionMode) {
      let newSelectedDecks = selectedDecks.includes(deckTitle) 
        ? selectedDecks.filter(deck => deck !== deckTitle)
        : [...selectedDecks, deckTitle];
      setSelectedDecks(newSelectedDecks);
    } else {
      navigation.navigate('DeckDetail', { deckName: deckTitle });
    }
  };

  const DeckItem = ({ deckTitle, isSelected, onPress }) => {
    return (
      <TouchableOpacity
          style={[styles.deckItem, { paddingLeft: inSelectionMode ? 45 : 15 }]}
          onPress={() => onPress(deckTitle)}
      >
          {inSelectionMode && (
              <View style={styles.selectionCircle}>
                  <Icon name={isSelected ? "radio-button-checked" : "radio-button-unchecked"} size={24} />
              </View>
          )}
          <Text style={styles.deckTitle}>{deckTitle}</Text>
      </TouchableOpacity>
    );
  };

  const handleToggleSelection = (deckTitle) => {
    if (selectedDecks.includes(deckTitle)) {
      setSelectedDecks(selectedDecks.filter(title => title !== deckTitle));
    } else {
      setSelectedDecks([...selectedDecks, deckTitle]);
    }
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
      dispatch(resetState());  // Reset the Redux state
      alert('Storage successfully cleared!');
    } catch (e) {
      alert('Failed to clear the storage.', e);
      console.error("Failed to clear the storage.", e);
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
              <DeckItem 
              deckTitle={deckTitle}
              isSelected={inSelectionMode && selectedDecks.includes(deckTitle)}
              onPress={() => handleDeckPress(deckTitle)}
            />
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
            <DeckItem 
              deckTitle={item.title}
              isSelected={selectedDecks.includes(item.title)}
              onPress={handleToggleSelection}
            />
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

      {inSelectionMode && (
        // Footer appears when in selection mode
        <Footer/>
      )}
      {!inSelectionMode && (
        <View style={styles.fabContainer}>
            {/* Clear Storage Button */}
            <TouchableOpacity style={styles.clearStorageIconContainer} onPress={clearStorage}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>

            {/* FAB to add a new deck */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateDeck')}>
              <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
      )}
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
    paddingLeft: 45,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    right: 15, // Align to the right side
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
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
  selectionCircle: {
    marginRight: 10,
    position: 'absolute',
    left: 0, // Initially off-screen
    justifyContent: 'center',
    alignItems: 'center',
    // Set size and other styles for the circle
    zIndex: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
});

export default HomeScreen;