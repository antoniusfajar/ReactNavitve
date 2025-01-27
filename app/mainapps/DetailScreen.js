import React, { useEffect, useState, useCallback } from 'react';
import { Alert, ScrollView, View, Text, StyleSheet, ActivityIndicator, Image, Dimensions, SafeAreaView, StatusBar, TouchableOpacity, Button, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route , navigation }) => {
  const { menuId, namastack } = route.params;
  const [datamenus, setDetailmenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBeliModal, setShowBeliModal] = useState(false);
  const [jumlahBeli, setJumlahBeli] = useState(20);
  const [adakeranajang , Setadakeranjang ] = useState(false);
  const [Buttonmasuk, Setbuttonmasuk] = useState('');
  const [ cekdiskon, Setisdiskon] = useState(false);
  const [ oldharga, Setoldharga] = useState(0);
  const [ hargadiskon, Sethargadiskon] = useState(0); 
  const [ hargakeranjang, Sethargakeranjang] = useState(0); 

  useFocusEffect(
    React.useCallback(() => {
      const fetchDetailMenu = async () => {
        const idser = await AsyncStorage.getItem('userid');
        try {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getdetailmenu', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userid: idser,
              idmenu: menuId,
            }),
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
      
          const detailmenu = await response.json();
          const filteredData = detailmenu.filter(menu => menu.id_menu === menuId);
          setDetailmenu(filteredData);
      
          if (filteredData.length > 0) {
            const firstItem = filteredData[0]; // First element in the array
      
            if (firstItem.Diskon === 'YES') { // Use comparison (===) instead of assignment
              try {
                const getdatadiskon = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getdiskonmenus', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    idmenu: firstItem.id_menu,
                  }),
                });
      
                const gethargadiskon = await getdatadiskon.json();
                
                const hargasekarang = firstItem.harga_jual; // Access the specific item
                const hargadiskon = parseFloat(gethargadiskon[0].total_diskon / 100) * hargasekarang;
                const realharga = hargasekarang - hargadiskon;

                Setisdiskon(true);
                Sethargadiskon(realharga);
                Setoldharga(hargasekarang);
                Sethargakeranjang(realharga);
              } catch (error) {
                console.error('Failed to fetch discount data:', error);
              }
            }else{
              Setisdiskon(false);
              Sethargakeranjang(firstItem.harga_jual);
            }
      
            if (firstItem.id_keranjang != null) {
              setJumlahBeli(firstItem.jumlah_beli);
              Setbuttonmasuk('Rubah Jumlah Beli');
              Setadakeranjang(true);
            } else {
              Setadakeranjang(false);
              Setbuttonmasuk('Masukkan Keranjang');
              setJumlahBeli(firstItem.min_order);
            }
          }
        } catch (error) {
          console.error('Failed to fetch menu details:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDetailMenu();
    }, [menuId]) // Make sure to not include any state variables here
  );


  useFocusEffect(
    useCallback(() => {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: { display: 'none' },
        });

      }

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
        }else{
          parentNavigation.setOptions({
            tabBarStyle: { display: 'none'},
          });
        }
      };
    }, [navigation])
  );



  const tombolBeli = async () => {
    try {
      const userId = await AsyncStorage.getItem('userid');
      if (userId) {
        if (userId === 'Trial') {
          setShowLoginModal(true);
        } else {
          setShowBeliModal(true);
        }
      } else {
        navigation.navigate('Halamanlogin');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const masukkeranjang = async () => {
    let namaMenu = datamenus[0].nama_menu;
  
    Alert.alert(
      'Konfirmasi',
      `Apakah Anda yakin ingin memasukkan '${namaMenu}' ke dalam keranjang?`,
      [
        {
          text: 'Tidak',
          onPress: () => console.log('Pembatalan'),
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              let keruserid = await AsyncStorage.getItem('userid');
              if (keruserid) {
                let keridmenu = datamenus[0].id_menu;
                let kerjumlahbeli = jumlahBeli;
                let subtotalbeli = jumlahBeli * datamenus[0].harga_jual;
                let kerhargabeli = hargakeranjang;
                const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=masukkeranjang', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    user_id: keruserid,
                    id_menu: keridmenu,
                    harga_beli: kerhargabeli,
                    jumlah_beli: kerjumlahbeli,
                    subtotal_beli: subtotalbeli,
                  }),
                });
                const hasilkirim = await response.json();
                console.log(hasilkirim);
                setShowBeliModal(false);
                navigation.navigate('Keranjang');
              } else {
                console.error('User ID tidak ditemukan');
              }
            } catch (error) {
              console.error('Error adding item to cart:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  const closeModalBeli = () => {
    setShowBeliModal(false);
  };

  const handleLogin = () => {
    AsyncStorage.removeItem('userid')
      .then(() => {
        setShowLoginModal(false);
        navigation.navigate('Halamanlogin');
      })
      .catch((error) => {
        console.error('Error removing userid:', error);
      });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (datamenus.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Data tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.detailImage}>
          <Carousel
            loop={datamenus.length > 1}
            width={width - 40}
            height={240}
            autoPlay={datamenus.length > 1}
            autoPlayInterval={3000}
            data={datamenus}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image source={{ uri: `https://eska.sonokembangmalang.tech/asset/${item.gambar_menu}` }} style={styles.image} />
              </View>
            )}
            onSnapToItem={(index) => setCurrentSlide(index)}
          />
          {datamenus.length > 1 && (
            <View style={styles.indicatorContainer}>
              {datamenus.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentSlide === index ? styles.activeIndicator : styles.inactiveIndicator,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
        <View style={styles.menuDescription}>
          <Text style={styles.title}>{datamenus[0].nama_menu}</Text>
          <View style={styles.categoryList}>
            {datamenus[0].penjelasan_menu.split(',').map((item, index) => (
              <View key={index} style={styles.categoryItemContainer}>
                {/* Bullet point dengan ukuran lebih besar */}
                <Text style={styles.bulletPoint}>{'\u2022'}</Text>
                {/* Teks item */}
                <Text style={styles.categoryItem}>{item.trim()}</Text>
              </View>
            ))}
          </View>
          <View>
            {cekdiskon ? (
              <View style={{ flexDirection: 'row', justifyContent:'flex-end' , alignItems: 'flex-end' }}>
                  <Text style={[styles.oldPrice, { 
                    textDecorationLine: 'line-through', 
                    color: 'grey', 
                    fontSize: 12, // Smaller font for superscript
                    marginRight: 4, 
                    alignSelf: 'flex-start', 
                    marginTop: 4 // Adjust position to look like a superscript
                  }]}>
                    Rp {oldharga.toLocaleString().replace(/\./g, ',')}
                  </Text>
                  <Text style={styles.price}>
                    Rp {hargadiskon.toLocaleString().replace(/\./g, ',')}
                  </Text>
              </View>
            ) : (
              <Text style={styles.price}>
                Rp {datamenus[0].harga_jual.toLocaleString().replace(/\./g, ',')}
              </Text>
            )}
          </View>
          <Text style={styles.minOrder}>Min order {datamenus[0].min_order}</Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.addButton} onPress={tombolBeli}>
            <Ionicons name="cart-outline" size={24} color="white" />
            <Text style={{ color: 'white', marginLeft: 3 }}>{Buttonmasuk}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={showLoginModal}
        backdropOpacity={0.9}
        backdropColor="black"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Anda belum login!</Text>
          <View style={styles.modalButtonContainer}>
            <Button title="Tutup" onPress={closeModal} />
            <Button title="Login" onPress={handleLogin} />
          </View>
        </View>
      </Modal>


      <Modal
        isVisible={showBeliModal}
        backdropOpacity={0.9}
        backdropColor="black"
        style={styles.beliModal}
        onBackdropPress={closeModalBeli}  
        animationIn="fadeIn"
        animationInTiming={1500}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.beliModalContent}
        > 
            <View style={styles.beliModalTop}>
              <View style={{ width: '50%', height: '100%', justifyContent:'center' , alignItems:'center',}}>
                <Image source={{ uri: `https://eska.sonokembangmalang.tech/asset/${datamenus[0].gambar_menu}` }} style={styles.beliImage} />
              </View>
              <View style={styles.beliTextContainer}>
                <View style={{ flexDirection:'row' , flexWrap :'wrap' , }}>
                  <Text style={styles.beliTitle}>{datamenus[0].nama_menu}</Text>
                </View>
                <View>
                  <Text style={styles.beliCategory}>{datamenus[0].nama_kategori + ' ' + datamenus[0].nama_kat_menu}</Text>
                </View>
                <View>
                  <Text style={styles.beliPrice}>Rp {hargakeranjang.toLocaleString().replace(/\./g, ',')  }</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.quantityContainer}>
              <View style={styles.quantityLabel}>
                <Text style={{ fontSize: 20 }}>Jumlah Beli</Text>
              </View>
              
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  onPress={() => setJumlahBeli(Math.max(jumlahBeli - 1, 1))}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput 
                  style={styles.quantityInput}
                  value={`${jumlahBeli}`}
                  onChangeText={(text) => setJumlahBeli(Number(text) || 0)}
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  onPress={() => setJumlahBeli(jumlahBeli + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.beliModalBottom}>
              <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPrice}>
                  Rp { (Number(jumlahBeli) * hargakeranjang)
                      .toLocaleString()  
                      .replace(/\./g, ',')      
                  }
                </Text>
              </View>
              <View style={styles.addButtonContainer}>
                <TouchableOpacity
                  onPress={masukkeranjang}
                  disabled={jumlahBeli < datamenus[0].min_order}
                  style={[
                    styles.addButton,
                    { 
                      borderColor: jumlahBeli < datamenus[0].min_order ? 'transparent' : 'transparent',
                      borderWidth: jumlahBeli < datamenus[0].min_order ? 0.8 : 0,
                      backgroundColor: jumlahBeli < datamenus[0].min_order ? 'lightgray' : 'blue'
                    }
                  ]}
                >
                  <Text 
                    style={{
                      fontSize: 18,
                      color: jumlahBeli < datamenus[0].min_order ? 'gray' : 'white',
                      textAlign: 'center'
                    }}
                  >
                    {Buttonmasuk}
                  </Text>
              </TouchableOpacity>
              </View>
            </View>
        
        </KeyboardAvoidingView>
      </Modal>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  detailImage: {
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDescription: {
    flexDirection: 'column',
    padding: 10,
    borderRadius: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    height: '100%',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width - 40,
    height: (width - 40) * 0.75,
    resizeMode: 'cover',
  },
  beliImage: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    height: 15,
  },
  activeIndicator: {
    backgroundColor: 'blue',
  },
  inactiveIndicator: {
    backgroundColor: 'gray',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
    marginTop: 'auto',
    textAlign: 'right',
  },
  minOrder: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  beliModal: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
  },
  beliModalContent: {
    backgroundColor: 'gray',
    borderRadius: 20,
    width: '100%',
    height: '60%',
  },
  beliModalTop: {
    flexDirection: 'row',
    height: '60%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'white',
  },
  beliTextContainer: {
    flexDirection:'column',
    marginLeft: 20,
    width:'50%',
    justifyContent: 'center',
  },
  beliTitle: {
    fontSize: 20,
  },
  beliCategory: {
    fontSize: 10,
  },
  beliPrice: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    height: '25%',
    padding: 20,
    borderTopWidth: 1,
    backgroundColor:'white',
    borderBottomWidth: 1, 
    borderColor: 'gray',
  },
  quantityLabel: {
    width: '50%',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  quantityControls: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  quantityButton: {
    height: 30,
    width: 30,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: 'white',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: 'gray',
    height: 30,
    width: 50,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  beliModalBottom: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    backgroundColor:'white',
    borderColor: 'transparant',
    height: '15%',
  },
  totalPriceContainer: {
    width: '60%',
    justifyContent: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
  addButtonContainer: {
    width: '40%',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: 'transparant',
    flexWrap: 'wrap',
  },
  categoryList: {
    marginTop: 5,
  },
  categoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2, // jarak antar item
  },
  bulletPoint: {
    fontSize: 20,
    color: 'black',
    marginRight: 6, // jarak antara bullet point dan teks
  },
  categoryItem: {
    fontSize: 14,
    color: 'black',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green', // Color for discounted price
  },
  oldPrice: {
    fontSize: 18,
    color: 'grey',
    textDecorationLine: 'line-through', // Strikethrough for old price
  },
  scrollContainer: {
    flexGrow: 1,            // Ensures the ScrollView can grow to fit its content
    justifyContent: 'center', // Centers the content vertically when the keyboard is not visible
    padding: 20,            // Adds some padding to the content inside the ScrollView
  },
});

export default DetailScreen;
