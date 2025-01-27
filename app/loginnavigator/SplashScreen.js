import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import gambarsplahs from '../../assets/logosk.png';

function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('userid');
      if (userId != null) {
        navigation.navigate('Home');
      } else {
        await AsyncStorage.setItem('userid', 'Trial');
        navigation.navigate('Home');
      }
    };

    setTimeout(checkUserId, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={gambarsplahs} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
