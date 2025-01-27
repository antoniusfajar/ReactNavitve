import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Button, View, Text } from 'react-native';
import Mainakunseting from './Updateprof/Mainsetprof';
import Tanja from './Updateprof/Tanyajawab';
import Keprif from './Updateprof/Kebijakan';
import Setuser from './Updateprof/Setauser';
import Password from './Updateprof/Setpin';
import infoaps from './Updateprof/Infoapp';

const Stack = createStackNavigator();

function Rubahprofil() {
const navigation = useNavigation();
const isFocused = useIsFocused();

useEffect(() => {
  if (isFocused) {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Settingakunmain' }],
    });
  }
}, [isFocused]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Settingakunmain" component={Mainakunseting} options={{ headerShown: false }} />
      <Stack.Screen name="SetAkun" component={Setuser} options={{ title: 'Update Profil' }} />
      <Stack.Screen name="Rubahpass" component={Password} options={{ headerShown: false }} />
      <Stack.Screen name="Kebijakanprif" component={Keprif} options={{ title: 'Kebijakan Privasi' }} />
      <Stack.Screen name="infoapps" component={infoaps} options={{ title: 'Tentang Aplikasi' }} />
    </Stack.Navigator>
  );
}

export default Rubahprofil;
