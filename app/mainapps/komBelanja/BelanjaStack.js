import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Belanja from './Belanja'; // Halaman utama Beranda
import DetailScreen from '../DetailScreen';
import Keranjang from '../Keranjang';
import Pembayaran from '../PilihLokasi';
import Vapembayaran from '../Cs';
import Pembayaranselesai from '../Pesananselesai';
import grubkategori from './Grubmenu';

const Stack = createStackNavigator();

function BelanjaStack() {

  const navigation = useNavigation();

  useEffect(() => {
    // Reset stack ke screen pertama ketika BerandaStack dimuat
    navigation.reset({
      index: 0, // Menetapkan screen pertama yang akan ditampilkan
      routes: [{ name: 'Grubkategori' }] // Screen utama pertama di stack
    });
  }, [navigation]);


  return (
    <Stack.Navigator>
      <Stack.Screen name="Grubkategori" component={grubkategori} options={{ title: 'Kategori Menu', headerLeft: () => null ,
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
      }}/>
      <Stack.Screen name="BelanjaMain" component={Belanja} options={ ({ route }) => ({title: route.params.namagrubkategori || 'Nama Kategori', 
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
      }) } />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={({ route }) => ({ title: route.params.namaHeader || 'Detail Menu',
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
       }) } />
      <Stack.Screen 
        name="Keranjang" 
        component={Keranjang} 
        options={{  
          title: "Keranjang Saya",
          headerStyle: {
            backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
          },
          headerTintColor: '#fff', 
          headerShadowVisible: true, // Enables shadow for header (if using React Navigation 6.x or later)
          tabBarStyle: { display: 'none' }  
        }} 

      />
      <Stack.Screen name="Pembayaran" component={Pembayaran} options={{ title: 'Nota Pembelian' ,
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
      }} />
      <Stack.Screen name="Vapembayaran" component={Vapembayaran} options={{ title: 'Pembayaran Nota', headerLeft: () => null ,
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
      }} />
      <Stack.Screen name="Pembayaranselesai" component={Pembayaranselesai} options={{ title: 'Pesanan Selesai', headerLeft: () => null,
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
       }} />
    </Stack.Navigator>
  );
}

export default BelanjaStack;
