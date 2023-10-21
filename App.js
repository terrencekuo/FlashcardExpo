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
        // Fetch the entire app state (both decks and topics) from AsyncStorage using the key 'appState'.
        const savedState = await AsyncStorage.getItem('appState');
        if (savedState) {
          dispatch({ type: 'INITIALIZE_DECKS', appState: JSON.parse(savedState) });
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
