import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Image, Dimensions, SafeAreaView, StatusBar, Alert, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
export default function Datamember({ route }) {
  const { jsonvertifikasi } = route.params;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleCompleteProfile = async () => {
    try {
      const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=completeProfile', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: jsonvertifikasi.user_id,
          email:jsonvertifikasi.email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          address: address
        }),
      });

      const responseJson = await response.json();
      if (!responseJson.message) {
        console.log('Profile updated successfully');
        console.log(responseJson);
        Alert.alert(
          'Membership berhasil dibuat',
          'Silakan login untuk mencoba',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        console.log("gagal");
        setErrorMessage(responseJson.message);
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
        <Text style={styles.title}>Complete Profile</Text>
        <TextInput
          style={styles.readOnlyInput}
          value={jsonvertifikasi.email}
          editable={false}
        />
        <TextInput
          style={styles.readOnlyInput}
          value={jsonvertifikasi.user_id}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={setAddress}
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity onPress={handleCompleteProfile} style={styles.button}>
          <Text style={styles.buttonText}>Complete Profile</Text>
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
  readOnlyInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
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
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});
