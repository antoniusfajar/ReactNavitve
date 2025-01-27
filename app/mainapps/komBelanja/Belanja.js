import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  View, 
  TextInput, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  PanResponder, 
  Image,
  ActivityIndicator,
  StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Belanja = ({route , navigation}) => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const { idGrubKategori , namagrubkatehori } = route.params;
  const [totalPrice, setTotalPrice] = useState(0);
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const urlitem = 'https://skmeme.sonokembangmalang.tech/asset';
  const urlkatmenu = 'https://skmeme.sonokembangmalang.tech/asset/kat_menu';
  const [setidmenu , Setidmeni] = useState('');
  const [idlikeordi , SetLikeordis] = useState('');
  const [ items, setItems] = useState([]);

  useEffect(() => {
    const getchallmenu = async () => {
      const iduser = await AsyncStorage.getItem('userid');
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=get_all_menu', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idgrubkat: idGrubKategori,
            userid : iduser,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
    
        const menuResult = await response.json();
        // Pastikan bahwa `menuResult` adalah array
        if (Array.isArray(menuResult)) {
          setFilteredItems(menuResult);
          setItems(menuResult);
        } else {
          setFilteredItems([]);
          setItems([]);
        }
      } catch (error) {
        setLoading(true);
        setFilteredItems([]);
      } finally {
        setLoading(false);
      }
    };    
    getchallmenu();
  }, [navigation]);


  const handleSearch = (text) => {
    setSearch(text);
    const filteredData = filteredItems.filter(
      (item) => 
        item.nama_menu.toLowerCase().includes(text.toLowerCase()) || 
        item.nama_kat_menu.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filteredData);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredItems(items);
    } else {
      const filteredData = items.filter((item) => item.nama_kat_menu === category);
      setFilteredItems(filteredData);
    }
  };


  const likeordislike = async (item) => {
    // Determine the new favorite status
    const newStatus = item.is_favorite === 'Salah' ? 'Benar' : 'Salah'; // Toggle favorite status
  
    // Update the local state first
    const updatedItems = filteredItems.map((currentItem) => 
      currentItem.id_menu === item.id_menu 
        ? { ...currentItem, is_favorite: newStatus } 
        : currentItem
    );
    setFilteredItems(updatedItems); // Update state immediately
  
    const iduser = await AsyncStorage.getItem('userid');
  
    try {
      // Make the API call to update the server
      const response = await fetch('https://skmeme.sonokembangmalang.tech/api.php?action=likeordislike', {
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
      console.log(hasil);
  
      // Check if the update was successful
      if (hasil.Sukses) {
        console.log('Sukses');
      } else {
        // Revert to the previous state if the update failed
        const revertData = filteredItems.map((d) => 
          d.id_menu === item.id_menu ? { ...d, is_favorite: item.is_favorite } : d
        );
        setFilteredItems(revertData);
        console.error('Failed to update item:', hasil.message);
      }
    } catch (error) {
      setLoading(true);
    }
  };
  
  

  const getUniqueCategories = () => {
    const categories = items.reduce((acc, item) => {
      const category = item.nama_kat_menu;
      const image = item.gmbra_kategorimenu;
      
      // Check if the category is already added
      if (!acc.some((cat) => cat.nama_kat_menu === category)) {
        acc.push({ nama_kat_menu: category, gmbra_kategorimenu: image });
      }
      
      return acc;
    }, []);
    
    return categories; // Return only unique categories without 'Semua'
  };
  
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('DetailScreen', { namastack: 'Produk', menuId: item.id_menu, namaHeader: item.nama_menu })}>
          <Image source={{ uri: `${urlitem}/${item.gambar_menu}` }} style={styles.image} />
        </TouchableOpacity>
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
        <View key={subItem.id_menu || index} style={styles.column}>
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari barang..."
          value={search}
          onChangeText={handleSearch}
        />
        <ScrollView horizontal style={styles.categoryContainer}>
            {getUniqueCategories().map((category) => (
              <TouchableOpacity
                key={category.nama_kat_menu} // Use the category name as the key
                style={[styles.categoryButton, selectedCategory === category.nama_kat_menu && styles.selectedCategoryButton]}
                onPress={() => handleCategoryPress(category.nama_kat_menu === 'Semua' ? '' : category.nama_kat_menu)}
              >
                <View style={styles.circleContainer}>
                  {category.gmbra_kategorimenu ? ( // Check if the image exists
                    <Image
                      source={{ uri: `${urlkatmenu}/${category.gmbra_kategorimenu}` }} // Image for the category
                      style={styles.circleImage}
                    />
                  ) : null}
                </View>
                <Text
                  style={[styles.categoryButtonText, selectedCategory === category.nama_kat_menu && styles.selectedCategoryButtonText]}
                >
                  {category.nama_kat_menu} 
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
      </View>
      <FlatList
        data={splitDataIntoRows(filteredItems, 2)}
        extraData={filteredItems}  
        keyExtractor={(item, index) => (item.id_menu ? item.id_menu.toString() : index.toString())}
        renderItem={renderRow}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Belum ada data</Text>} // Tambahkan ini
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
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
  searchContainer: {
    marginBottom: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderBottomEndRadius: 1,
    backgroundColor: 'white',
    
    // Shadow untuk iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    // Elevation untuk Android
    elevation: 5,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  categoryButton: {
    flexDirection:'column',
    width: 100,
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#cb020c',
  },
  selectedCategoryButtonText: {
    color: 'white',
    fontSize: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
    color: 'gray',
  },
  circleContainer: {
    alignItems: 'center',  // Center the image and text horizontally
    justifyContent: 'center',  // Center the image and text vertically // Spacing between items
  },
  circleImage: {
    width: 50,  // Set the width of the circular image
    height: 50,  // Set the height of the circular image
    borderRadius: 30,  // Half of width and height for a circular shape
    overflow: 'hidden',  // Ensures the image doesn't overflow the container
    borderWidth: 2,  // Optional: add border to the image
    borderColor: '#ccc',  // Optional: set border color
  },
  categoryButtonText: {
    color: 'black',
    fontSize: 10,
    textAlign: 'center',  // Center text below the image
    marginTop: 5,  // Space between the image and the text
  },
});

export default Belanja;
