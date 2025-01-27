import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Button,
  Image,
  TextInput,
  Dimensions,
  Linking,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';

const PilihLokasi = ({ route , navigation }) => {
  const [provinsi, setProvinsi] = useState([]);
  const [wilayah, setWilayah] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [desa, setDesa] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date'); // 'date' or 'time'
  const [show, setShow] = useState(false);
  const [databarang, setDatabarang] = useState([]);
  const [selectedTipe, setSelectedTipe] = useState('Biasa');
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const { nomorapi, nonota } = route.params || {};
  const urlItem = 'https://eska.sonokembangmalang.tech/asset';
  const urlkartutas = 'https://eska.sonokembangmalang.tech/asset/Tambahan';
  const [biayakirim , setBiayakirim] = useState(0);
  const [isPickup, setIsPickup] = useState(false);
  const [isShipping, setIsShipping] = useState(false);
  const [isNikahan, setNikahan] = useState(false);
  const [isSyukuran, setSyukuran] = useState(true);
  const [isKantoran, setisKantoran] = useState(false);
  const [kirimsaya, setkirimsaya] = useState(false);
  const [kirimorang, setkirimorang] = useState(false);
  const [namaPengirim, setNamaPengirim] = useState('');
  const [nomorPengirim, setNomorPengirim] = useState('');
  const [alamatkirim, setAlamatkirim] = useState('');
  const [totalkeranjang, setTotalKeranjang] = useState(0);
  const [Jenisacara, setJenisacara] = useState('');
  const [namacara, setNamaacara] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [totalnota, setTotalnota] = useState(0);
  const [jumlaheli, setJumlahbeli] = useState(0); 
  const [isOnkosKirimValid, setIsOnkosKirimValid] = useState(false);
  const [buttonfasle , Setbuttonfalse] = useState('');
  const [kartuucapan, Setkartuucapan] = useState(false);
  const [ memokartu , setMemoKartu] = useState('');
  const [ alamatutama, setIsuserbelumbikin] = useState('false');
  //pilih souvenir
  const [biayasouvenir, Setbiayasouvenir] = useState(0);
  const [ kartuklik ,setKeterangankartu] = useState(false);
  const [isbelitas, Setisbelitas] = useState(false);
  const [isbelikartu, Setisbelikartu] = useState(false);
  const [datakartu, SetDatakartu] = useState([]);
  const [datatas, SetDatatas] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedTas, setSelectedTas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const parentNavigation = navigation.getParent();
      if (parentNavigation) {
        parentNavigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }else{
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

  useEffect(() => {
    const fetchProvinsi = async () => {
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getprovinsi', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setProvinsi(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Gagal mengambil data provinsi:', error);
      }
    };

    const fetchKeranjang = async () => {
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getnotabarangkeranjang', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nomor_nota: nonota }),
        });
        const datakeranjang = await response.json();
        setDatabarang(datakeranjang);
        let total = 0;
        let jumlahbeli = 0;
        datakeranjang.forEach(item => {
          total += parseInt(item.total_beli, 10);
          jumlahbeli += parseInt(item.jumlah_beli);
        });
        setTotalKeranjang(total);
        setTotalnota(total);
        setJumlahbeli(jumlahbeli);
      } catch (error) {
        setDatabarang([]);
        navigation.goBack()
      }
    };

    Setbuttonfalse('Masukkan Data Terlebih dahulu');
    setJenisacara('102');
    setNamaacara('SYUKURAN');
    setBiayakirim(0);
    fetchProvinsi();
    fetchKeranjang();
    datetimedefault();
  }, [nonota]);

  useEffect(() => {
    if (selectedProvinsi) {
      const fetchWilayah = async () => {
        try {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getwilayah', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_provinsi: selectedProvinsi }),
          });
          const data = await response.json();
          setWilayah(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Gagal mengambil data wilayah:', error);
        }
      };

      fetchWilayah();
    } else {
      setWilayah([]);
      setKecamatan([]);
      setDesa([]);
      setSelectedWilayah(null);
      setSelectedKecamatan(null);
      setSelectedDesa(null);
    }
  }, [selectedProvinsi]);

  useEffect(() => {
    if (selectedWilayah) {
      const fetchKecamatan = async () => {
        try {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getkecamatan', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_wilayah: selectedWilayah }),
          });
          const data = await response.json();
          setKecamatan(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Gagal mengambil data kecamatan:', error);
        }
      };

      fetchKecamatan();
    } else {
      setKecamatan([]);
      setDesa([]);
      setSelectedKecamatan(null);
      setSelectedDesa(null);
    }
  }, [selectedWilayah]);

  useEffect(() => {
    if (selectedKecamatan) {
      const fetchDesa = async () => {
        try {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getdesa', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_kecamatan: selectedKecamatan }),
          });
          const data = await response.json();
          setDesa(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Gagal mengambil data desa:', error);
        }
      };

      fetchDesa();
    } else {
      setDesa([]);
      setSelectedDesa(null);
    }
  }, [selectedKecamatan]);

  const formatCurrency = (value) => {
    return value.toLocaleString().replace(/\./g, ',');
  };
  
  const getalamatutama = async () => {
    const iduseralamat = await AsyncStorage.getItem('userid');
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getalamatutama', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: iduseralamat }),
      });
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
          // Mencari alamat utama
          const alamatUtama = data.find((alamat) => alamat.Utama === 'YES');
          
          if (alamatUtama) {
              const kota = alamatUtama.kota.toLowerCase();
              // Pastikan bahwa kota termasuk dalam salah satu kota yang dijangkau
              if (kota !== 'malang' && kota !== 'kabupaten malang' && kota !== 'kota malang') {
                  setIsuserbelumbikin(true);
                  setIsOnkosKirimValid(false);
                  Setbuttonfalse('Alamat Utama diluar jangkauan');
                  setAlamatkirim(alamatUtama.alamat);
              } else {
                  if(kota == 'malang' | kota == 'kota malang'){
                    let newongkoskirim = 30000;
                    let totalnotabaru = newongkoskirim + totalnota;
                    setTotalnota(totalnotabaru);
                    setBiayakirim(newongkoskirim);
                    setIsuserbelumbikin(true);
                    setAlamatkirim(alamatUtama.alamat); // Tampilkan alamat utama
                    setIsOnkosKirimValid(true);
                  }else{
                    let newongkoskirim = 50000;
                    let totalnotabaru = newongkoskirim + totalnota;
                    setTotalnota(totalnotabaru);
                    setBiayakirim(newongkoskirim);
                    setIsuserbelumbikin(true);
                    setAlamatkirim(alamatUtama.alamat); // Tampilkan alamat utama
                    setIsOnkosKirimValid(true);
                  }
                  
              }
          } else {
              // Tidak ada alamat utama
              setAlamatkirim('Alamat Utama Belum dibuat');
              setIsOnkosKirimValid(false);
              setIsuserbelumbikin(false);
              Setbuttonfalse('Alamat Utama Belum dibuat');
          }
      } else {
          // Tidak ada data alamat sama sekali
          setAlamatkirim('Alamat Utama Belum dibuat');
          setIsOnkosKirimValid(false);
          setIsuserbelumbikin(false);
          Setbuttonfalse('Alamat Utama Belum dibuat');
      }
      } catch (error) {
          setAlamatkirim('Alamat Utama Belum dibuat');
          setIsOnkosKirimValid(false);
          setIsuserbelumbikin(false);
          Setbuttonfalse('Alamat Utama Belum dibuat');
      }
  };

  const handleSelect = (key, type) => {
    switch (type) {
      case 'provinsi':
        setSelectedProvinsi(key);
        setIsOnkosKirimValid(false);
        setSelectedWilayah(null);
        setSelectedKecamatan(null);
        setSelectedDesa(null);
        setWilayah([]);
        setKecamatan([]);
        setDesa([]);
        break;
      case 'wilayah':
        setSelectedWilayah(key);
        setIsOnkosKirimValid(false);
        setSelectedKecamatan(null);
        setSelectedDesa(null);
        setKecamatan([]);
        setDesa([]);
        break;
      case 'kecamatan':
        setSelectedKecamatan(key);
        setIsOnkosKirimValid(false);
        setSelectedDesa(null);
        setDesa([]);
        break;
      case 'desa':
        setSelectedDesa(key);
        const selectedDesaData = desa.find(d => d.id_desa === key);
        if (selectedDesaData) {
          const onkoskirim = parseFloat(selectedDesaData.onkoskirim); // parse as floating point number
          if (!isNaN(onkoskirim)) {
            let totalnotabaru = onkoskirim + totalnota;
            setTotalnota(totalnotabaru);
            setBiayakirim(onkoskirim);
            setIsOnkosKirimValid(true);
          } else {
            setIsOnkosKirimValid(false);
            Setbuttonfalse('Lokasi diluar jangkauan');
            setBiayakirim(0);
          }
        }
        break;
      default:
        break;
    }
  };

  const handleacara = (option) => {
    if (option === 'syukuran') {
      setNikahan(false);
      setSyukuran(true);
      setisKantoran(false);
      setJenisacara('102');
      setNamaacara('SYUKURAN');
    } else if (option === 'kantor') {
      setNikahan(false);
      setSyukuran(false);
      setisKantoran(true);
      setJenisacara('00010');
      setNamaacara('ACARA KANTOR');
    }else if(option === 'nikah'){
      setNikahan(true);
      setSyukuran(false);
      setisKantoran(false);
      setJenisacara('101');
      setNamaacara('PERNIKAHAN');
    }
  };

  const handleShippingOptionChange = (option) => {
    if (option === 'pickup') {
      if (isPickup) {
        // Jika pickup sudah dicentang, uncheck
        setIsPickup(false);
        setAlamatkirim(''); // Reset alamat jika di-uncheck
        setIsOnkosKirimValid(false);
        setBiayakirim(0);
      } else {
        // Jika pickup belum dicentang, centang
        setIsPickup(true);
        setIsShipping(false);
        setAlamatkirim('Sonokembang Malang');
        setIsOnkosKirimValid(true);
        setBiayakirim(0);
      }
    } else if (option === 'shipping') {
      if (isShipping) {
        // Jika shipping sudah dicentang, uncheck
        setAlamatkirim('');
        setIsShipping(false);
        setTotalnota(totalnota);
        setBiayakirim(0);
      } else {
        // Jika shipping belum dicentang, centang
        setIsShipping(true);
        setIsPickup(false); // Pastikan pickup tidak dicentang
      }
    }
  };


  const handleKirimke = (option) => {
    if (option === 'kesaya'){
      if(kirimsaya){
        setkirimsaya(false);
        Setbuttonfalse('Masukkan Data Terlebih dahulu');
        setNamaPengirim('');
        setNomorPengirim('');
        setTotalnota(totalnota);
        setBiayakirim(0);
      }else{
        getalamatutama();
        setNamaPengirim('userid');
        setNomorPengirim('tidakada');
        setkirimsaya(true);
        setkirimorang(false);
      }
    }else if(option === 'keorang'){
      if(kirimorang){
        setkirimorang(false);
        setNamaPengirim('');
        setNomorPengirim('');
        setTotalnota(totalnota);
        setBiayakirim(0);
        Setbuttonfalse('Masukkan Data Terlebih dahulu');
      }else{
        setkirimsaya(false);
        setkirimorang(true);
      }
    }
  };


  const handleCardSelect = (isSelected, card) => {
    if (isSelected) {
      setSelectedCards([card]);
      setKeterangankartu(true);
    } else {
      setSelectedCards([]);
      setKeterangan(null);
      setKeterangankartu(false);
    }
  };

  const handleTasSelect = (isSelected, card) => {
    if (isSelected) {
      setSelectedTas([card]);
    } else {
      setSelectedTas([]);
    }
  };


  // Function untuk menghitung total biaya souvenir
  useEffect(() => {
    let totalsov = 0 ;
    if(selectedTipe == 'Biasa'){
      totalsov = selectedCards.reduce((acc, item) => acc + (item.harga_sov * (jumlaheli || 1)), 0) +
                 selectedTas.reduce((acc, item) => acc + (item.harga_sov * (jumlaheli || 1)), 0);
      Setbiayasouvenir(totalsov);
    }else if(selectedTipe == 'Premium'){
      totalsov = selectedCards.reduce((acc, item) => acc + (item.harga_sovpre * (jumlaheli || 1)), 0) +
                 selectedTas.reduce((acc, item) => acc + (item.harga_sovpre * (jumlaheli || 1)), 0);
      Setbiayasouvenir(totalsov);
    }else{
      Setbiayasouvenir(totalsov);
    }
  }, [selectedCards, selectedTas, jumlaheli, selectedTipe]);

  useEffect(() => {
    if (isbelikartu || isbelitas) {
      (async () => {
        try {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getkartuucapan', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}), // Sesuaikan body jika diperlukan
          });
          const data = await response.json();
  
          if (Array.isArray(data)) {
            if (isbelikartu) {
              const filteredKartu = data.filter(item => item.Jenissov === 'KARTU');
              SetDatakartu(filteredKartu); // Set data untuk kartu ucapan
            } else if (isbelitas) {
              const filtertas = data.filter(item => item.Jenissov === 'TAS');
              SetDatatas(filtertas); // Set data untuk tas
            }
          } else {
            console.error('Unexpected data format:', data);
            SetDatakartu([]); // Reset state jika data tidak sesuai
            SetDatatas([]);   // Reset state tas juga
          }
        } catch (error) {
          console.error('Gagal mengambil data souvenir:', error);
        }
      })(); // Panggil async function langsung
    }
  }, [isbelikartu, isbelitas]);
  

  const bayarnota = async () => {
    try {
        // Validasi input di frontend
        if (!namaPengirim || !nomorPengirim || !alamatkirim || !namacara || !alamatkirim ) {
            Alert.alert('Peringatan', 'Harap lengkapi semua kolom.');
            console.log(namaPengirim + nomorPengirim + alamatkirim + namacara);
            return;
        }

        // Tampilkan alert konfirmasi pembayaran
        Alert.alert(
            'Konfirmasi Pembayaran',
            'Apakah Anda yakin ingin melakukan pembayaran?',
            [
                {
                    text: 'Tidak',
                    onPress: () => console.log('Pembayaran dibatalkan'),
                    style: 'cancel',
                },
                {
                    text: 'Ya',
                    onPress: async () => {
                        try {
                            // Ambil user ID dari AsyncStorage
                            let iduser = await AsyncStorage.getItem('userid');
                            if (!iduser) {
                                Alert.alert('Error', 'User ID tidak ditemukan.');
                                return;
                            }

                            // Format tanggal dan jam
                            let tanggal = formatDateToDMY(date);
                            let jam = formattimetodatabase(date);

                            // Data yang akan dikirim ke server
                            const requestData = {
                                nomor_api: nomorapi,
                                nomor_nota: nonota,
                                user_id: iduser,
                                nama_pengirim: namaPengirim,
                                nomor_pengirim: nomorPengirim,
                                alamat_pengiriman: alamatkirim,
                                tanggal_pengiriman: tanggal,
                                jam_pengiriman: jam,
                                Jenisacara: Jenisacara,
                                namaacara: namacara,
                                keterangan: keterangan,
                                biayakirim: biayakirim,
                                totalnota: totalnota,
                            };

                            // Kirim permintaan POST ke server
                            const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=UpdateMenPem', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(requestData),
                            });

                            const hasilkirim = await response.json();

                            if (hasilkirim.Status === "Berhasil") {
                                navigation.goBack()
                            } else {
                                Alert.alert(hasilkirim.Status, hasilkirim.message);
                                navigation.goBack()
                            }
 
                        } catch (error) {
                            console.error('Error:', error);
                            Alert.alert(
                                'Error',
                                'Terjadi kesalahan saat memproses pembayaran.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => navigation.navigate('Beranda'),
                                    },
                                ],
                            );
                        }
                    },
                },
            ]
        );
    } catch (error) {
        console.error('Error:', error);
        Alert.alert(
            'Error',
            'Terjadi kesalahan koneksi.',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Beranda'),
                },
            ],
        );
    }
};

  
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tambah 1 karena bulan dimulai dari 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const datetimedefault = () => {
  const now = new Date();
  const minimumDateTime = new Date(now); // 24 jam dari sekarang
  minimumDateTime.setHours(now.getHours() + 24);
  setDate(minimumDateTime);
  
}

const onChange = (event, selectedDate) => {
  const currentDate = selectedDate || date; // Menggunakan tanggal yang dipilih atau tanggal saat ini

  // Membuat objek Date baru dengan kombinasi tanggal dan waktu yang dipilih
  const combinedDateTime = new Date(date); // pastikan `date` sudah terdefinisi
  if (mode === 'date') {
    combinedDateTime.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    // Jika mode date, tidak perlu melakukan validasi apapun di sini
  } else if (mode === 'time') {
    combinedDateTime.setHours(currentDate.getHours(), currentDate.getMinutes());

    // Hanya lakukan validasi jika memilih waktu
    const now = new Date();
    const minimumDateTime = new Date(now); // 24 jam dari sekarang
    minimumDateTime.setHours(now.getHours() + 24);
    
    // Validasi jika waktu yang dipilih kurang dari 24 jam
    if (combinedDateTime < minimumDateTime) {
      Alert.alert('Waktu pemesanan Harus 24 jam dari sekarang');
      setIsOnkosKirimValid(false);
      Setbuttonfalse('Ganti Tanggal dan Jam Pengiriman');
      return; // Hentikan eksekusi jika validasi gagal
    }else{
      setIsOnkosKirimValid(true);
    }
  }

  setShow(false);
  setDate(combinedDateTime);
  setShow(Platform.OS === 'ios');
};



  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const formatDate = (date) => {

    return date.toLocaleDateString();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  const formattimetodatabase = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
  };

  const formatDateToDMY = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}${month}${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
          <Text style={{textAlign:'center', fontWeight:'bold' , fontSize: 25}}>Nota Pembelian </Text>  
          <View style={styles.produkContainer}>
            <View style={styles.judulBiaya}>
              <Text style={styles.judulText}>Pilihan Menu</Text>
              <Ionicons name="cart" size={20} />
            </View>

            {databarang.map((item, index) => (
              <View key={index} style={styles.produkItem}>
                <Image source={{ uri: `${urlItem}/${item.gambar_menu}` }} style={styles.image} />
                <View style={styles.produkDetail}>
                  <Text style={styles.produkNama}>{item.nama_menu}</Text>
                  <Text style={styles.produkKategori}>{item.nama_kat_menu}</Text>
                  <Text style={styles.produkHarga}>{item.Harga_beli} X {item.jumlah_beli}</Text>
                  <Text style={styles.subTotal}>Subtotal: Rp {formatCurrency(Number(item.total_beli))}</Text>
                </View>
              </View>
             
            ))}

          </View>

          <View style={styles.datapengirimcountainer}>

            <View style={styles.juduldatapengiriman}> 
              <Text style={styles.judulText}>Data Pembeli</Text>
              <Ionicons name="reader" size={20} />
            </View>

            <View style={styles.bottompengiriman}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={kirimsaya}
                    style={styles.checkbox}
                    onValueChange={() => handleKirimke('kesaya')}
                  />
                  <Text style={styles.checkboxLabel}>Kirim ke Saya</Text>
                </View>

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={kirimorang}
                    style={styles.checkbox}
                    onValueChange={() => handleKirimke('keorang')}
                  />
                  <Text style={styles.checkboxLabel}>Kirim ke Orang Lain</Text>
                </View>

            
                {kirimorang && ( 
                <View style={styles.inputdatapengirim}>
                  <Text style={styles.label}>Nama Penerima</Text>
                  <TextInput
                    placeholder="Masukkan Nama Penerima"
                    style={styles.input}
                    onChangeText={setNamaPengirim}
                  />
                  <Text style={styles.label}>Nomor Penerima</Text>
                  <TextInput
                    placeholder="Masukkan Nomor Penerima"
                    style={styles.input}
                    onChangeText={setNomorPengirim}
                    keyboardType="numeric" // Ini mengatur keyboard untuk hanya menampilkan angka
                    maxLength={15} // Batasi jumlah karakter yang bisa dimasukkan (sesuaikan dengan kebutuhan)
                    onKeyPress={({ nativeEvent }) => {
                      // Validasi jika ingin membatasi karakter tertentu
                      if (!/[0-9]/.test(nativeEvent.key)) {
                        // Misalnya, jika ingin hanya mengizinkan angka
                        return false;
                      }
                    }}
                  />
                </View>

                )}
              <View style={styles.timecontainer}>
                <View style={styles.timebutton}>
                  <Text>Tanggal Pengiriman</Text>
                  <Button onPress={() => showMode('date')} title="Pilih tanggal" />
                </View>
                <Text style={{fontSize: 10, color:'gray'}}>Tanggal Terpilih: {formatDate(date)}</Text>
              </View>

              <View style={styles.timecontainer}>
                <View style={styles.timebutton}>
                  <Text>Jam Pengiriman</Text>
                  <Button onPress={() => showMode('time')} title="Pilih Jam" />
                </View>

                <Text style={{fontSize: 10, color:'gray'}} >Jam Terpilih: {formatTime(date)}</Text>
              </View>

                {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default" // Use the default display style based on platform
                      onChange={onChange}
                    />
                  )}

            </View>



          </View>

          <View style={styles.biayaKirimContainer}>
            <View style={styles.judulBiaya}>
              <Text style={styles.judulText}>Lokasi Pengiriman</Text>
              <Image
                    source={require('../../assets/deliveryiconfix.png')}
                    style={styles.icon}
                  />
            </View>

            <View style={styles.mainBiaya}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={isPickup} 
                    style={styles.checkbox}
                    onValueChange={() => handleShippingOptionChange('pickup')}
                  />
                  <Text style={styles.checkboxLabel}>Diambil di Sonokembang</Text>
                </View>

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={isShipping} 
                    style={styles.checkbox}
                    onValueChange={() => handleShippingOptionChange('shipping')}
                  />
                  <Text style={styles.checkboxLabel}>Gunakan Jasa Kirim</Text>
                </View>

                {isShipping &&  kirimorang  ? (
                <View style={styles.pilihLokasi}>
                  <Text style={styles.label}>Provinsi</Text>
                  <SelectList
                    setSelected={(val) => handleSelect(val, 'provinsi')}
                    data={provinsi.map(p => ({ key: p.id_provinsi, value: p.nama_provinsi }))}
                    save="key"
                    placeholder={selectedProvinsi ? selectedProvinsi.nama_provinsi : 'Pilih Provinsi'}
                    boxStyles={styles.selectListBox}
                  />

                  {selectedProvinsi && (
                    <>
                      <Text style={styles.label}>Wilayah</Text>
                      <SelectList
                        setSelected={(val) => handleSelect(val, 'wilayah')}
                        data={wilayah.map(w => ({ key: w.id_wilayah, value: w.nama_wilayah }))}
                        save="key"
                        placeholder={selectedWilayah ? selectedWilayah.nama_wilayah : 'Pilih Wilayah'}
                        disabled={!selectedProvinsi}
                        boxStyles={styles.selectListBox}
                      />

                      {selectedWilayah && (
                        <>
                          <Text style={styles.label}>Kecamatan</Text>
                          <SelectList
                            setSelected={(val) => handleSelect(val, 'kecamatan')}
                            data={kecamatan.map(k => ({ key: k.id_kecamatan, value: k.nama_kecamatan }))}
                            save="key"
                            placeholder={selectedKecamatan ? selectedKecamatan.nama_kecamatan : 'Pilih Kecamatan'}
                            disabled={!selectedWilayah}
                            boxStyles={styles.selectListBox}
                          />

                          {selectedKecamatan && (
                            <>
                              <Text style={styles.label}>Desa</Text>
                              <SelectList
                                setSelected={(val) => handleSelect(val, 'desa')}
                                data={desa.map(d => ({ key: d.id_desa, value: d.nama_desa }))}
                                save="key"
                                placeholder={selectedDesa ? selectedDesa.nama_desa : 'Pilih Desa'}
                                disabled={!selectedKecamatan}
                                boxStyles={styles.selectListBox}
                              />
                                <Text style={styles.label}>Alamat kirim</Text>
                                <TextInput
                                  placeholder="Masukkan Alamat"
                                  style={styles.input}
                                  onChangeText={setAlamatkirim}
                                />
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </View>
                ) :  isShipping && kirimsaya  ? (
                <View style={{ flexDirection : 'column' , borderWidth: 1, borderRadius : 10, padding : 10,}}>    
                  {alamatutama == true ? (
                    <Text style={{ fontSize: 10, color:'gray'}}> Alamat Utama</Text>
                  ) : ( 
                    // Content to display when alamatutama is false
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent:'center'}} onPress={() => navigation.navigate('Buatalamat', { isDelivery: true })}>
                      <Text style={{ fontSize : 10, color: 'gray', textAlign:'center'}}>tekan disini untuk membuat alamat</Text>
                      <View>
                        <Text></Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <Text style={{ fontSize: 12, fontWeight : 'bold' , flexWrap:'wrap',}}>{alamatkirim}</Text>
                </View>
                ) : (
                  <View>

                  </View>
                )}
            </View>
          </View>


          <View style={styles.datapengirimcountainer}>
              <View style={styles.juduldatapengiriman}> 
                <Text style={styles.judulText}>Keperluan Acara</Text>
                <Ionicons name="reader" size={20} />
              </View>

              <View style={styles.bottompengiriman}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      value={isSyukuran}
                      style={styles.checkbox}
                      onValueChange={() => handleacara('syukuran')}
                    />
                    <Text style={styles.checkboxLabel}>Syukuran</Text>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      value={isNikahan}
                      style={styles.checkbox}
                      onValueChange={() => handleacara('nikah')}
                    />
                    <Text style={styles.checkboxLabel}>Akad Nikah</Text>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <Checkbox
                       value={isKantoran}
                      style={styles.checkbox}
                      onValueChange={() => handleacara('kantor')}
                    />
                    <Text style={styles.checkboxLabel}>Acara Kantor</Text>
                  </View>

              </View>
            </View>
              
            <View style={styles.mainBiaya}>
              <View style={styles.totalbiayatop}>
                <Text style={styles.judulText}>Souvenir</Text>
                <Ionicons name="logo-usd" size={20} />
              </View>

            
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={isbelikartu}
                    style={styles.checkbox}
                    onValueChange={Setisbelikartu}
                  />

                    <Text style={styles.checkboxLabel}>Kartu Ucapan</Text>
                </View>
              
                              

                {/* Jika checkbox kartu ucapan dipilih, tampilkan daftar kartu dengan checkbox */}
                {isbelikartu && datakartu.length > 0 && (
                  <View style={styles.kartucountainer}>
                    
                    {/* Pilih Tipe Kartu (di luar map) */}
                      <Text style={{ marginLeft : 20, }}>Kertas Kartu:</Text>

                        <RadioButton.Group
                            onValueChange={value => setSelectedTipe(value)}
                            value={selectedTipe}
                          >

                            <View style={styles.radioContainer}>
                              <RadioButton value="Biasa" />
                              <Text style={{ marginLeft : 10,}}>Biasa</Text>
                            </View>

                            <View style={styles.radioContainer}>
                              <RadioButton value="Premium" />
                              <Text style={{ marginLeft : 10,}}>Premium</Text>
                            </View>

                          </RadioButton.Group>

                      {/* Tampilkan kartu berdasarkan tipe yang dipilih */}
                      {datakartu.map((item, index) => (
                        <View key={index} style={styles.cardItem}>
                          
                          <Checkbox
                            value={selectedCards.some(selected => selected.id_sovenir === item.id_sovenir)}
                            style={styles.checkbox}
                            onValueChange={(isSelected) => handleCardSelect(isSelected, item)}
                          />
                          
                          {/* Detail produk dengan gambar */}
                          <View style={styles.produkItem}>
                            <Image source={{ uri: `${urlkartutas}/${item.gambar_sov}` }} style={styles.image} />
                            <View style={styles.produkDetail}>
                              <Text>{item.nama_sov}</Text>
                              {/* Harga tergantung dari tipe yang dipilih */}
                              <Text>
                                {selectedTipe === 'Premium' 
                                  ? `Harga Premium: Rp ${item.harga_sovpre}` 
                                  : `Harga Biasa: Rp ${item.harga_sov}`}
                              </Text>
                            </View>
                          </View>

                          {/* Input Memo */}
                        </View>
                      ))}

                      {kartuklik && (
                          <TextInput
                            placeholder="Isi memo"
                            style={styles.input}
                            onChangeText={setKeterangan}
                        />
                      )}
                       
                  </View>
                )}




              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={isbelitas}
                  style={styles.checkbox}
                  onValueChange={Setisbelitas}
                />
                <Text style={styles.checkboxLabel}>Tas</Text>
              
              </View>

                {/* Jika checkbox tas dipilih, tampilkan daftar tas */}
                {isbelitas && datatas.length > 0 && (
                  <View style={styles.kartucountainer}>

                    {datatas.map((item, index) => (
                      <View key={index} style={styles.cardItem}>
                        
                        <Checkbox
                          value={selectedTas.some(selected => selected.id_sovenir === item.id_sovenir)}
                          style={styles.checkbox}
                          onValueChange={(isSelected) => handleTasSelect(isSelected, item)}
                        />
                        
                        {/* Detail produk dengan gambar */}
                        <View style={styles.produkItem}>
                          <Image source={{ uri: `${urlkartutas}/${item.gambar_sov}` }} style={styles.image} />
                          <View style={styles.produkDetail}>
                            <Text>{item.nama_sov}</Text>
                            {/* Harga tergantung dari tipe yang dipilih */}
                            <Text>
                                Harga Tas : {item.harga_sov}
                            </Text>
                          </View>
                        </View>

                        {/* Input Memo */}
                      </View>
                    ))}
                  </View>
                )}
            </View>

              

          <View style={styles.totalhargacountainer}> 

            <View style={styles.totalbiayatop}>
              <Text style={styles.judulText}>Rincian Biaya</Text>
              <Text style={styles.judulText}>RP</Text>
            </View>
            
            <View style={styles.totalbiayabottom}>
              <View style={styles.totalbottomrow}>
                  <Text style={{ textAlign: 'left' , width:'50%'}}>Total Keranjang</Text>
                  <Text style={{ textAlign: 'right' , width:'50%'}}> {formatCurrency(totalkeranjang)}</Text>
              </View>
              <View style={styles.totalbottomrow}>
                  <Text style={{ textAlign: 'left' , width:'50%'}} >Harga Souvenir</Text>
                  <Text style={{ textAlign: 'right' , width:'50%'}}> {formatCurrency(Number(biayasouvenir))}</Text>
              </View>
              <View style={styles.totalbottomrow}>
                  <Text style={{ textAlign: 'left' , width:'50%'}} >Ongkos Pengiriman</Text>
                  <Text style={{ textAlign: 'right' , width:'50%'}}> {formatCurrency(Number(biayakirim))}</Text>
              </View>
              <View style={styles.totalbottomrow}>
                  <Text style={{ textAlign: 'left' , width:'50%'}}>Total Belanja</Text>
                  <Text style={{ textAlign: 'right' , width:'50%'}}> {formatCurrency(Number(totalnota))}</Text>
              </View>
            </View>

          </View>


          <TouchableOpacity 
            onPress={bayarnota} 
            style={[styles.buttonbayar, !isOnkosKirimValid && styles.buttonDisabled]}
            disabled={!isOnkosKirimValid}
          >
              <Text style={styles.buttonText}>
                {isOnkosKirimValid ? "Bayar Pembelian" : buttonfasle }
              </Text>  
          </TouchableOpacity>
          
      </View> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  produkContainer: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff',
  },
  produkItem: {
    width: '80%',
    marginBottom: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row', // Gambar dan detail produk diatur berdampingan
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {
        width: 0,
        height: 4,  
    },
    padding: 10,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 14,
  },

  image: {
    width: 100, // Menyesuaikan ukuran gambar
    height: 100,
  },
  produkDetail: {
    flex: 1,
    marginLeft : 10,
    alignItems : 'left',
    justifyContent: 'center',
  },
  produkNama: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  produkKategori: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  produkHarga: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  subTotal: {
    fontSize: 14,
    color: '#666',
  },
  kartucountainer:{
    flexDirection:'column',
    width: '100%',
  },
  cardItem:{
    flexDirection:'row',
    width: '100%',
  },
  biayaKirimContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input:{
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },

  judulBiaya: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  judulText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  mainBiaya: {
    paddingVertical: 10,
  },
  checkbox: {
    margin: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  pilihLokasi: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectListBox: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  totalhargacountainer:{
    flexDirection: 'column',
    padding: 10,
  },
  totalbiayatop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipeKartuContainer:{
    flexDirection: 'column',
  },
  totalbiayabottom: {
    flexDirection: 'column',
  },
  totalbottomrow: {
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  datapengirimcountainer: {
    flexDirection: 'column',
    padding: 10,
  },
  juduldatapengiriman : {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottompengiriman:{
    flexDirection: 'column',
  },
  inputdatapengirim:{
    padding: 10,
    flexDirection:'column',
  },
  timecontainer:{
    flexDirection: 'column',
    padding: 10,
  },
  timebutton:{
    flexDirection:'row',
    justifyContent:'space-between',
  },
  buttonbayar:{
    flexDirection:'row',
    height: 50,
    width:"100%",
    padding:10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'blue',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems:'center',
  }, 
  buttonDisabled: {
    flexDirection:'row',
    height: 50,
    width:"100%",
    padding:10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'gray',
    justifyContent: 'center',
    flexWrap: 'wrap',
    alignItems:'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign:'center',
  },
  buttonTextDisabled: {
    color: 'red',
    fontSize: 16,
    textAlign:'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default PilihLokasi;
