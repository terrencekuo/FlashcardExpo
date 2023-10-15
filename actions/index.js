export const ADD_TOPIC = 'ADD_TOPIC';
export const ADD_DECK_TO_TOPIC = 'ADD_DECK_TO_TOPIC';
export const ADD_DECK = 'ADD_DECK';
export const ADD_CARD = 'ADD_CARD';

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

export function addCardToDeck(title, card) {
  return {
    type: ADD_CARD,
    title,
    card,
  };
}
