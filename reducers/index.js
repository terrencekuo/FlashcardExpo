import {
  ADD_DECK,
  ADD_CARD,
  ADD_TOPIC,
  ADD_DECK_TO_TOPIC,
  DELETE_DECK,
  DELETE_TOPIC
} from '../actions/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The initial state now has two top-level keys: 'decks' and 'topics'.
// 'decks' will store all the individual decks, and 'topics' will store the associations between topics and decks.
function decks(state = { decks: {}, topics: {} }, action) {
  let newState = state;

  switch (action.type) {
    case 'INITIALIZE_DECKS':
      return action.appState;

    case ADD_DECK:
      newState = {
        ...state, // Copy the current state
        decks: {  // Target the 'decks' key in the state
          ...state.decks,  // Copy all existing decks
          [action.title]: {  // Add a new deck with the given title
            title: action.title,  // Set the title of the new deck
            cards: [],  // Initialize an empty array for cards
          },
        },
      };
      break;

    case ADD_CARD:
      newState = {
        ...state,  // Copy the current state
        decks: {  // Target the 'decks' key in the state
          ...state.decks,  // Copy all existing decks
          [action.title]: {  // Update the specific deck where the card will be added
            ...state.decks[action.title],  // Copy the current state of the deck
            cards: state.decks[action.title].cards.concat([action.card]),  // Add the new card to the deck's cards
          },
        },
      };
      break;
        
    case ADD_TOPIC:
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [action.topicName]: []
        }
      };
      break;

    case ADD_DECK_TO_TOPIC:
      if(!state.topics[action.topicName]) {
        // Handle error: Topic does not exist
        console.error("Topic does not exist.");
        return state;
      }

      // First, remove the deck from any topic it might be associated with
      const updatedTopics = { ...state.topics };
      for (let topic in updatedTopics) {
        updatedTopics[topic] = updatedTopics[topic].filter(deckTitle => deckTitle !== action.deckTitle);
      }

      // Then, add the deck to the specified topic
      updatedTopics[action.topicName].push(action.deckTitle);

      newState = {
        ...state,
        topics: updatedTopics
      };
      break;

    case DELETE_DECK:
      newState = { ...state };  // Copy the current state
      delete newState.decks[action.deckTitle];  // Remove the specified deck from the 'decks' key
    
      // Also, remove the deck from all topics that reference it
      Object.keys(newState.topics).forEach(topic => {
        newState.topics[topic] = newState.topics[topic].filter(deck => deck !== action.deckTitle);
      });
      break;

    case DELETE_TOPIC:
      newState = { ...state };  // Copy the current state
    
      // Delete all decks associated with the topic from the 'decks' key
      newState.topics[action.topic].forEach(deckTitle => {
        delete newState.decks[deckTitle];
      });
    
      // Remove the topic itself from the 'topics' key
      delete newState.topics[action.topic];
      break;
      
    default:
      return state;
  }

  // We're now saving the entire app state (both decks and topics) under the key 'appState'.
  AsyncStorage.setItem('appState', JSON.stringify(newState));

  return newState;
}

export default decks;