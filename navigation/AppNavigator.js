import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CreateDeckScreen from '../screens/CreateDeckScreen';
import CreateFlashcardScreen from '../screens/CreateFlashcardScreen';
import StudyScreen from '../screens/StudyScreen';
import DeckInfoScreen from '../screens/DeckInfoScreen';
import TopicSelectionScreen from '../screens/TopicSelectionScreen';
import RenameDeckScreen from '../screens/RenameDeckScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Flashcards"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f5f5f5',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#B89081',
        headerTitleStyle: {
          color: '#B89081',
        },
        headerTitle: ' ',
        headerShadowVisible: false,
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
        component={DeckInfoScreen}
        options={({ route }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
      />
      <Stack.Screen
        name="TopicSelection"
        component={TopicSelectionScreen}
        options={({ route, }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
      />
      <Stack.Screen
        name="RenameDeckScreen"
        component={RenameDeckScreen}
        options={({ route, navigation }) => ({
          headerBackTitle: route.params?.backTitle || '',
        })}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
