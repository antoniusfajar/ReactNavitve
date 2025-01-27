import React, { useState } from 'react';
import {StatusBar, View, FlatList, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Grubmenu = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const urlitem = 'https://eska.sonokembangmalang.tech/asset/Grub_kat';

  useFocusEffect(
    React.useCallback(() => {
      const fetchMenuItems = async () => {
        try {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getgrupkategori', {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });

          const result = await response.json();
          if (Array.isArray(result)) {
            setMenuItems(result);
          } else {
            console.log(result.message || 'Unknown error occurred');
          }
        } catch (error) {
          console.error('Fetch Error: ', error);
        }
      };

      fetchMenuItems();
    }, []) // Empty dependency array to run this effect every time the screen is focused
  );
  const handlePress = (item) => {
    navigation.navigate('BelanjaMain', { idGrubKategori: item.id_grub_kategori,  namagrubkategori: item.nama_kategori});
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      <Image source={{ uri: `${urlitem}/${item.Gambargrubkat}` }} style={styles.image} />
      <Text style={styles.title}>{item.nama_kategori}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar />
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_grub_kategori.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width / 2 - 30,
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Grubmenu;
