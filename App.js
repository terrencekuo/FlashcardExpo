import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeDecksFromStorage } from './actions';  // Import the new action creator

function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeDecksFromStorage());  // Use the new action creator
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
