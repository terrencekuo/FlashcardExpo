import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const savedDecks = await AsyncStorage.getItem('decks');
        if (savedDecks) {
          dispatch({ type: 'INITIALIZE_DECKS', decks: JSON.parse(savedDecks) });
        }
      } catch (error) {
        console.error("Error fetching decks from AsyncStorage:", error);
      }
    }
    fetchData();
  }, []);

  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppInitializer>
    </Provider>
  );
}
