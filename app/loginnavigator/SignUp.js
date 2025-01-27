import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Image, Dimensions, SafeAreaView, StatusBar, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import judullogin from '../../assets/buatid.png';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SignUp = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const Buatid = async () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (userEmail === '') {
      setErrorMessage('Masukkan email Anda');
    } else if (!reg.test(userEmail)) {
      setErrorMessage('Email tidak valid');
    } else if (userPassword === '') {
      setErrorMessage('Masukkan Password');
    } else if (userPassword !== confirmPassword) {
      setErrorMessage('Password dan konfirmasi password tidak cocok');
    } else {
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=daftarmember', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userEmail,
            password: userPassword,
          }),
        });

        const responseJson = await response.json();
        if (!responseJson.message) {
          console.log(responseJson);
          
          navigation.navigate('Vertifikasi', { jsonvertifikasi: responseJson });
        } else {
          setErrorMessage(responseJson.message);
        }
      } catch (error) {
        console.log('tidak mau masuk api');
        console.error(error);
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View>
              <Image source={judullogin} style={styles.logo} />
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.inputcontainer}>
              <Ionicons name="mail-outline" size={24} color="#000" style={styles.icon} />
              <TextInput
                placeholder="Masukkan Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setUserEmail}
              />
            </View>

            <View style={styles.inputcontainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#000" style={styles.icon} />
              <TextInput
                placeholder="Masukkan Password"
                style={styles.inputpassword}
                secureTextEntry={!passwordVisible}
                onChangeText={setUserPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#000"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputcontainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#000" style={styles.icon} />
              <TextInput
                placeholder="Konfirmasi Password"
                style={styles.inputpassword}
                secureTextEntry={!confirmPasswordVisible}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                <Ionicons
                  name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#000"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={Buatid} style={styles.button}>
              <Text style={styles.buttonText}>Buat ID</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '70%',
  },
  input: {
    width: '70%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  inputpassword:{
    width: '60%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  button: {
    width: 300,
    height: 50,
    padding: 10,
    backgroundColor: 'white',
    borderColor: '#007BFF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    margin: 10,
  },
  buttonText: {
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    padding: 10,
    margin: 10,
    color: 'red',
    textAlign: 'center',
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default SignUp;
