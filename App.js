import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'; // Import PaperProvider and DefaultTheme
import AppNavigator from './app/loginnavigator/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
          <AppNavigator />
    </NavigationContainer>
    
  );
}
