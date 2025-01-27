import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Cs = () => {
  const [provinsi, setProvinsi] = useState([]);
  const [wilayah, setWilayah] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [desa, setDesa] = useState([]);
  const { nomorapi, nonota } = route.params || {};
  const [ databarnag, setDatabarang] = useState([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState(null);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [selectedDesa, setSelectedDesa] = useState(null);
  const urlItem = 'https://eska.sonokembangmalang.tech/asset';
  const { width, height } = Dimensions.get('window'); // Mendapatkan dimensi layar
  const [showCard, setShowCard] = useState(false); // State untuk mengontrol visibilitas Card
  const [isPickup, setIsPickup] = useState(false); // State untuk opsi diambil di Sonokembang
  const [isShipping, setIsShipping] = useState(false); // State untuk opsi gunakan jasa pengiriman

  // Mengambil data provinsi
  useEffect(() => {
    const fetchkeranjang = async () => {
       try{
          const getkeranjang = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getnotabarangkeranjang' , {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              nonota: nonota
            }),
        });

        const menukeranjang = await getkeranjang.json();
        setDatabarang(menukeranjang);
       }catch{

       }
    }

    const fetchProvinsi = async () => {
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getprovinsi', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        setProvinsi(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Gagal mengambil data provinsi:', error);
      }
    };

    fetchProvinsi();
    fetchkeranjang();
  }, []);

  // Mengambil data wilayah ketika provinsi dipilih
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
            body: JSON.stringify({ id_provinsi: selectedProvinsi.id_provinsi }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }

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

  // Mengambil data kecamatan ketika wilayah dipilih
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
            body: JSON.stringify({ id_wilayah: selectedWilayah.id_wilayah }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }

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

  // Mengambil data desa ketika kecamatan dipilih
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
            body: JSON.stringify({ id_kecamatan: selectedKecamatan.id_kecamatan }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }

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

  // Handler untuk menghapus seleksi
  const handleSelect = (key, type) => {
    switch (type) {
      case 'provinsi':
        setSelectedProvinsi(provinsi.find(p => p.id_provinsi === key) || null);
        setSelectedWilayah(null);
        setSelectedKecamatan(null);
        setSelectedDesa(null);
        setWilayah([]);
        setKecamatan([]);
        setDesa([]);
        break;
      case 'wilayah':
        setSelectedWilayah(wilayah.find(w => w.id_wilayah === key) || null);
        setSelectedKecamatan(null);
        setSelectedDesa(null);
        setKecamatan([]);
        setDesa([]);
        break;
      case 'kecamatan':
        setSelectedKecamatan(kecamatan.find(k => k.id_kecamatan === key) || null);
        setSelectedDesa(null);
        setDesa([]);
        break;
      case 'desa':
        setSelectedDesa(desa.find(d => d.id_desa === key) || null);
        break;
      default:
        break;
    }
  };

  // Handler untuk opsi pengiriman
  const handleShippingOptionChange = (option) => {
    if (option === 'pickup') {
      setIsPickup(true);
      setIsShipping(false);
    } else if (option === 'shipping') {
      setIsPickup(false);
      setIsShipping(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
    
    <Card>
      <Card.Content>
      <View style={styles.produk}>
        
        <View style={styles.produkcontainer}>
        // buatkan  tampilan produk disini dengan gambar di kiri produk  dengan format row gambar (row nama menu dan kategori dan harga)
        <Image source={{ uri: `${baseUrlMenu}/${databarnag.gambar_menu}` }} style={styles.image} />
            
        </View>


      </View>

      <View style={styles.Biayakirim}>
        <View style ={styles.Judulbiaya} >
          <Text style={{fontWeight: 'bold' , fontSize: 20}}>Biaya Pengiriman</Text>
          <Ionicons name="chevron-down-circle-outline" size={20} />
        </View>

        <View style={styles.mainbiaya}>
          <View style={styles.checkboxContainer}>
              <Checkbox
                status={isPickup ? 'checked' : 'unchecked'}
                onPress={() => handleShippingOptionChange('pickup')}
              />
              <Text style={styles.checkboxLabel}>Diambil di Sonokembang</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={isShipping ? 'checked' : 'unchecked'}
                onPress={() => handleShippingOptionChange('shipping')}
              />
              <Text style={styles.checkboxLabel}>Gunakan Jasa Kirim</Text>
            </View>

            {(isShipping) && (
              <View style={styles.PilihLokasi}>
                  <Text style={styles.label}>Provinsi</Text>
                  <SelectList
                    setSelected={(val) => handleSelect(val, 'provinsi')}
                    data={provinsi.map(p => ({ key: p.id_provinsi, value: p.nama_provinsi }))}
                    save="key"
                    placeholder={selectedProvinsi ? selectedProvinsi.nama_provinsi : 'Pilih Provinsi'}
                    boxStyles={styles.selectListBox}
                  />

                  <Text style={styles.label}>Wilayah</Text>
                  <SelectList
                    setSelected={(val) => handleSelect(val, 'wilayah')}
                    data={wilayah.map(w => ({ key: w.id_wilayah, value: w.nama_wilayah }))}
                    save="key"
                    placeholder={selectedWilayah ? selectedWilayah.nama_wilayah : 'Pilih Wilayah'}
                    disabled={!selectedProvinsi} // Disable jika tidak ada provinsi yang dipilih
                    boxStyles={styles.selectListBox}
                  />

                  <Text style={styles.label}>Kecamatan</Text>
                  <SelectList
                    setSelected={(val) => handleSelect(val, 'kecamatan')}
                    data={kecamatan.map(k => ({ key: k.id_kecamatan, value: k.nama_kecamatan }))}
                    save="key"
                    placeholder={selectedKecamatan ? selectedKecamatan.nama_kecamatan : 'Pilih Kecamatan'}
                    disabled={!selectedWilayah} // Disable jika tidak ada wilayah yang dipilih
                    boxStyles={styles.selectListBox}
                  />

                  <Text style={styles.label}>Desa</Text>
                  <SelectList
                    setSelected={(val) => handleSelect(val, 'desa')}
                    data={desa.map(d => ({ key: d.id_desa, value: d.nama_desa }))}
                    save="key"
                    placeholder={selectedDesa ? selectedDesa.nama_desa : 'Pilih Desa'}
                    disabled={!selectedKecamatan} // Disable jika tidak ada kecamatan yang dipilih
                    boxStyles={styles.selectListBox}
                  />
              </View>
            )}
        </View>

        <View styles={styles.footerbiaya}>
            <Text style={{fontSize: 18, fontWeight:'bold' , marginLeft: 10, marginBottom: 10}}>Biaya Pengiriman </Text>
        </View>

      </View>

      </Card.Content>
    </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  card: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  selectListBox: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  Biayakirim : {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'black',
  },
  Judulbiaya : {
    flexDirection : 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderBottomColor: 'blalck',
  },
  mainbiaya : {
    flexDirection : 'colummn',
  },
  footerbiaya : {
    flexDirection : 'row',
    justifyContent: 'space-between',
    borderTopColor: 'black',
    borderWidth: 1,
  },
  PilihLokasi : {
    flexDirection : 'column',
  },
  produk : {
    flexDirection : 'column',

  },

  produkcontainer : {
    flexDirection : 'row',
    padding : 10,
  },
  produk : {
    
  }
});

export default Cs;
