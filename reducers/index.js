import { ADD_DECK, ADD_CARD } from '../actions/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

function decks(state = {}, action) {
  switch (action.type) {
    case 'INITIALIZE_DECKS':
      return action.decks;
    case ADD_DECK:
      const newStateDeck = {
        ...state,
        [action.title]: {
          title: action.title,
          questions: [],
        },
      };
      AsyncStorage.setItem('decks', JSON.stringify(newStateDeck));
      return newStateDeck;
    case ADD_CARD:
      const newStateCard = {
        ...state,
        [action.title]: {
          ...state[action.title],
          questions: state[action.title].questions.concat([action.card]),
        },
      };
      AsyncStorage.setItem('decks', JSON.stringify(newStateCard));
      return newStateCard;
    default:
      return state;
  }
}

export default decks;