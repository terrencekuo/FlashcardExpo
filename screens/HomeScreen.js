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

function HomeScreen({ navigation }) {
  const decks = useSelector(selectDecks);
  const topics = useSelector((state) => state.topics || {});
  const dispatch = useDispatch();

  // Local state to manage selection mode
  const [inSelectionMode, setSelectionMode] = useState(false);
  const [selectedDecks, setSelectedDecks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [topicName, setTopicName] = useState('');

  const handleGroupDecks = () => {
    setModalVisible(true);
  };

  const confirmGrouping = () => {
    dispatch(addTopic(topicName));
    selectedDecks.forEach((deckTitle) => {
      dispatch(addDeckToTopic(topicName, deckTitle));
    });

    // Reset selections and modal visibility
    setSelectedDecks([]);
    setSelectionMode(false);
    setModalVisible(false);
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
              style={styles.deckItem}
              onPress={() => navigation.navigate('DeckDetail', { deckName: deckTitle })}
            >
              <Text style={styles.deckTitle}>{deckTitle}</Text>
            </TouchableOpacity>
          ))}
        </Swipeable>
      ))}
  
      {/* Displaying Decks */}
      <FlatList
        data={decks}
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
  
      {/* Modal for topic name input */}
      <Modal animationType="slide" visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter topic name"
            value={topicName}
            onChangeText={setTopicName}
          />
          <TouchableOpacity style={styles.modalButton} onPress={confirmGrouping}>
            <Text>Confirm</Text>
          </TouchableOpacity>
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
            {/* Not in Selection Mode - Display Group Decks Icon and FAB for new deck */}
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
    backgroundColor: '#E0E0E0',  // Highlight color for selected deck
  },
  deckTitle: {
    fontSize: 18,
  },
  groupButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
  },
  groupButtonText: {
    color: 'white',
    fontSize: 16,
  },
  confirmButton: {
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
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
    width: 130, // Width is the combined width of both buttons + padding
  },
  groupIconContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
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
  confirmIconContainer: {
    backgroundColor: 'green',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    marginRight: 10, // Margin to separate the icons
  },
  cancelIconContainer: {
    backgroundColor: 'red',
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
    width: 100, // Width of the delete button when swiped fully
  },
  deleteText: {
    color: 'white',
    padding: 20,
  },
});

export default HomeScreen;
