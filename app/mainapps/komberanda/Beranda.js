import React, { useEffect, useState } from 'react';
import {  Button, TextInput, View, TouchableOpacity, Modal, Text, StyleSheet, ActivityIndicator, Image, Dimensions, StatusBar, Platform, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import backgroundImage from '../../../assets/backgroundtop.png';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window'); // Mendapatkan dimensi layar

const Beranda = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menus, setFavMenus] = useState([]);
  const [promo, setPromo] = useState([]);
  const baseUrlMenu = 'https://eska.sonokembangmalang.tech/asset';
  const baseUrlPromo = 'https://eska.sonokembangmalang.tech/promosi';
  const baseUrlDiskon = 'https://eska.sonokembangmalang.tech/asset/diskon';
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [jumlahKeranjang, Setjumlahkeranjang] = useState(0);
  const [diskon, setDiskon] = useState(false);
  const [datadiskon, setDatadiskon] = useState([]);
  const [sistemupdate, setUpdate] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const iduser = await AsyncStorage.getItem('userid');
      if (iduser !== 'Trial' && iduser !== '') {
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
        setUserInfo(userResult);
      } else {
        setUserInfo({
          user_id: 'Trial',
          point_users: 0,
          point_referal: 0,
          user_level: 'Trial',
          nama_depan: 'user',
          nama_belakang: 'demo',
          cirikhas: null,
        });
      }
    } catch (error) {
      setUserInfo({
        user_id: 'Trial',
        point_users: 0,
        point_referal: 0,
        user_level: 'Trial',
        nama_depan: 'user',
        nama_belakang: 'demo',
        cirikhas: null,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const menuResponse = await fetch('https://eska.sonokembangmalang.tech/api.php?action=get_menu_fav');
      const menuResult = await menuResponse.json();
      setFavMenus(menuResult);
    } catch (error) {
      setLoading(true);
    }
  };

  
  const GetUpdate = async () => {
    try{ 
      const updateresponse = await fetch('https://eska.sonokembangmalang.tech/api.php?action=cekupdate');

      if (!updateresponse.ok) { // Check if the response is OK (status in the range 200-299)
        throw new Error('Network response was not ok');
      }
    
      const Updateresult = await updateresponse.json();
      console.log(Updateresult);
      console.log("Bacca Sini");
      if (Updateresult.Sukses === 'Benar') {
        setUpdate(true);
      } else {
        setUpdate(false);
      }
    }catch{
      setUpdate(false);
    }
  };

  const Getdiskon = async () => {
    try {
        const promoResponse = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getdiskon');
        
        if (!promoResponse.ok) { // Check if the response is OK (status in the range 200-299)
            throw new Error('Network response was not ok');
        }
        const promoResult = await promoResponse.json();
        if (promoResult.Sukses === 'Benar') {
            setDiskon(true);
            setDatadiskon(promoResult.Data);
        } else {
            setDiskon(false);
        }
    } catch (error) {
        setDiskon(false); // Set diskon to false if there's an error
    }
};


  const fetchPromo = async () => {
    try {
      const promoResponse = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getpromo');
      const promoResult = await promoResponse.json();
      setPromo(promoResult);
    } catch (error) {
      setLoading(true);
    }
  };

  const checkkeranjang = async () => {
    try {
      const iduser = await AsyncStorage.getItem('userid');
      if (iduser !== 'Trial' && iduser !== '') {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=countkeranjang', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userid: iduser }),
        });

        const data = await response.json();
          
          if (data.Hasil === 'Berhasil') {
            Setjumlahkeranjang(data.totalker);
          } else {
            Setjumlahkeranjang(0);
          }
      } else {
        Setjumlahkeranjang(0);
      }
    } catch (error) {
      setloading(true);
    }
  };


  const loadData = () => {
    setLoading(true);
    fetchUserInfo();
    fetchMenu();
    GetUpdate();
    Getdiskon();
    fetchPromo();
    checkkeranjang();
  };

  useFocusEffect(
    React.useCallback(() => {
        loadData(); // Load data when screen is focused
    }, []) // Make sure to not include any state variables here
  );


  const checkUserId = async () => {
    const userId = await AsyncStorage.getItem('userid');
    if (userId != null) {
      if (userId === 'Trial') {
        setShowLoginModal(true);
      } else {
        setShowLoginModal(false);
        navigation.navigate('Buatalamat')
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const checkUserId2 = async () => {
    const userId = await AsyncStorage.getItem('userid');
    if (userId != null) {
      if (userId === 'Trial') {
        setShowLoginModal(true);
      } else {
        setShowLoginModal(false);
        navigation.navigate('Menufav')
      }
    } else {
      setShowLoginModal(true);
    }
  };


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const closeModal = () => {
    setShowLoginModal(false);
    navigation.navigate('Beranda');
  };

  const handleLogin = async () => {
    await AsyncStorage.clear();
    setShowLoginModal(false);
    navigation.navigate('Halamanlogin');
  };

  
  const renderMenuItem = (menu, idx) => {
    return (
      <View style={styles.menuItem} key={idx}>
        <Image source={{ uri: `${baseUrlMenu}/${menu.gambar_menu}` }} style={styles.image} />
        <Text style={{ textAlign: 'left', fontSize: 12, marginBottom: 5 }}>{menu.nama_menu}</Text>
        <Text style={{ fontWeight: 'bold', textAlign: 'left', fontSize: 20 }}>Rp {menu.harga_jual.toLocaleString()}</Text>
        <TouchableOpacity style={styles.buttonmenuitem} onPress={() => navigation.navigate('DetailScreen', { namastack: 'Beranda', menuId: menu.id_menu , namaHeader: menu.nama_menu})}>
          <Text style={styles.buttonText}>Lihat Menu</Text>
        </TouchableOpacity>
      </View> 
    );
  };

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        {item.map((menu, idx) => renderMenuItem(menu, idx))}
      </View>
    );
  };

  const renderdiskonItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.promoItem} onPress={() => navigation.navigate('DetailScreen', { namastack: 'Beranda', menuId: item.subject_promo , namaHeader: item.nama_menu})} >
        <Image source={{ uri: `${baseUrlDiskon}/${item.gambar_diskon}` }} style={styles.promoImage} />
      </TouchableOpacity>
    );
  }

  const renderPromoItem = ({ item }) => {
    return (
      <View style={styles.promoItem}>
        <Image source={{ uri: `${baseUrlPromo}/${item.gambar_promo}` }} style={styles.promoImage} />
      </View>
    );
  };


  const handleOpenSearch = () => {
    navigation.navigate('carihalaman');
  };

  const groupedMenus = [];
  for (let i = 0; i < menus.length; i += 2) {
    groupedMenus.push(menus.slice(i, i + 2));
  }

  if (loading == true) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (sistemupdate == true) {
    return (
      <View style={{ flex : 1, alignContent: 'center', justifyContent: 'center'}}>
        <Text> Masih ada Perbaikan System mohon bersabar</Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.atasBerana}>

            <View style={styles.judulContainer}>
              <View style={styles.judulUser}>
              {userInfo.user_id  != 'Trial' ||  userInfo.user_id  != '' ? (
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Hai {capitalizeFirstLetter(userInfo.nama_depan)} !!
                  </Text>
                ) : (
                  <Text style={{ fontSize: 20 , color: 'white'}}>Selamat Datang Pengunjung</Text>
                )}
              </View>
              <View style={styles.iconContainer}>

                <Ionicons style={{ marginRight: 10 }} name='notifications' size={20} color='white'  />

                <TouchableOpacity onPress={() => navigation.navigate('Keranjang')} style={styles.keranjangcontainer}>
                    <Ionicons name="cart" size={20} color="white" />
                    {jumlahKeranjang > 0 && (
                      <View style={styles.keranjangicon}>
                        <Text style={styles.counterkeranjang}>{jumlahKeranjang}</Text>
                      </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Helpdesk')}>
                  <Ionicons name='call' size={20} color='white' />
                </TouchableOpacity>

              </View>
            </View>

            <Modal
              visible={showLoginModal}
              transparent={true}
              animationType="slide"
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                  <Text style={{ marginBottom: 20, textAlign: 'center' }}>Anda belum login!</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button title="Tutup" onPress={closeModal} />
                    <Button title="Login" onPress={handleLogin} />
                  </View>
                </View>
              </View>
            </Modal>

            <View style={styles.Alamatcontainer}>
                <Text style={{ fontSize : 14, fontWeight: 'bold', color : 'white' ,}}>Kirim Ke</Text>
                <TouchableOpacity onPress={checkUserId}>
                {userInfo.cirikhas  != null && userInfo.cirikhas  != '' ? (
                 < Text style={{ fontSize : 20, fontWeight: 'bold', color : 'white' ,}}> 
                    {userInfo.cirikhas.length > 30 ? `${userInfo.cirikhas.slice(0, 30)}...` : userInfo.cirikhas}
                    <Ionicons name='chevron-down-outline' size={20} color='white' />
                 </Text>
                ) : (
                  < Text style={{ fontSize : 20, fontWeight: 'bold', color : 'white' ,}}> Kota Malang <Ionicons name='chevron-down-outline' size={20} color='white' /></Text>
                )}

                
                </TouchableOpacity>  
            </View>

            <View style={styles.caribeli}>
              <TouchableOpacity onPress={handleOpenSearch} style={styles.searchContainer}>
                    <Ionicons name="search" size={20} style={styles.searchIcon} />             
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="gray"
                        editable={false}
                        onPress={handleOpenSearch}
                      />
              </TouchableOpacity>
              <TouchableOpacity onPress={checkUserId2} style={styles.circleContainer}>
                <Ionicons name="heart" size={30} color="gray" style={{ justifyContent: 'center', alignItems : 'center'}}/>
              </TouchableOpacity>
            </View>

            <View style={styles.pointContainer}>

              <View style={styles.carpoint}>
                  <View style={styles.pointreferalcolumn}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10,}}>
                      {userInfo.point_users.toLocaleString()}
                    </Text>
                    <Ionicons name="star-outline" size={12}>
                      <Text>Point User</Text>
                    </Ionicons>
                  </View>

                  <View style={styles.pointreferalcolumn}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10,}}>
                      {userInfo.user_level.toUpperCase()}
                    </Text>
                    <Ionicons name="speedometer" size={12}>
                      <Text>User Level</Text>
                    </Ionicons>
                  </View>

              </View>
            </View>

        </View>

        <View style={styles.promosi}>
          <Carousel
            loop
            width={width}
            height={200}
            data={promo}
            autoPlay={true}
            autoPlayInterval={3000}
            renderItem={renderPromoItem}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
          />
        </View>

        <View style={styles.menuFav}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Menu Paling Laku</Text>
          <Carousel
            loop
            width={width}
            height={250}
            data={groupedMenus}
            renderItem={renderCarouselItem}
            mode="parallax" // Aktifkan mode parallax
            scrollAnimationDuration={1000} // Atur durasi scrolling agar smooth
            modeConfig={{
              parallaxScrollingScale: 0.95, // Skala saat slide tidak aktif
              parallaxScrollingOffset: 25, // Offset untuk efek parallax
            }}
          />
        </View>
        
        {diskon && (
          <View style={styles.Diskon}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Diskon Menu</Text>
            <Carousel
              loop
              width={width}
              height={200}
              data={datadiskon}
              autoPlay={true}
              autoPlayInterval={3000}
              renderItem={renderdiskonItem}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
            />
          </View>
        )}


      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 80,
  },

  atasBerana: {
    height: 250,
    backgroundColor: '#cb020c',
  },
    
  caribeli: {
    height: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },

  judulContainer: {
    height: '25%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  Alamatcontainer : {
    height: '20%',
    flexDirection: 'column',
    padding: 10,
    alignItems: 'flex-start',
    marginBottom : 10,
  },

  pointContainer: {
    height: '35%', 
    paddingLeft: 10,
    paddingRight: 10, 
    paddingBottom: 15,
    marginTop: 15,
  },

  carpoint: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.8, // iOS
    shadowRadius: 2, // iOS
    elevation: 5, // Android
    borderColor: 'gray',
    justifyContent: 'space-between',
  },

  pointreferalcolumn: {
    flexDirection: 'column',
    margin: 10,
  },

  pointmember: {
    padding: 10,
    height: '40%',
  },
  pointText: {
    color: 'black',
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems:'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    color: 'white',
  },
  judulUser: {
    padding: 10,
  },
  promosi: {
    height: 200,
    marginTop: 10,
  },
  Diskon: {
    height: 200,
    marginTop: 10,
  },

  promoItem: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoImage: {
    width: width,
    height: 200,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  menuFav: {
    height: 270,
    margin: 0,
    flexDirection: 'column',
  },
  carouselItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    borderRadius: 10,
  },
  menuItem: {
    width: width / 2 - 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.8, // iOS
    shadowRadius: 2, // iOS
    elevation: 5, // Android
    flexDirection: 'column',
    padding: 10,
  },
  buttonmenuitem: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'blue',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: width / 2 - 40,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  kontentlain: {
    height: 200,
    padding: 10,
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
  searchInput: {
    flex: 1,
    height: '100%',
  },
  circleContainer: {
    marginRight:10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffff', // Ganti dengan warna yang diinginkan
    alignItems: 'center',
    justifyContent: 'center',
  },
  keranjangcontainer: {
    position: 'relative',
    padding: 5,
    marginRight: 10,
  },
  keranjangicon: {
    position: 'absolute',
    right: -2,
    top: -4,
    backgroundColor: 'white',
    borderColor:'black',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 0,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterkeranjang: {
    color: '#cb020c',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Beranda;