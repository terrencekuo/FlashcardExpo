import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import decks from '../reducers';

const store = createStore(
    decks,
    applyMiddleware(thunk)
  );

export default store;