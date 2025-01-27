import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Platform , TextInput, Alert, Switch, FlatList, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Buatalamatbaru = ({ navigation }) => {
  const [isDelivery, setIsDelivery] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState(['']);
  const [pickupLocation] = useState('Jl. Bendungan Sigura-gura 5 no 32 Malang');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [alamat, SetAlamat] = useState([]);
  const [isPrimaryLocation, setIsPrimaryLocation] = useState({});
  const pickupCoordinates = { latitude: -7.955532, longitude: 112.60899 };
  const [modaledit , setModaledit] = useState(false);
  const [selectededit, setselectededit] = useState([]);
  const [city, setCity] = useState('');
  const [editalamat , Seteditalamat] = useState('');
  const [cirialamat , setcirialamat] = useState('');
  const [editidalamat , setIdeditalamat] = useState('');
  const [edituserid , serEdituserid] = useState('');

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
  
      // Menangani berbagai status izin lokasi
      if (status === 'granted') {
        // Jika izin diberikan, ambil lokasi saat ini
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCurrentLocation({ latitude, longitude });
  
        // Hitung jarak jika `pickupCoordinates` tersedia
        if (pickupCoordinates) {
          const distanceInMeters = getDistance(
            { latitude, longitude },
            pickupCoordinates
          );
          const distanceInKilometers = distanceInMeters / 1000;
          setDistance(distanceInKilometers);
        } else {
          console.warn('pickupCoordinates is not defined');
          setDistance(0);
        }
      } else if (status === 'denied') {
        Alert.alert(
          'Akses Lokasi Ditolak',
          'Aplikasi membutuhkan akses lokasi untuk melanjutkan. Apakah Anda ingin mencoba lagi?',
          [
            { text: 'Tidak', style: 'cancel', onPress: () => navigation.goBack() },
            { text: 'Coba Lagi', onPress: () => getLocation() }
          ]
        );
      } else if (status === 'undetermined') {
        Alert.alert(
          'Izin Belum Ditentukan',
          'Aplikasi membutuhkan akses lokasi untuk melanjutkan. Harap berikan izin lokasi.',
          [
            { text: 'Tidak', style: 'cancel', onPress: () => navigation.goBack() },
            { text: 'Berikan Izin', onPress: () => getLocation() }
          ]
        );
      } else {
        Alert.alert(
          'Error Izin Lokasi',
          'Terjadi kesalahan dalam memeriksa izin lokasi. Silakan coba lagi.',
          [
            { text: 'Coba Lagi', onPress: () => getLocation() }
          ]
        );
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setDistance(0);
      Alert.alert('Error', 'Gagal mendapatkan lokasi Anda.');
    } finally {
      setLoading(false); // Menghentikan loading setelah semua proses selesai
    }
  };
  


  const getlokasisekarang = async () => {
    const iduser = await AsyncStorage.getItem('userid');
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getuseralamat', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: iduser }),
      });
      const hasilkirim = await response.json();
      SetAlamat(hasilkirim);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan saat mengirim data.');
      setLoading(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await getLocation();
    await getlokasisekarang();
  };

  
  useFocusEffect(
    React.useCallback(() => {
        loadData(); // Load data when screen is focused
    }, []) // Make sure to not include any state variables here
  );

  const toggleSwitch = async (item) => {
    Seteditalamat(item.alamat);
    setcirialamat(item.cirikhas);
    setCity(item.kota);
    serEdituserid(item.user_id);
    setIdeditalamat(item.Iduseralm);
    const currentValue = item.Utama === 'YES'; // true jika aktif, false jika tidak aktif
    const statusToSend = currentValue ? false : true ; // Jika saat ini 'YES', kirim 'NO' dan sebaliknya
    // Tampilkan konfirmasi sebelum mengubah
    console.log(statusToSend);
    Alert.alert(
        "Konfirmasi",
        statusToSend  == true ? "Apakah Anda yakin ingin menjadikan alamat ini sebagai alamat utama?" : "Apakah Anda yakin ingin menghapus status alamat utama?",
        [
            {
                text: "Batal",
                onPress: () => setIsPrimaryLocation((prev) => ({ ...prev, [item.Iduseralm]: currentValue })), // Kembalikan ke nilai sebelumnya
                style: "cancel"
            },
            {
                text: "OK",
                onPress: async () => {
                    // Memperbarui state lokal
                    setIsPrimaryLocation((prev) => ({ ...prev, [item.Iduseralm]: !currentValue }));

                    try {
                        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=tooglealamat', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ 
                                alamatid: item.Iduseralm,
                                isPrimary: statusToSend,
                                userid: item.user_id,
                            }),
                        });

                        const data = await response.json();

                        if (data.message === 'Sukses') {
                            loadData(); // Muat ulang data untuk memastikan status terbaru
                        } else {
                            setIsPrimaryLocation((prev) => ({ ...prev, [item.Iduseralm]: currentValue }));
                        }
                    } catch (error) {
                        console.error(error);
                        // Mengembalikan ke nilai sebelumnya jika ada kesalahan
                        setIsPrimaryLocation((prev) => ({ ...prev, [item.Iduseralm]: currentValue }));
                        Alert.alert('Terjadi kesalahan. Silakan coba lagi.');
                    }
                }
            }
        ]
    );
};


  const closeModaledit = () => {
    setModaledit(false);
  }

  const simpanperubahan = async () => {
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=editrubahalamat', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userid: edituserid,
          iduseralm: editidalamat,
          kota: city,
          alamat: editalamat,
          cirikas: cirialamat,
        }),
      });

      const hasilkirim = await response.json();
      if(hasilkirim.message == 'Sukses' ){
        setModaledit(false);
        Alert.alert('Alamat berhasil Diperbarui!', '', [
          {
            text: 'OK',
            onPress: () => {
              loadData();
              // Jika Anda ingin melakukan sesuatu dengan isDelivery di sini, 
              // Anda bisa mengaturnya ke true dalam konteks yang lebih luas
              setIsDelivery(true); // Misalkan Anda memiliki state untuk isDelivery
            },
          },
        ]);
      }else {
        Alert.alert('Penghapusan alamat gagal.', '', [
          { text: 'OK', onPress: loadData }, // Memanggil loadData di sini
        ]);
      }
    } catch (error) {
      setModaledit(false);
      Alert.alert(`Koneksi anda terganggu`);
    }
  }

  const handleEdit = (item) => {
    Seteditalamat(item.alamat);
    setcirialamat(item.cirikhas);
    setCity(item.kota);
    serEdituserid(item.user_id);
    setIdeditalamat(item.Iduseralm);
    setModaledit(true);
    setselectededit(item);
  };

  // Fungsi untuk menangani penghapusan item
  const handleDelete = async (item) => {
    Seteditalamat(item.alamat);
    setcirialamat(item.cirikhas);
    setCity(item.kota);
    serEdituserid(item.user_id);
    setIdeditalamat(item.Iduseralm);
    Alert.alert(`Apakah anda yakin akan menghapus alamat?`, '', [
      { 
        text: 'OK', 
        onPress: async () => { // Menambahkan async di sini
          try {
            const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=hapusalamatuser', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                userid: edituserid,
                iduseralm: editidalamat,
              }),
            });
  
            const hasilhapus = await response.json();
            if (hasilhapus.message === 'Sukses') {
              Alert.alert('Alamat berhasil dihapus!', '', [{ text: 'OK' }]);
              loadData();
            } else {
              Alert.alert('Penghapusan alamat gagal.', '', [{ text: 'OK' }]);
              loadData();
            }
          } catch (error) {
            console.log(error);
            Alert.alert('Terjadi kesalahan saat menghapus alamat.', '', [{ text: 'OK' }]);
            loadData();
          } finally {
            // Navigasi setelah mencoba menghapus alamat
            navigation.navigate('Buatalamat', { isDelivery: true });
          }
        }
      },
      { text: 'Batal', onPress: () => {}, style: 'cancel' },
    ]);
  };
  

  const renderItem = ({ item }) => (
    <Card style={styles.cardContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
        <Text style={[styles.itemText, { flexShrink: 1, flexWrap: 'wrap', marginRight: 10 }]}>
          {item.cirikhas}
        </Text>
        {item.Utama === 'YES' ? (
          <View style={{ backgroundColor: '#cb020c', borderRadius: 10, padding: 5 }}>
            <Text style={{ color: 'white', fontSize: 10 }}>Alamat Utama</Text>
          </View>
        ) : (
          <Text>  </Text>
        )}
      </View>

      <Text style={{ fontWeight: 'bold', color : 'gray', fontSize : 10, padding: 10,}}>{item.kota}</Text>
      <View style={{ flexDirection: 'row', justifyContent : 'space-between' , padding : 10,}}>
      <Text style={[styles.itemText, { flexShrink: 1, flexWrap: 'wrap', marginRight: 10 }] } >{item.alamat}</Text>
      </View>
      <View style={{ marginTop: 10,flexDirection: 'row', borderTopColor : 'gray' , borderTopWidth: 1, justifyContent:'space-between' , alignItems : 'center'}}>
        <View style={{ height: '100%' ,flexDirection : 'row' , justifyContent: 'flex-start' }}>
          <TouchableOpacity onPress={() => handleEdit(item)} style= {{borderRightColor  : 'gray', borderRightWidth: 2,}}>
            <Text style={styles.itemTextrubahhapus}> <Ionicons name="pencil" /> Rubah </Text>
          </TouchableOpacity>

          {/* Hapus */}
          <TouchableOpacity onPress={() => handleDelete(item)}>
          <Text style={styles.itemTextrubahhapus}>  <Ionicons name="trash" /> Hapus</Text>
          </TouchableOpacity>
        </View>
        {/* Switch */}
        <Switch
          style={styles.switch}
          value={item.Utama === 'YES'} // Jika item.Utama 'YES', maka true, jika tidak, gunakan nilai dari state
          onValueChange={() => toggleSwitch(item)} // Mengubah status switch berdasarkan ID item
          trackColor={{ false: '#767577', true: '#767577' }} // Ubah warna track
          thumbColor={item.Utama === 'YES' || isPrimaryLocation[item.Iduseralm] ? '#cb020c' : '#f4f3f4'} // Ubah warna thumb
        />
      </View> 
      
      

    </Card>
  );

  if (loading == true) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, styles.toggleButtonLeft, !isDelivery && styles.activeButton]}
          onPress={() => setIsDelivery(false)}
        >
          <Text style={[styles.toggleText, !isDelivery && styles.activeText]}>Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, styles.toggleButtonRight, isDelivery && styles.activeButton]}
          onPress={() => setIsDelivery(true)}
        >
          <Text style={[styles.toggleText, isDelivery && styles.activeText]}>Delivery</Text>
        </TouchableOpacity>
      </View>
   
      {!isDelivery && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pickupCoordinates.latitude,
            longitude: pickupCoordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={pickupCoordinates}
            title="Sonokembang Malang"
            description="Lokasi Pickup"
          />
        </MapView>
      )}

      {!isDelivery && (
        <Card style={styles.card}>
          
          <Text style={styles.label}>Lokasi Pickup</Text>
          <Text style={styles.labellokasi}>{pickupLocation}</Text>
          <Text style={{ color: 'gray', marginTop: 10 }}>
            <Ionicons name="call" /> 0341 577 823 <Ionicons name="logo-whatsapp" /> 0812 4918 5369
          </Text>
          {currentLocation && distance ? (
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.distanceText}>
                <Ionicons name="location" /> {distance.toFixed(2)} Km
              </Text>
              <Text style={styles.distanceText}>
                <Ionicons name="time" /> 24 Jam
              </Text>
            </View>
          ) : (
            <Text style={styles.distanceText}>Lokasi tidak tersedia</Text>
          )}
        </Card>
      )}

      {isDelivery && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Alamat Pengiriman:</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Newadres')}>
            <Text style={{ color: '#33ABF9' }}>+ Tambahkan Lokasi</Text>
          </TouchableOpacity>
        </View>
      )}

      {isDelivery && (
        <FlatList
            data={alamat}
            renderItem={renderItem}
            keyExtractor={(item) => item.Iduseralm.toString()} // Ensure it's a string
            extraData={alamat} // Add this line to notify FlatList when data changes
            contentContainerStyle={{ paddingBottom: 80 , paddingTop: 20}} 
        />
      )}

        <Modal
          isVisible={modaledit}
          backdropOpacity={0.9}
          backdropColor="black"
          style={styles.beliModal}
          onBackdropPress={closeModaledit}
          animationIn="fadeIn"
          animationInTiming={1500}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ justifyContent: 'center'}}
          >
            
          <View style={styles.modalContent}>
            {selectededit ? (
              <>
              <View style={styles.modaltitlecontainer}>
                <Text style={styles.modalTitle}>Rubah Alamat</Text>
              </View>
              <View style={styles.inputcontainer}>
                <Text style={{ fontSize: 10, color: 'gray', textAlign: 'left' }}>Kota </Text>
                <TextInput
                  value={city} // Gunakan state lokal
                  onChangeText={setCity} // Update state lokal saat teks berubah
                  style={styles.input}
                />
              </View>
              <View style={styles.inputcontainer}>
                  <Text style={{ fontSize : 10, color : 'gray' , textAlign:'left' }}> Alamat Lengkap</Text>
                  <TextInput
                    value={editalamat}
                    onChangeText={Seteditalamat}
                    style={styles.input}
                  />                   
              </View>
              
              <View style={styles.inputcontainer}>
                  <Text style={{ fontSize : 10, color : 'gray' , textAlign:'left' }}> Petunjuk Alamat</Text>
                  <TextInput
                    value={cirialamat}
                    onChangeText={setcirialamat}
                    style={styles.input}
                  />
              </View>
                <TouchableOpacity onPress={simpanperubahan} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Simpan Perubahan</Text>
                </TouchableOpacity>

              </>
            ) : (
              <Text style={styles.modalText}>Tidak ada data untuk diedit.</Text>
            )}
          </View>
          </KeyboardAvoidingView>
        </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },

  switch : {
    transform: [{ scale: 1}],
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  toggleButtonLeft: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  toggleButtonRight: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  activeButton: {
    backgroundColor: '#cb020c',
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  input:{
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    padding: 10,
    height: 50,
  },
  activeText: {
    color: '#fff',
  },
  card: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  labellokasi: {
    color: 'gray',
    fontSize: 20,
  },
  distanceText: {
    marginTop: 10,
    marginRight: 20,
    fontSize: 14,
    color: 'gray',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'column',
    marginVertical: 10,
    elevation: 3, // Untuk Android
    shadowColor: '#000', // Untuk iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  itemTextrubahhapus:{
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  modaltitlecontainer: {
    width: '100%',
    marginBottom: 20, // Reduced margin for better spacing
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#cb020c',
    borderRadius: 10,
    marginTop: 20, // Added margin for spacing above button
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  inputcontainer: {
    marginTop: 10,
    width: '100%', // Ensures the input container takes full width
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5, // Added margin for spacing below label
  },
});

export default Buatalamatbaru;
