import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADD_TOPIC = 'ADD_TOPIC';
export const ADD_DECK_TO_TOPIC = 'ADD_DECK_TO_TOPIC';
export const ADD_DECK = 'ADD_DECK';
export const ADD_CARD = 'ADD_CARD';
export const DELETE_DECK = 'DELETE_DECK';
export const DELETE_TOPIC = 'DELETE_TOPIC';
export const INITIALIZE_DECKS = 'INITIALIZE_DECKS';
export const RESET_STATE = 'RESET_STATE ';

export function initializeDecksFromStorage() {
  return async (dispatch) => {
    try {
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState) {
        dispatch({ type: INITIALIZE_DECKS, appState: JSON.parse(savedState) });
        // console.info("savedState:", JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Error fetching decks from AsyncStorage:", error);
    }
  };
}

export function addTopic(topicName) {
  return {
    type: ADD_TOPIC,
    topicName
  };
}

export function addDeckToTopic(topicName, deckTitle) {
  return {
    type: ADD_DECK_TO_TOPIC,
    topicName,
    deckTitle
  };
}

export function addDeck(title) {
  return {
    type: ADD_DECK,
    title,
  };
}

export function addCardToDeck(title, sides_type, sides, epoch_ts) {
  return {
    type: ADD_CARD,
    title,
    card: {
      "sides_type": sides_type,
      "sides": sides,
      "epoch_ts": epoch_ts
    },
  };
}

export function deleteDeck(deckTitle) {
  return {
    type: DELETE_DECK,
    deckTitle,
  };
}

export function deleteTopic(topic) {
  return {
    type: DELETE_TOPIC,
    topic,
  };
}

export function resetState() {
  return {
    type: RESET_STATE
  };
}