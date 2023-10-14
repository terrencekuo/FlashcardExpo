import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CreateDeckScreen from '../screens/CreateDeckScreen';
import CreateFlashcardScreen from '../screens/CreateFlashcardScreen';
import DeckBrowserScreen from '../screens/DeckBrowserScreen';
import StudyScreen from '../screens/StudyScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateDeck" component={CreateDeckScreen} />
      <Stack.Screen name="CreateFlashcard" component={CreateFlashcardScreen} />
      <Stack.Screen 
        name="DeckBrowser" 
        component={DeckBrowserScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Button 
              onPress={() => navigation.navigate('Home')} 
              title="Home" 
            />
          )
        })}
      />
      <Stack.Screen name="Study" component={StudyScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
