import React, { useEffect } from 'react';
import { Platform, View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Beranda from './Beranda';
import DetailScreen from '../DetailScreen';
import Customerservice from '../Cs';
import Keranjang from '../Keranjang';
import Pembayaran from '../PilihLokasi';
import Vapembayaran from '../Pembayaran';
import Pembayaranselesai from '../Pesananselesai';
import Buatalamatuser from './Buatalamatbaru';
import carihalaman from './Carihalaman';
import Newadres from './Createnweadd';
import Menufav from './Menufav';
import { StatusBar } from 'react-native-web';

const Stack = createStackNavigator();

function BerandaStack() {

  const navigation = useNavigation();

  useEffect(() => {
    // Reset stack ke screen pertama ketika BerandaStack dimuat
    navigation.reset({
      index: 0, // Menetapkan screen pertama yang akan ditampilkan
      routes: [{ name: 'Kembali' }] // Screen utama pertama di stack
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Kembali" component={Beranda} options={{ 
        headerShown: false , 
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
      }} />
      <Stack.Screen name="Helpdesk" component={Customerservice} 
      options={{ title: 'Hubungi Kami' , 
        headerStyle: {
        backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
        headerShadowVisible: true // Enables shadow for header (if using React Navigation 6.x or later)
      }} />
      <Stack.Screen
        name="Buatalamat"
        component={Buatalamatuser}
        options={({ navigation }) => ({
          title: 'Cara Belanja',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={28} color="#FFF" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
          },
          headerTintColor: '#fff', 
        })}
      />
      <Stack.Screen 
        name="carihalaman" 
        component={carihalaman} 
        options={{ headerShown: false }}  // Menggunakan false tanpa tanda kutip
      />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={({ route }) => ({ title: route.params.namaHeader || 'Detail Menu'  
        ,headerStyle: {
            backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
          },
          headerTintColor: '#fff', 
      })} />
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
        <Stack.Screen name="Newadres" component={Newadres} options={{ title: 'Alamat Baru',
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
       }} />
       <Stack.Screen name="Menufav" component={Menufav} options={{ title: 'Menu Favorit',
        headerStyle: {
          backgroundColor: '#cb020c', // Warna background untuk header (AppBar)
        },
        headerTintColor: '#fff', 
       }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    width : 300,
  },
  searchIcon: {
    marginRight: 10,
    color: 'gray',
  },
  searchInput: {
    flex: 1,
    color: 'black',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputInResults: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '100%',
  },
});

export default BerandaStack;
