import React, { useEffect, useState } from 'react';
import { Button, FlatList,TextInput, View, TouchableOpacity, Modal, Text, StyleSheet, ActivityIndicator, Image, Dimensions, StatusBar, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import backgroundImage from '../../../assets/backgroundtop.png';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


const Menufav = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menusfaav, setFavMenus] = useState([]);
    const [promo, setPromo] = useState([]);
    const urlitem = 'https://eska.sonokembangmalang.tech/asset';


    const loadData = () => {
        setLoading(true);
        fetchMenufav();
      };
    
      useFocusEffect(
        React.useCallback(() => {
            loadData(); // Load data when screen is focused
        }, []) // Make sure to not include any state variables here
      );



    const fetchMenufav = async () => {
        const iduser = await AsyncStorage.getItem('userid');
        try {
            const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getmenufav', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: iduser }),
              });

            const hasilmenu = await response.json();
            setFavMenus(hasilmenu);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(true);
        }
    };

      const likeordislike = async (item) => {
        // Determine the new favorite status
        const newStatus = item.is_favorite === 'Salah' ? 'Benar' : 'Salah'; // Toggle favorite status
      
        // Update the local state first
        const updatedItems = menusfaav.map((currentItem) => 
          currentItem.id_menu === item.id_menu 
            ? { ...currentItem, is_favorite: newStatus } 
            : currentItem
        );
        setFavMenus(updatedItems); // Update state immediately
      
        const iduser = await AsyncStorage.getItem('userid');
      
        try {
          // Make the API call to update the server
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=likeordislike', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_menu: item.id_menu,
              userid: iduser,
              status: newStatus,  
            }),
          });
      
          const hasil = await response.json();
          // Check if the update was successful
          if (hasil.Sukses) {
              fetchMenufav();
          } else {
            // Revert to the previous state if the update failed
            const revertData = filteredItems.map((d) => 
              d.id_menu === item.id_menu ? { ...d, is_favorite: item.is_favorite } : d
            );
            setFavMenus(revertData);
            console.error('Failed to update item:', hasil.message);
          }
        } catch (error) {
          console.error('Error:', error); // Handle network errors
        }
      };

    const splitDataIntoRows = (data, numColumns) => {
        const rows = [];
        for (let i = 0; i < data.length; i += numColumns) {
          const row = data.slice(i, i + numColumns);
          
          // Jika item dalam row kurang dari jumlah kolom, tambahkan item kosong
            while (row.length < numColumns) {
              row.push({ isEmpty: true }); 
            }
          
          rows.push(row);
        }
        return rows;
      };

      
      const renderItem = ({ item }) => {
        return (
          <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: `${urlitem}/${item.gambar_menu}` }} style={styles.image} />
        </View>
        <View>
          <Text style={styles.itemName}>{item.nama_menu}</Text>
          <Text style={styles.itemPrice}>Rp {item.harga_jual.toLocaleString( )}</Text>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.tambaflex}></View>
            <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { namastack: 'Produk', menuId: item.id_menu, namaHeader: item.nama_menu })} style={styles.addButton}>
              <Text style={styles.addButtonText}>Pesan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => likeordislike(item)} style={styles.hearticon}>
              <Ionicons
                name={item.is_favorite === 'Benar' ? 'heart' : 'heart-outline'}
                size={25}
                color={item.is_favorite === 'Benar' ? '#cb020c' : 'gray'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
        );
      };

      const renderRow = ({ item, index }) => (
        <View style={styles.row}>
          {item.map((subItem) => (
            <View key={subItem.id_menufav || index} style={styles.column}>
              {/* Cek apakah subItem adalah elemen kosong */}
              {subItem.isEmpty ? (
                <View style={{ width: 0, height: 0 }} /> // Atau bisa juga return null
              ) : (
                renderItem({ item: subItem }) // Panggil renderItem jika bukan elemen kosong
              )}
            </View>
          ))}
        </View>
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
    <Text style={styles.namaatas}>Menu Favorit</Text>
    <FlatList
        data={splitDataIntoRows(menusfaav, 2)}
        extraData={menusfaav}  
        keyExtractor={(item, index) => (item.id_menu ? item.id_menu.toString() : index.toString())}
        renderItem={renderRow}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada Menu Favorit</Text>} // Tambahkan ini
      />
  </SafeAreaView>
  )
}

export default Menufav

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection:'column',
  },
  namaatas:{
    fontWeight:'bold',
    fontSize: 12,
  },
  list: {
    flexGrow: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  circleContainerhearth: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffff', // Ganti dengan warna yang diinginkan
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'column', 
    margin: 10,
    padding: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    shadowColor: '#000',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    width: '100%', // Mengisi seluruh lebar kolom
  },
  imageContainer: {
    width: '100%',
    height: 120,
    marginBottom: 10,
    backgroundColor:'white',
    borderRadius: 10,
    overflow: 'hidden',  // Gambar tetap di dalam batas container
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',  // Ensures image scales properly without distortion
  },
  infoContainer: {
  },
  itemName: {
    fontSize: 12,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 12,
    color: 'green',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row', // Atur arah elemen menjadi horizontal (row)
  },
  hearticon: {
    flex : 1,
    justifyContent:'center',
    marginLeft:20,
  },
  tambaflex:{
    flex : 1,
  },
  addButton: {
    flex:2,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#cb020c',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});