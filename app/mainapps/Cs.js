import React, { useEffect, useState } from 'react';
import { Button, TextInput, View, TouchableOpacity, Modal, Text, StyleSheet, ActivityIndicator, Image, Dimensions, StatusBar, Platform, ImageBackground, ScrollView, Linking, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Cs = ({ navigation  }) => { 
  const fotourl = 'https://eska.sonokembangmalang.tech/asset/foto_lain';
  const [allspa, setAllspa] = useState([]);

  const getspa = async () => {
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getspa', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const dataspa = await response.json();
        setAllspa(dataspa);
      } else {
        console.log('Failed to fetch data');
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getspa();
    }, [])
  );

  const openWhatsApp = (phoneNumber) => {
    if (!phoneNumber) {
      alert('Nomor WhatsApp tidak tersedia');
      return;
    }
    let pesanwa = "Hai Saya mau Konsultasi tentang pesanan dari aplikasi";  
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(pesanwa)}`;
    Linking.openURL(url).catch(() => {
      alert('Pastikan WhatsApp terpasang di perangkat Anda');
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.allspacontainer} onPress={() => openWhatsApp(item.no_waspa)}>
      <View style={{ width : '30%' , padding : 10,}}>
        <Image source={{ uri: `${fotourl}/${item.foto_spa}` }} style={styles.image} onError={(e) => console.log('Error loading image:', e.nativeEvent.error)} />
      </View> 
      <View style={styles.infocontainer}>
        <Text style={{ marginBottom: 10, fontSize : 14, fontWeight : 'bold'}}>{item.nama_spa}</Text>
        <Text><Ionicons name="logo-whatsapp" color='green' /> {item.no_waspa}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ textAlign: 'center', fontWeight : 'bold', fontSize : 14,}}>Sonokembang Project Consultant</Text>
      <Text style={{ textAlign: 'center', fontWeight : 'bold', fontSize : 14,}}>Konsultasi Sekarang</Text>
      <FlatList
        data={allspa}
        renderItem={renderItem}
        keyExtractor={item => item.id_spa}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',

  },
  allspacontainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1, 
    bordercolor: 'gray',
    marginTop: 10,
  },
  infocontainer: {
    flexDirection: 'column',
    marginLeft: 10,
    alignItems : 'flex-start',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
  },
  imageatas: { 
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default Cs;
