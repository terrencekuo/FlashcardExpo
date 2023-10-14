import { createStore } from 'redux';
import decks from '../reducers';

const store = createStore(decks);

export default store;
