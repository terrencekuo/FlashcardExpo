import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CreateDeckScreen from '../screens/CreateDeckScreen';
import CreateFlashcardScreen from '../screens/CreateFlashcardScreen';
import StudyScreen from '../screens/StudyScreen';
import DeckDetailScreen from '../screens/DeckDetailScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateDeck" component={CreateDeckScreen} />
      <Stack.Screen name="CreateFlashcard" component={CreateFlashcardScreen} />
      <Stack.Screen name="Study" component={StudyScreen} />
      <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
