import { ADD_DECK, ADD_CARD } from '../actions/index';

function decks(state = {}, action) {
  switch (action.type) {
    case ADD_DECK:
      return {
        ...state,
        [action.title]: {
          title: action.title,
          questions: [],
        },
      };
    case ADD_CARD:
      return {
        ...state,
        [action.title]: {
          ...state[action.title],
          questions: state[action.title].questions.concat([action.card]),
        },
      };
    default:
      return state;
  }
}

export default decks;