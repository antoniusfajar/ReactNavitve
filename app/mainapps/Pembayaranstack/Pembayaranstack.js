import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Vapembayaran from '../Pembayaran';
import Pembayaranselesai from '../Pesananselesai';
const Stack = createStackNavigator();

function Pembayaranstack({ navigation }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [readStack, setReadStack] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkUserId = async () => {
        const userId = await AsyncStorage.getItem('userid');
        if(userId != null){
          if (userId === 'Trial') {
            setShowLoginModal(true);
            setReadStack(false);
          } else {
            setShowLoginModal(false);
            setReadStack(true);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Pembayaran' }],
            });
          }
        }else{
          setShowLoginModal(true);
          setReadStack(false);
        }
      };

      checkUserId();
    }, [navigation])
  );

  const closeModal = () => {
    setShowLoginModal(false);
    navigation.navigate('Beranda');
  };

  const handleLogin = async () => {
    await AsyncStorage.clear();
    setShowLoginModal(false);
    navigation.navigate('Halamanlogin');
  };

  return (
    <React.Fragment>
      <Modal
        isVisible={showLoginModal}
        backdropOpacity={0.9}
        backdropColor="white"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ marginBottom: 20, textAlign: 'center' }}>Anda belum login!</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Tutup" onPress={closeModal} />
            <Button title="Login" onPress={handleLogin} />
          </View>
        </View>
      </Modal>

      {showLoginModal && <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />}

      {readStack && (
        <Stack.Navigator>
            <Stack.Screen name="Pembayaran" component={Pembayaran} options={{ title: 'Pembayaran' }} />
            <Stack.Screen name="Vapembayaran" component={Vapembayaran} options={{ title: 'Pembayaran Nota', headerLeft: () => null }} />
            <Stack.Screen name="Pembayaranselesai" component={Pembayaranselesai} options={{ title: 'Pesanan Selesai', headerLeft: () => null }} />  
        </Stack.Navigator>
      )}
    </React.Fragment>
  );
}

export default Pembayaranstack;
