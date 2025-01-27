import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, StatusBar, Text, View, TouchableOpacity, TextInput, Keyboard, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import judullogin from '../../assets/judullogin.png';
import googlelogo from '../../assets/google.png';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const ANDROID_CLIENT_ID='467549949319-rdra0dh1k2g6oqp7v4b819bif3gv24ve.apps.googleusercontent.com';
  const IOS_CLIENT_ID='467549949319-74hgookbj9u13ofsd7gom9bfmc81vq1r.apps.googleusercontent.com';
  const WEB_CLIENT_ID='467549949319-hid6frhhnfqd9qb6aboa2jbn62r30ra9.apps.googleusercontent.com';
  const navigation = useNavigation();
  const googleauth = {
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
  };
  const [request, responsegoogle, promptAsync] = Google.useAuthRequest(googleauth);

  const loginbiasa = async () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (userEmail === '') {
      setErrorMessage('Masukkan email Anda');
    } else if (!reg.test(userEmail)) {
      setErrorMessage('Email tidak valid');
    } else if (userPassword === '') {
      setErrorMessage('Masukkan Password');
    } else {
      try {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=masuksystem', {
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
        console.log(responseJson);

        if (!responseJson.message) {
          await AsyncStorage.setItem('userid', responseJson.user_id);
          if (responseJson.pinuser == null) {
            navigation.navigate('newpins');
          } else {
            AsyncStorage.setItem('userid', responseJson.user_id);
            navigation.navigate('Home');
          }
        } else {
          setErrorMessage(responseJson.message);
          console.log('salah di api kirim');
        }
      } catch (error) {
        console.log('tidak mau masuk api');
        console.error(error);
        setErrorMessage('An error occurred. Please try again later.');
      }
    }

    Keyboard.dismiss();
  };

  const buatidi = () => {
    navigation.navigate('SignUp');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const signInWithGoogle = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");
      if (userJSON) {
        setUserInfo(JSON.parse(userJSON));
      } else if (responsegoogle?.type === "success") {
        const token = responsegoogle.authentication.accessToken;
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
        const usergoogle = await response.json();
        const cekemailgoogle = usergoogle.email;
        console.log(cekemailgoogle);
    /*    try{
          const response = await fetch('https://skmeme.sonokembangmalang.tech/api.php?action=cekgoogleemail', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: cekemailgoogle,
            }),
          });
        }catch (error){

        }
      */
      }
    } catch (error) {
      console.error("Error retrieving user data from AsyncStorage:", error);
    }
  };

  const cekuseremailgoogle = async () => {

  };

  useEffect(() => {
    signInWithGoogle();
  }, [responsegoogle]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.kontainergambar}>
          <Image source={judullogin} style={styles.logo} />
        </View>

        <KeyboardAvoidingView style={styles.containerlogin}>
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
              style={styles.input}
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
          <TouchableOpacity onPress={loginbiasa} style={styles.button}>
            <Text style={styles.buttonText}>Login Membership</Text>
          </TouchableOpacity>

          <View style={styles.manualsignin}>
            <Text>Belum Punya Akun ? </Text><Text style={styles.linkText} onPress={buatidi}>Buat ID Disini !</Text>
          </View>

        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  kontainergambar: {
    height: '50%',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  containerlogin: {
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'column',
  },
  inputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '70%',
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  button: {
    width: 300,
    height: 50,
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 100,
    margin: 10,
  },
  buttongoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: 10,
    borderRadius: 100,
  },
  googleIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: 10,
  },
  buttonTextgoogle: {
    color: '#757575',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#757575',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    padding: 10,
    margin: 10,
    color: 'red',
    textAlign: 'center',
  },
  signupContainer: {
    marginTop: 20,
  },
  signupText: {
    color: '#007BFF',
    fontSize: 16,
    textAlign: 'center',
  },
  manualsignin : {
    flexDirection : 'row',
    marginTop : 2,
  },
  linkText: {
    color: 'blue', // Warna teks tautan
    textDecorationLine: 'underline', // Membuat tautan memiliki garis bawah
  },
});
