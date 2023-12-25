import { configureStore } from '@reduxjs/toolkit'
import decks from './reducers';

// Redux Store
//  the current redux app state lives in an object called `store`
//
//  the `store` is created by passing in a reducer and has method
//  called `getState` which returns the current state value. it also
//  has a method called `dispatch` which is used to update the
//  state and it takes in a `action obj`, and runs the reducer func
//

const store = configureStore ({
    reducer: decks
});

export default store;