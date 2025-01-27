import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Button, View, Text } from 'react-native';
import Mainpassseting from './Mainsetpass';
import Passeting from './Setusrpass';
import Pinsetting from './Setusrpin';

const Stack = createStackNavigator();

function Setpin() {
const navigation = useNavigation();
const isFocused = useIsFocused();

useEffect(() => {
  if (isFocused) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Mainsetpass' }],
    });
  }
}, [isFocused]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Mainsetpass" component={Mainpassseting} options={{ headerShown: false }} />
      <Stack.Screen name="Setuserpassword" component={Passeting} options={{ title: 'Update Passwords' }} />
      <Stack.Screen name="Setusrpin" component={Pinsetting} options={{ title: 'Update Pin' }} />
    </Stack.Navigator>
  );
}

export default Setpin;
