import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CreateDeckScreen from '../screens/CreateDeckScreen';
import CreateFlashcardScreen from '../screens/CreateFlashcardScreen';
import StudyScreen from '../screens/StudyScreen';
import DeckDetailScreen from '../screens/DeckDetailScreen';
import TopicSelectionScreen from '../screens/TopicSelectionScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Flashcards"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#333',
        headerTitle: ' ',
      }}
    >
      <Stack.Screen
        name="Flashcards"
        component={HomeScreen}
        options={({ route }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
        />
      <Stack.Screen
        name="CreateDeck"
        component={CreateDeckScreen}
        options={({ route }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
        />
      <Stack.Screen
        name="CreateFlashcard"
        component={CreateFlashcardScreen}
        options={({ route }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
        />
      <Stack.Screen
        name="Study"
        component={StudyScreen}
        options={({ route }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
        />
      <Stack.Screen
        name="DeckDetail"
        component={DeckDetailScreen}
        options={({ route }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
        />
      <Stack.Screen
        name="TopicSelection"
        component={TopicSelectionScreen}
        options={({ route, navigation }) => ({
          headerBackTitle: route.params.backTitle,
        })}
        />
    </Stack.Navigator>
  );
}

export default AppNavigator;
