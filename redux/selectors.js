import { createSelector } from 'reselect';

// This selector retrieves the entire decks object from the state.
// The state structure is assumed to be:
// {
//   decks: {
//     DeckName1: { ... },
//     DeckName2: { ... },
//     ...
//   },
//   topics: { ... }
// }
// So, we want to extract the 'decks' part of this structure.
const getDecks = state => Object.values(state.decks);

// Using reselect's createSelector, we create a memoized selector that
// returns all the decks as an array of deck objects.
// This is useful when you want to iterate over all decks, for example in a list view.
export const selectDecks = createSelector(
  [getDecks], // Input selectors
  (decks) => decks // Result function
);

// This selector retrieves a specific deck by its name from the state.
// Given the state structure mentioned above, we want to access something like state.decks[deckName].
const getDeckByName = (state, deckName) => state.decks[deckName];

// Using reselect's createSelector, we create a memoized selector that
// returns a specific deck based on its name.
// This is useful when you want details of a specific deck.
export const selectDeckByName = createSelector(
  [getDeckByName], // Input selectors
  (deck) => deck // Result function
);

// This selector retrieves all flashcards for a specific deck.
// It uses the selectDeckByName selector to get the deck object and then extracts the cards array from it.
export const selectFlashcardsByDeck = createSelector(
  [selectDeckByName], // Use the existing selectDeckByName selector
  (deck) => deck ? deck.cards : [] // Extract the cards array from the deck object
);