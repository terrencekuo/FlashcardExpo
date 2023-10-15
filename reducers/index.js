import { ADD_DECK, ADD_CARD, ADD_TOPIC, ADD_DECK_TO_TOPIC } from '../actions/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

function decks(state = { topics: {} }, action) {
  let newState = state;

  switch (action.type) {
    case 'INITIALIZE_DECKS':
      return action.decks;

    case ADD_DECK:
      newState = {
        ...state,
        [action.title]: {
          title: action.title,
          questions: [],
        },
      };
      break;

    case ADD_CARD:
      newState = {
        ...state,
        [action.title]: {
          ...state[action.title],
          questions: state[action.title].questions.concat([action.card]),
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
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [action.topicName]: [...state.topics[action.topicName], action.deckTitle]
        }
      };
      break;

    default:
      return state;
  }

  // Persist the entire newState to AsyncStorage
  AsyncStorage.setItem('decks', JSON.stringify(newState));
  return newState;
}

export default decks;
