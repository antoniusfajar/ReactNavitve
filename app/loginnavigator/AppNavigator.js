import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import LoginScreen from './Navhalamanlogin';
import HomeScreen from '../mainapps/Apssnav'; // Adjust the path accordingly
import Newpin from './Newpin';
import { StatusBar, Platform } from 'react-native';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'default'} // iOS style
        backgroundColor="#cb020c" // Warna untuk Android
        translucent={false} // Non-transparan
      />
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Halamanlogin" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="newpins" component={Newpin} options={{ headerShown: false }} />
      </Stack.Navigator>
    </View>
  );
}

export default AppNavigator;
