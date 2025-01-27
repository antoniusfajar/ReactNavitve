import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, SafeAreaView, StatusBar, FlatList, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CheckBox from 'expo-checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Keranjang = ({navigation}) => {
  const [dataKeranjang, setDataKeranjang] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const urlItem = 'https://eska.sonokembangmalang.tech/asset';

  const fetchData = async () => {
    try {
      setLoading(true);
      const idUser = await AsyncStorage.getItem('userid');
      if (idUser && idUser !== 'Trial') {
        const response = await fetch(`https://eska.sonokembangmalang.tech/api.php?action=getkeranjang&timestamp=${new Date().getTime()}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid: idUser }),
        });

        const textResponse = await response.text();
        let hasilKeranjang = JSON.parse(textResponse);

        if (Array.isArray(hasilKeranjang)) {
          setDataKeranjang(hasilKeranjang);
        } else {
          console.error('Data dari API bukan array:', hasilKeranjang);
          setDataKeranjang([]);
        }
      }
    } catch (error) {
      console.error('Gagal mengambil info pengguna:', error);
      setDataKeranjang([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: { display: 'none' },
        });

        console.log('toute terbaca');
      }else{
        console.log('Tidak terbaca');
      }

      fetchData();
      return () => {
        const newState = parentNavigation.getState();
        const newCurrentTabState = newState.routes.find(r => r.state)?.state;
        const newCurrentRouteName = newCurrentTabState
          ? newCurrentTabState.routes[newCurrentTabState.index]?.name
          : newState.routes[newState.index]?.name;

        if (!['Pembayaran', 'Keranjang', 'DetailScreen'].includes(newCurrentRouteName)) {
          parentNavigation.setOptions({
            tabBarStyle: { display: 'flex', backgroundColor: '#a11005' },
          });
          console.log('sini yang dibaca');
        }else{
          parentNavigation.setOptions({
            tabBarStyle: { display: 'none'},
          });
          console.log('Ini yang dibaca');
        }
      };
    }, [navigation])
  );


  const handleSelectItem = (item) => {
    setSelectedItems(prevState => {
      const newSelectedItems = new Set(prevState);
      if (newSelectedItems.has(item.id_keranjang)) {
        newSelectedItems.delete(item.id_keranjang);
      } else {
        newSelectedItems.add(item.id_keranjang);
      }
      return newSelectedItems;
    });
  };

  const calculateTotal = () => {
    if (!Array.isArray(dataKeranjang)) {
      return 0;
    }

    return dataKeranjang
      .filter(item => selectedItems.has(item.id_keranjang))
      .reduce((total, item) => total + parseFloat(item.total_beli), 0);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString().replace(/\./g, ',');
  };

  const handlePayment = async () => {
    if (selectedItems.size === 0) {
      Alert.alert('Peringatan', 'Anda harus memilih item sebelum melakukan pembayaran.');
      return;
    }

    Alert.alert(
      'Konfirmasi Pembayaran',
      `Apakah Anda yakin akan melakukan pembayaran sebesar ${formatCurrency(calculateTotal())}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar',
          onPress: async () => {
            try {
              const idkirim = await AsyncStorage.getItem('userid');
              const selectedItemsArray = Array.from(selectedItems); // Convert Set to Array
              const totalnota = calculateTotal();
              const response = await fetch(`https://eska.sonokembangmalang.tech/api.php?action=getsendnumber&timestamp=${new Date().getTime()}`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id_kirim: idkirim,
                  selected_items: selectedItemsArray,
                  subtotal: totalnota,
                }),
              });

              const nomorkirim = await response.text();
              let hasilnota = JSON.parse(nomorkirim);

              if (hasilnota.message === "Kesalahan api") {
                Alert.alert('Kesalahan', 'Terjadi kesalahan saat memproses pembayaran.');
              } else {
                setSelectedItems(new Set());
                navigation.navigate('Pembayaran', {
                  nomorapi: hasilnota.nomorapi,
                  nonota: hasilnota.nonota,
                });
              }
            } catch (error) {
              console.error('Error:', error); 
              Alert.alert('Ada Kesalahan Koneksi ke server');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    if (!item || !item.id_keranjang) {
      return null; // Avoid rendering invalid items
    }

    return (
      <View style={styles.itemContainer}>
        <CheckBox
          value={selectedItems.has(item.id_keranjang)}
          style={styles.checkbox}
          onValueChange={() => handleSelectItem(item)}
        />
        <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { namastack: 'Produk', menuId: item.id_menu, namaHeader: item.nama_menu })} style={{ margin:10,}}>
        <Image source={{ uri: `${urlItem}/${item.gambar_menu}` }} style={styles.image}  />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { namastack: 'Produk', menuId: item.id_menu, namaHeader: item.nama_menu })} style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.nama_menu}</Text>
          <Text style={styles.itemSubtotal}>Subtotal: {formatCurrency(Number(item.total_beli))}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { namastack: 'Produk', menuId: item.id_menu, namaHeader: item.nama_menu })} 
          style={{ marginLeft : 'auto', justifyContent:'center', alignItems:'center'}}>
            <Ionicons style={{ marginRight: 20 }} name='create-outline' size={30} color='black'  />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.listContainer}>
        {dataKeranjang.length === 0 ? (
          <Text style={styles.emptyMessage}>Keranjang kosong</Text>
        ) : (
          <FlatList
            data={dataKeranjang}
            renderItem={renderItem}
            keyExtractor={item => item.id_keranjang.toString()}
            contentContainerStyle={styles.flatListContent}
          />
        )}
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: {formatCurrency(Number(calculateTotal()))}</Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: selectedItems.size > 0 ? '#1E90FF' : '#ccc' }]}
            onPress={handlePayment}
            disabled={selectedItems.size === 0}
          >
            <Text style={styles.buttonText}>Pembayaran</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: 'white',
  },
  flatListContent: {
    paddingBottom: 80, // Adjust this to provide space for the footer
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkbox: {
    margin: 20,
  },
  image: {
    width: 60,
    height: 60,
  },
  itemDetails: {
    flexDirection:'column',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemSubtotal: {
    fontSize: 14,
    color: '#888',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Keranjang;
