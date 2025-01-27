import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  namadepan: yup.string().required('Nama depan harus ada'),
  namabelakang: yup.string().required('Nama belakang harus ada'),
  email: yup
    .string()
    .email('Format email tidak valid')
    .required('Email harus ada')
});

const Setauser = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const iduser = await AsyncStorage.getItem('userid');
      if (iduser) {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getdatauser', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: iduser }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const userResult = await response.json();
        if (userResult.length > 0) {
          setValue('namadepan', userResult[0].nama_depan || '');
          setValue('namabelakang', userResult[0].nama_belakang || '');
          setValue('email', userResult[0].email || '');
        } else {
          setErrorMessage('User data not found');
          navigation.navigate('Login');
        }
      } else {
        console.warn('Tidak ada email yang ditemukan di AsyncStorage');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Gagal mengambil info pengguna:', error);
      setErrorMessage('An error occurred while fetching user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigation, setValue]);

  const onSubmit = async (data) => {
    Keyboard.dismiss(); // Dismiss keyboard on form submission
    setLoading(true);
    try {
      const user_id = await AsyncStorage.getItem('userid');
      if (user_id) {
        const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=upprofil', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            namadepan: data.namadepan,
            namabelakang: data.namabelakang,
            email: data.email
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
  
        const result = await response.json();
        if (result.success) {
          navigation.navigate('Settingakunmain' );
        } else {
          setErrorMessage(result.message || 'Failed to update profile');
        }
      } else {
        console.warn('No user ID found in AsyncStorage');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setErrorMessage('An error occurred while updating the profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>

      <Text>Nama Depan</Text>
      <Controller
        control={control}
        name="namadepan"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.namadepan && <Text style={styles.error}>{errors.namadepan.message}</Text>}

      <Text>Nama Belakang</Text>
      <Controller
        control={control}
        name="namabelakang"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.namabelakang && <Text style={styles.error}>{errors.namabelakang.message}</Text>}

      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Update Profile" onPress={handleSubmit(onSubmit)} disabled={loading} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  error: {
    color: 'red',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default Setauser;
