import React, { useEffect, useState } from 'react';
import { View,ScrollView, Text, StyleSheet, ActivityIndicator, Image, Dimensions, SafeAreaView, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Mainsetprof = () => {
  const [dataakun, setAkun] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const iduser = await AsyncStorage.getItem('userid');
        if (iduser != null) {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=get_user_info', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userid: iduser,
            }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }

          const userResult = await response.json();
          setAkun(userResult);
        } else {
          console.warn('Tidak ada email yang ditemukan di AsyncStorage');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Gagal mengambil info pengguna:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('userid');
      navigation.navigate('Halamanlogin');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
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
                 
          <View style={styles.judulsubakuncontainer}>
            <Text style={styles.namajudul}>Akun</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SetAkun')} style={styles.subakuncontainer}>
              <Text style={styles.namasubakun}>Perubahan Akun</Text> 
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
          </TouchableOpacity>


          <TouchableOpacity style={styles.subakuncontainer}  onPress={() => navigation.navigate('Rubahpass')}> 
                <Text style={styles.namasubakun}>Perubahan Password</Text>
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
          </TouchableOpacity>

            <View style={styles.judulsubakuncontainer}>
                <Text style={styles.namajudul}>Bantuan</Text>
            </View>
            
            <TouchableOpacity style={styles.subakuncontainer} onPress={() => navigation.navigate('Kebijakanprif')}>
              <Text style={styles.namasubakun}>Kebijakan Prifasi </Text>
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.subakuncontainer} onPress={() => navigation.navigate('TanyaJawab')} >
              <Text style={styles.namasubakun}>Tanya Jawab</Text>
              <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.subakuncontainer} onPress={() => navigation.navigate('infoapps')}>
              <Text style={styles.namasubakun}>Informasi Aplikasi</Text>
                <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.subakuncontainer}>
              <Text style={styles.namasubakun}>Ajukan Penghapusan Akun</Text>
                <Ionicons style={styles.iconContainer} name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

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
    padding: 10,
  },
  submenuakun: {
    flexDirection: 'column',
    marginTop: 10,
  },
  judulsubakuncontainer:{
    marginTop: 10,
  },
  namajudul:{
    fontSize: 10,
    color:'gray',
  },
  subakuncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 5,
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 100,
  },
  logoutText: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Mainsetprof;
