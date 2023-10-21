export const ADD_TOPIC = 'ADD_TOPIC';
export const ADD_DECK_TO_TOPIC = 'ADD_DECK_TO_TOPIC';
export const ADD_DECK = 'ADD_DECK';
export const ADD_CARD = 'ADD_CARD';
export const DELETE_DECK = 'DELETE_DECK';
export const DELETE_TOPIC = 'DELETE_TOPIC';

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

export function addCardToDeck(title, sides) {
  return {
    type: ADD_CARD,
    title,
    card: {sides},
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