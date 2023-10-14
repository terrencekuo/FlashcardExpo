// selectors/deckSelectors.js
import { createSelector } from 'reselect';

const getDecks = state => Object.values(state);

export const selectDecks = createSelector(
  [getDecks],
  (decks) => decks
);

const getDeckByName = (state, deckName) => state[deckName];

export const selectDeckByName = createSelector(
  [getDeckByName],
  (deck) => deck
);
