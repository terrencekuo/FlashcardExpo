import {
  ADD_DECK,
  ADD_CARD,
  ADD_TOPIC,
  ADD_DECK_TO_TOPIC,
  DELETE_DECK,
  DELETE_TOPIC,
  RESET_STATE
} from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux Reducers
//  this is a function that receives the current `state` and and `action obj`, decides
//  how to update state, and returns the new state
//  
//  this is essentially an event listener which handles events based on recv actions

// The initial state now has two top-level keys: 'decks' and 'topics'.
// 'decks' will store all the individual decks, and 'topics' will store the associations between topics and decks.
function decks(state = { decks: {}, topics: {} }, action) {
  let newState = state;

  switch (action.type) {
    case 'INITIALIZE_DECKS':
      return action.appState;

    case RESET_STATE:
      return { decks: {}, topics: {} };  // Reset to initial state

    case ADD_DECK:
      if (!action.title.trim()) {
        console.warn("Deck name cannot be empty.");
        return state;
      }

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
      if (!action.topicName.trim()) {
        console.warn("Topic name cannot be empty.");
        return state;
      }
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [action.topicName]: []
        }
      };
      break;

    case ADD_DECK_TO_TOPIC:
      if (!state.topics[action.topicName]) {
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
      // Create a new copy of the decks, excluding the one to delete
      const newDecks = { ...state.decks };
      delete newDecks[action.deckTitle];  // Delete the specified deck

      // Create a new copy of the topics, excluding the deck from each topic
      const newTopicsAfterDeckDeletion = { ...state.topics };
      Object.keys(newTopicsAfterDeckDeletion).forEach(topic => {
        newTopicsAfterDeckDeletion[topic] = newTopicsAfterDeckDeletion[topic].filter(deck => deck !== action.deckTitle);
      });

      // Update the state with the new decks and topics
      newState = {
        ...state,
        decks: newDecks,
        topics: newTopicsAfterDeckDeletion
      };
      break;

    case DELETE_TOPIC:
      // Create a new copy of decks, excluding those in the topic to be deleted
      const remainingDecks = { ...state.decks };
      state.topics[action.topic].forEach(deckTitle => {
        delete remainingDecks[deckTitle];  // Remove each deck in the topic
      });

      // Create a new copy of topics, excluding the topic to delete
      const remainingTopics = { ...state.topics };
      delete remainingTopics[action.topic];  // Delete the topic

      // Update the state with the remaining decks and topics
      newState = {
        ...state,
        decks: remainingDecks,
        topics: remainingTopics
      };
      break;

    default:
      return state;
  }

  // We're now saving the entire app state (both decks and topics) under the key 'appState'.
  AsyncStorage.setItem('appState', JSON.stringify(newState));

  return newState;
}

export default decks;