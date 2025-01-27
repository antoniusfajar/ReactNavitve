import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

const Pesananselesai = ({ navigation, route }) => {
  const [datapesanan, setDataPesanan] = useState(null); // Ubah menjadi null jika data awal tidak ada
  const { nonota } = route.params || {};
  const urlItem = 'https://eska.sonokembangmalang.tech/asset';
  const [databarang, setDatabarang] = useState([]);
  useEffect(() => {
    getPesananSelesai();
  }, []);

  const getPesananSelesai = async () => {
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getpembayaranselesai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nomor_nota: nonota })
      });

      if (!response.ok) {
        // Cek status respons
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Karena data adalah array, ambil elemen pertama
      if (Array.isArray(data) && data.length > 0) {
        setDataPesanan(data[0]);
        setDatabarang(data);
      } else {
        Alert.alert('No Data', 'Tidak ada data ditemukan untuk nomor nota ini.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil data. ' + error.message);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString().replace(/\./g, ',');
  };

  if (!datapesanan) {
    return <Text>Loading...</Text>; // Menampilkan loading jika data belum ada
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.receiptCard}>
        <View style={styles.header}>
          <Text style={styles.title}>Detail Pembayaran</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.label}>Nomor Nota</Text>
          <Text style={styles.value}>{datapesanan.id_nota_jual}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.label}>Bank Pembayaran</Text>
          <Text style={styles.value}>{datapesanan.id_invoice}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.label}>Nomor Virtual Account</Text>
          <Text style={styles.value}>{datapesanan.link_xendit}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.label}>Total Pembayaran</Text>
          <Text style={styles.value}>Rp {formatCurrency(Number(datapesanan.Totalpembayaran))}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.label}>Tanggal Pembayaran Diterima</Text>
          <Text style={styles.value}>{datapesanan.Tanggalbayar}</Text>
        </View>
  
        <View style={styles.section}>
          <Text style={styles.label}>Barang yang Dibeli:</Text>
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
      </View>
    </ScrollView>
  );  
};

export default Pesananselesai;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Latar belakang untuk keseluruhan layar
  },
  receiptCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', // Garis pemisah antar section
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  produkItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  produkDetail: {
    flex: 1,
    justifyContent: 'center',
  },
  produkNama: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  produkKategori: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  produkHarga: {
    fontSize: 14,
  },
  subTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
});


