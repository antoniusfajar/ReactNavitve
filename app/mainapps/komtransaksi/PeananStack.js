import React, { useState } from 'react';
import { View, Text, Button, Modal , StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Keranjang from '../Keranjang';
import Pembayaran from '../PilihLokasi';
import Alltrans from './Alltrans';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Vapembayaran from '../Pembayaran';
import { useNavigation } from '@react-navigation/native';
import Pembayaranselesai from '../Pesananselesai';
const Stack = createStackNavigator();

function PeananStack({navigation}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [readStack, setReadStack] = useState(false);
  const [jumlahKeranjang, Setjumlahkeranjang] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const checkUserId = async () => {
        const userId = await AsyncStorage.getItem('userid');
        if (userId != null) {
          if (userId === 'Trial') {
            setShowLoginModal(true);
            setReadStack(false);
          } else {
            setShowLoginModal(false);
            setReadStack(true);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Alltrans' }],
            });
          }
        } else {
          setShowLoginModal(true);
          setReadStack(false);
        }
      };

      const checkkeranjang = async () => {
        try {
          const iduser = await AsyncStorage.getItem('userid');
          console.log('User yang kebaca :' + iduser);
          if (iduser !== 'Trial' && iduser !== '') {
            const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=countkeranjang', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userid: iduser }),
            });
    
            const data = await response.json();
              
              if (data.Hasil === 'Berhasil') {
                Setjumlahkeranjang(data.totalker);
              } else {
                Setjumlahkeranjang(0);
              }
          } else {
            Setjumlahkeranjang(0);
          }
        } catch (error) {
          setloading(true);
        }
      };


      checkkeranjang();
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
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ marginBottom: 20, textAlign: 'center' }}>Anda belum login!</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Tutup" onPress={closeModal} />
              <Button title="Login" onPress={handleLogin} />
            </View>
          </View>
        </View>
      </Modal>

      {readStack && (
        <Stack.Navigator> 
            <Stack.Screen 
                name="Alltrans" 
                component={Alltrans} 
                options={{  
                title: "History Pembelian",
                headerStyle: {
                  backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
                },
                headerTintColor: '#fff', 
                headerLeft: () => null,
                headerShadowVisible: true,
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Keranjang')} style={styles.keranjangcontainer}>
                    <Ionicons name="cart" size={20} color="white" />
                    {jumlahKeranjang > 0 && (
                      <View style={styles.keranjangicon}>
                        <Text style={styles.counterkeranjang}>{jumlahKeranjang}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  ),
                }} 
            />
            <Stack.Screen 
              name="Keranjang" 
              component={Keranjang} 
              options={{  
                title: "Keranjang Saya",
                headerStyle: {
                  backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
                },
                headerTintColor: '#fff', 
                headerShadowVisible: true // Enables shadow for header (if using React Navigation 6.x or later)
              }} 

            />
            <Stack.Screen name="Pembayaran" component={Pembayaran} options={{ title: 'Nota Pembelian',
              headerStyle: {
                backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
              },
              headerTintColor: '#fff', 
             }} />
            <Stack.Screen name="Vapembayaran" component={Vapembayaran} options={{ title: 'Pembayaran Nota', headerLeft: () => null,
              headerStyle: {
                backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
              },
              headerTintColor: '#fff', 
             }} />
            <Stack.Screen name="Pembayaranselesai" component={Pembayaranselesai} options={{ title: 'Pesanan Selesai', headerLeft: () => null ,
              headerStyle: {
                backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
              },
              headerTintColor: '#fff', 
            }} />
        </Stack.Navigator>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
keranjangcontainer: {
  position: 'relative',
  padding: 5,
  marginRight: 10,
},
keranjangicon: {
  position: 'absolute',
  right: -2,
  top: -4,
  backgroundColor: 'white',
  borderColor:'black',
  borderWidth: 0.5,
  borderRadius: 10,
  padding: 0,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
counterkeranjang: {
  color: '#cb020c',
  fontSize: 10,
  fontWeight: 'bold',
},

});

export default PeananStack;

