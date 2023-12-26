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
  resetState,
  removeDeckFromTopic,
} from '../redux/actions';
import { selectDecks } from '../redux/selectors';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import the MaterialIcons
import AntDesign from 'react-native-vector-icons/AntDesign';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({ navigation }) {
  const decks = useSelector(selectDecks);
  const topics = useSelector((state) => state.topics || {});
  const dispatch = useDispatch();

  // Local state to manage selection mode
  const [inSelectionMode, setSelectionMode] = useState(false);
  const [selectedDecks, setSelectedDecks] = useState([]);

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
      navigation.navigate('TopicSelection', {
        selectedDecks,
        onTopicSelect: (topicName, isNewTopic = false) => {
          if (isNewTopic) {
            // Logic for creating a new topic
            dispatch(addTopic(topicName));
          }
          // Logic to move selected decks to the chosen existing or new topic
          selectedDecks.forEach((deckTitle) => {
            dispatch(addDeckToTopic(topicName, deckTitle));
          });
          setSelectedDecks([]);
          setSelectionMode(false);
        },
        backTitle: 'Flashcards'
      });
    };

    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={handleDeleteSelected}>
          <AntDesign name="delete" style={styles.deleteIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateNewTopic}>
          <AntDesign name="addfolder" style={styles.addIcon} />
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
            <Text style={styles.editButtonText}>{inSelectionMode ? 'Done' : 'Edit'}</Text>
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
      navigation.navigate('DeckDetail', { deckName: deckTitle, backTitle: 'Flashcards' });
    }
  };

  const DeckItem = ({ deckTitle, isSelected, onPress, inSelectionMode }) => {
    const handlePress = () => {
      if (inSelectionMode) {
        onPress(deckTitle); // handleToggleSelection when in selection mode
      } else {
        handleDeckPress(deckTitle); // navigate to DeckDetail when not in selection mode
      }
    };

    return (
      <TouchableOpacity
        style={[styles.deckItem, inSelectionMode && styles.deckItemInSelection]}
        onPress={handlePress}
      >
        {inSelectionMode && (
          <View style={styles.selectionCircle}>
            <Icon
              name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
              style={styles.selectionCircleIcon} />
          </View>
        )}
        <Text style={styles.deckTitle}>
          <CommunityIcon name="cards-outline" style={styles.cardIcon} /> {deckTitle}
        </Text>
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
      <Text style={styles.customHeader}>Flashcards</Text>
      {/* Displaying Topics and their respective Decks */}
      {Object.keys(topics).map((topic) => (
        <View key={topic}>
          {/* Display Topic Titles */}
          <View style={styles.topicContainer}>
            <AntDesign name="folder1" style={styles.folderIcon} />
            <Text style={styles.topicTitle}>{topic}</Text>
          </View>

          {
            topics[topic].map((deckTitle) => (
              <DeckItem
                key={deckTitle}
                deckTitle={deckTitle}
                isSelected={selectedDecks.includes(deckTitle)}
                onPress={inSelectionMode ? handleToggleSelection : handleDeckPress}
                inSelectionMode={inSelectionMode}
              />
            ))
          }
        </View>
      ))
      }

      {/* Header for Standalone Decks */}
      {
        standaloneDecks.length > 0 && (
          <View style={styles.standaloneDeckContainer}>
            <Text style={styles.standaloneDeckHeader}>Standalone Decks</Text>
            <Text style={styles.standaloneDeckDescription}>Uncategorized Decks</Text>
          </View>
        )
      }

      {/* Displaying Standalone Decks */}
      <FlatList
        data={standaloneDecks}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View>
            <DeckItem
              deckTitle={item.title}
              isSelected={selectedDecks.includes(item.title)}
              onPress={inSelectionMode ? handleToggleSelection : handleDeckPress}
              inSelectionMode={inSelectionMode}
            />
          </View>
        )}
      />

      {
        inSelectionMode && (
          // Footer appears when in selection mode
          <Footer />
        )
      }
      {
        !inSelectionMode && (
          <View style={styles.fabContainer}>
            {/* Clear Storage Button - Debug only */}
            {/*
            <TouchableOpacity style={styles.clearStorageIconContainer} onPress={clearStorage}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>
            */}

            {/* FAB to add a new deck */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateDeck', { backTitle: 'Flashcards' })}>
              <AntDesign name="addfile" style={styles.addFileIcon} />
            </TouchableOpacity>
          </View>
        )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  customHeader: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: "#534A4A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: "#534A4A",
  },
  deckItem: {
    padding: 15,
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
    bottom: 15, // Distance from the bottom
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Aligns the button to the bottom-right
    paddingBottom: Platform.OS === 'ios' ? 40 : 30, // Additional padding for ergonomic positioning
    paddingRight: 20, // Right padding for ergonomic reach
  },
  addFileIcon: {
    fontSize: 24, // Size of the icon
    color: 'white', // Color of the icon
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
  deleteIcon: {
    fontSize: 30,
    color: '#F8485E',
  },
  addIcon: {
    fontSize: 30,
    color: '#B89081',
  },
  topicContainer: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    marginTop: 10,
    marginBottom: 5,
  },
  folderIcon: {
    fontSize: 22,
    color: '#000', // or any other color you prefer
    marginRight: 10,
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#534A4A",
  },
  cardIcon: {
    fontSize: 15,
    color: '#000', // or any other color you prefer
  },
  fab: {
    backgroundColor: '#B89081',
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
    color: '#55527C',
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
  deckItemInSelection: {
    paddingLeft: 45, // This will be used when in selection mode
  },
  selectionCircle: {
    marginRight: 10,
    position: 'absolute',
    left: 0, // Initially off-screen
    justifyContent: 'center',
    alignItems: 'center',
    // Set size and other styles for the circle
    zIndex: 1,
    color: "#534A4A",
    width: 24, // Match the size of the icon for a full circle
    height: 24,
    borderRadius: 12,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  editButtonText: {
    marginRight: 15,
    color: '#B89081', // Replace with your desired color
  },
});

export default HomeScreen;