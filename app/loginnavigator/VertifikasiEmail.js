import React, { useState } from 'react';
import { StyleSheet, StatusBar, Text, View, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function VertifikasiEmail({ route }) {
  const { jsonvertifikasi } = route.params;
  const [masukverif, setverif] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dataemail = jsonvertifikasi.email;
  const userid = jsonvertifikasi.user_id;
  const navigation = useNavigation();
  const celvertifikasiemail = async () => {
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=cekvertifikasi', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid : userid,
            email: dataemail,
            idverif: masukverif,
          }),
        });

        const responseJson = await response.json();
        if (!responseJson.message) {
            console.log('Berhasil Aktifasi');
            navigation.navigate('DaftarMember', { jsonvertifikasi: responseJson });
        } else {
          setErrorMessage("Kode Verifikasi Salah");
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Koneksi Buruk tunggu beberapa saat');
      }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={styles.container}>
        <Text style={styles.title}>Verifikasi Email</Text>
        <Text style={styles.message}>Silakan masukkan kode verifikasi yang telah kami kirim ke {dataemail}</Text>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Kode Verifikasi"
          keyboardType="numeric"
          onChangeText={setverif}
        />
        <TouchableOpacity onPress={celvertifikasiemail} style={styles.button}>
          <Text style={styles.buttonText}>Verifikasi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
