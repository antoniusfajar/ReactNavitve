import React, { useEffect, useState } from 'react';
import { View,ScrollView, Text, StyleSheet, ActivityIndicator, Image, Dimensions, SafeAreaView, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import backgroundkartu from '../../../assets/cardmember.png';

const { width } = Dimensions.get('window');

const Akun = () => {
  const [dataakun, setAkun] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const urlitem = 'https://eska.sonokembangmalang.tech/asset/user_foto';



  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const iduser = await AsyncStorage.getItem('userid');
        if (iduser != 'TRIAL') {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=get_user_info', {
            method: 'POST',
            headers: {  
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: iduser }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }

          const userResult = await response.json();
          setAkun(userResult);
        } else {
          setAkun({
            nama_depan: 'Demo',
            nama_belakang: 'Akun',
            user_id: 'SKM-Demo',
            fotouser: 'User_no_image.jpg'
          });
          navigation.navigate('Beranda');
        }
      } catch (error) {
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigation]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatUserId = (userId) => {
    return userId.replace(/(.{4})(?=.)/g, '$1 ');
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!dataakun) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.card}>
          <ImageBackground source={backgroundkartu} style={styles.background}>
            <View style={styles.cardContent}>
              <View style={styles.fotomember}>
                <Image source={{ uri: `${urlitem}/${dataakun.fotouser}` }} style={styles.image} />
              </View>
              <View style={styles.ketmember}>
                <Text style={styles.cardNumber}>{capitalizeFirstLetter(dataakun.nama_depan)} {capitalizeFirstLetter(dataakun.nama_belakang)}</Text>
                <Text style={styles.cardTitle}>{formatUserId(dataakun.user_id)}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.submenuakun}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Rubahprofile')} style={styles.subakuncontainer}>
            <View style={styles.tulisansubakun}>
              <Text style={styles.namasubakun}>Perubahan Akun</Text>
              <Text style={styles.keterangansubakun}>Perubahan akun, kebijakan, dan Bantuan</Text>
            </View>
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
          </TouchableOpacity>


          <TouchableOpacity style={styles.subakuncontainer} onPress={() => navigation.navigate('Riwayattrans')} >
            <View style={styles.tulisansubakun}>
              <Text style={styles.namasubakun}>Riwayat Transaksi</Text>
              <Text style={styles.keterangansubakun}>Riwayat pembayaran transaksi akun</Text>
            </View>
              <Ionicons name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.subakuncontainer} onPress={() => navigation.navigate('TanyaJawab')} >
            <View style={styles.tulisansubakun}>
              <Text style={styles.namasubakun}>Tanya Jawab</Text>
              <Text style={styles.keterangansubakun}>Pertanyaan pengunaan Aplikasi</Text>
            </View>
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.subakuncontainer} onPress={() => navigation.navigate('Hubungikami')}> 
            <View style={styles.tulisansubakun}>
              <Text style={styles.namasubakun}>Hubungi Kami</Text>
              <Text style={styles.keterangansubakun}>Hubungi Marketing Sonokembang</Text>
            </View>
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  card: {
    height: 250,
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
  },
  fotomember: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
  },
  ketmember: {
    marginLeft: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  cardExpiry: {
    color: '#fff',
    fontSize: 12,
  },
  logokartu: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  submenuakun: {
    flexDirection: 'column',
    marginTop: 10,
  },
  subakuncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingVertical: 10,
  },
  tulisansubakun: {
    flexDirection: 'column',
  },
  namasubakun: {
    fontSize: 18,
  },
  keterangansubakun: {
    fontSize: 12,
    color: 'gray',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Akun;
