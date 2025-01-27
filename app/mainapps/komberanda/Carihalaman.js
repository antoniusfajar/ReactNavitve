import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Carihalaman = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [itemcari, setItemcari] = useState([]);
  const baseUrlMenu = 'https://eska.sonokembangmalang.tech/asset';
  const navigation = useNavigation();

  // Function to save search and fetch results
  const saveSearch = async (query) => {
    const iduser = await AsyncStorage.getItem('userid');
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=carimenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          katacari: query,
          userid: iduser,
        }),
      });

      const data = await response.json();
      console.log(data);
      const currentHistory = await AsyncStorage.getItem('searchHistory');
      let history = currentHistory ? JSON.parse(currentHistory) : [];

      if (!history.some(item => item.toLowerCase() === query.toLowerCase())) {
        history.push(query); // Only add if it doesn't exist, case-insensitive check
      }

      if (data && data.length > 0) {
        await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
        setItemcari(data); // Update the state with the search results
      } else {
        setItemcari([]); // Clear items if no data found
      }

      setSearchHistory(history);
      setSearchQuery(query);
    } catch (error) {
      console.error('Error during search or saving:', error);
    }
  };

  // Load search history
  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history !== null) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const likeordislike = async (item) => {
    // Determine the new favorite status
    const newStatus = item.is_favorite === 'Salah' ? 'Benar' : 'Salah'; // Toggle favorite status
  
    // Update the local state first
    const updatedItems = itemcari.map((currentItem) => 
      currentItem.id_menu === item.id_menu 
        ? { ...currentItem, is_favorite: newStatus } 
        : currentItem
    );
    setItemcari(updatedItems); // Update state immediately
  
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
        console.log('Sukses');
      } else {
        // Revert to the previous state if the update failed
        const revertData = filteredItems.map((d) => 
          d.id_menu === item.id_menu ? { ...d, is_favorite: item.is_favorite } : d
        );
        setItemcari(revertData);
        console.error('Failed to update item:', hasil.message);
      }
    } catch (error) {
      console.error('Error:', error); // Handle network errors
    }
  };
  
  // Clear search history
  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setSearchHistory([]);
      setItemcari([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const klikpencarianasync = (item) => {
    saveSearch(item);
  };

  // Render function for each menu item in grid
  const renderMenuItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: `${baseUrlMenu}/${item.gambar_menu}` }} style={styles.image} />
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



  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nama Menu Tidak ditemukan</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => saveSearch(searchQuery)}
            returnKeyType="search"
            keyboardType="default"
          />
        </View>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Search History:</Text>
        <TouchableOpacity onPress={clearSearchHistory}>
          <Ionicons name="close" size={25} style={styles.xicon} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchHistoryList}>
        {searchHistory.map((item, index) => (
          <TouchableOpacity key={index} style={styles.asyncsearch} onPress={() => klikpencarianasync(item)}>
            <Text style={{ fontSize : 12, color:'white'}}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FlatList for displaying search results in a grid format */}
        {itemcari.length > 0 ? (
          <FlatList
            data={itemcari}
            renderItem={renderMenuItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2} // Display 2 items per row
            contentContainerStyle={styles.listContainer} // Ensure correct spacing
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nama Menu Tidak ditemukan</Text>
          </View>
        )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#cb020c',
    padding: 20,
    marginBottom: 20,
  },
  asyncsearch: {
    borderRadius: 10,
    marginRight: 10,
    padding: 5,
    backgroundColor: '#cb020c',
    margin: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    width: '85%',
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  xicon: {},
  searchInput: {
    flex: 1,
    height: '100%',
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  historyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  historyTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'gray',
  },
  searchHistoryList: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexWrap: 'wrap',
  },
  listContainer: {
    // You can use padding or margin to create spacing between items
    justifyContent: 'space-between',
  },
  menuItem: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.8, // iOS
    shadowRadius: 2, // iOS
    elevation: 5, // Android
    padding: 10,
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
    width: '45%',
     // Mengisi seluruh lebar kolom
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

export default Carihalaman;
