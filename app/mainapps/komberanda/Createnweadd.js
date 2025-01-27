import React, { useState } from 'react';
import { Alert , ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Card, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Createnweadd = ( {navigation} ) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [penandalokasi, setPenanda] = useState('');
  const [isPrimaryLocation, setIsPrimaryLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Ijinkan Untuk Mengakses Lokasi Anda');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (reverseGeocode.length > 0) {
      setAddress(reverseGeocode[0].formattedAddress );
      setCity(reverseGeocode[0].subregion || '');
    } else {
      setErrorMsg('Tidak dapat menemukan alamat.');
    }
  };

  const isFormValid = () => {
    return address && city && penandalokasi;
  };

  const tambahLokasi = async () => {
    const iduser = await AsyncStorage.getItem('userid');
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=Tambahlokasibaru', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: iduser,
          utama: isPrimaryLocation,
          Alamat: address,
          Kota: city,
          Pendanda: penandalokasi,
        }),
      });
      
     // console.log('user->' + iduser + ' utama->' + isPrimaryLocation + ' Alamat->' + address + 'Kota->' + city + ' Penanda->'+penandalokasi);
      const hasilkirim = await response.json();
      console.log(hasilkirim);

      if (hasilkirim.message == 'Sukses') {
        Alert.alert(
          'Berhasil',
          'Alamat berhasil ditambahkan',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Buatalamat', { isDelivery: true }), // Mengarahkan pengguna setelah menekan "OK"
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Gagal', 'Alamat tidak berhasil ditambahkan.');
      }
    } catch (error) {
      Alert.alert('Error', 'Perikasa Koneksi anda' + error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.cardsearch}>
        <Text style={styles.title}>Titik Lokasi Alamat</Text>
        <Text style={styles.subtitle}>Tekan Jika ingin mengisi Alamat saat ini</Text>
        <TouchableOpacity onPress={fetchLocation} style={styles.carialamat}>
          <Ionicons name="location" size={24} color="white" />
          <Text style={styles.carialamatText}> Cari Alamat Saya </Text>
        </TouchableOpacity>
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      </Card>

      <TextInput
        placeholder="Contoh Jalan Bendungan Sigura - gura V 32"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Text style={{fontSize : 10, color : 'gray'}}> Tuliskan Alamat rumah Lengkap</Text>

      <TextInput
        placeholder="Contoh Kota Malang"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <Text style={{fontSize : 10, color : 'gray'}}> Tuliskan Kota Lokasi pengiriman </Text>

      <TextInput
        placeholder="contoh rumah pagar hitam"
        value={penandalokasi}
        onChangeText={setPenanda}
        style={styles.input}
      />
      <Text style={{fontSize : 10, color : 'gray'}}> Masukkan petunjuk rumah atau lokasi</Text>



     <View style={styles.toggleContainer}>
        <Text>Jadikan Sebagai Alamat Utama</Text>
        <View style={styles.switchContainer}>
            <Switch
                style={styles.switch}
                value={isPrimaryLocation}
                onValueChange={setIsPrimaryLocation}
                trackColor={{ false: '#767577', true: '#767577' }} // Ubah warna track
                thumbColor={isPrimaryLocation ? '#cb020c' : '#f4f3f4'} // Ubah warna thumb
            />
        </View>
      </View>

      
      <Button 
        mode="contained" 
        disabled={!isFormValid()} 
        style={[styles.saveButton, !isFormValid() ? styles.buttonDisabled : null]} 
        onPress={tambahLokasi}
      >
        Simpan
      </Button>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    color: 'gray',
    marginBottom: 10,
  },
  carialamat: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#cb020c',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carialamatText: {
    color: 'white',
    marginLeft: 10,
  },
  cardsearch: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 10,
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding : 10,
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: '#cb020c',
  },
  buttonDisabled : {
    backgroundColor: 'gray',
  },
  switchContainer: {
    justifyContent: 'center', // Pusatkan konten
    marginTop: 20,
  },
  switch: {
    margin: 10,
    transform: [{ scale: 1 }], // Atur skala untuk memperbesar ukuran switch
  },
  
});

export default Createnweadd;
