import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Akun from './Akun';
import Rprof from './Rubahprofil';
import Rpass from './Rubahpas';
import Rtrans from './Riwayattrans';
import Alpeng from './Alamatakun';
import Hubka from './Hubungikami';

const Stack = createStackNavigator();

function AkunStack() {
  const navigation = useNavigation();
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
              routes: [{ name: 'Akunmain' }],
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
          <Stack.Screen name="Akunmain" component={Akun} options={{ headerShown: false }} />
          <Stack.Screen name="Rubahprofile" component={Rprof} options={{ headerShown: false }} />
          <Stack.Screen name="Rubahpass" component={Rpass} options={{ title: 'Rubah Password Akun' }} />
          <Stack.Screen name="Riwayattrans" component={Rtrans} options={{ title: 'Riwayat Transaksi' }} />
          <Stack.Screen name="Alamatpeng" component={Alpeng} options={{ title: 'Alamat Pengiriman' }} />
          <Stack.Screen name="Hubungikami" component={Hubka} options={{ title: 'Hubungi Kami' }} />
        </Stack.Navigator>
      )}
    </React.Fragment>
  );
}

export default AkunStack;
