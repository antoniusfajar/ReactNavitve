  import React, { Component } from 'react';
  import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  export default class Newpin extends Component {
    state = {
      pin: '',
      confirmPin: '',
      isConfirming: false,
    };

    handlePress = (value) => {
      const { pin, confirmPin, isConfirming } = this.state;
      if (isConfirming) {
        if (confirmPin.length < 4) {
          this.setState({ confirmPin: confirmPin + value });
        }
      } else {
        if (pin.length < 4) {
          this.setState({ pin: pin + value });
        }
      }
    };

    handleDelete = () => {
      const { pin, confirmPin, isConfirming } = this.state;
      if (isConfirming) {
        this.setState({ confirmPin: confirmPin.slice(0, -1) });
      } else {
        this.setState({ pin: pin.slice(0, -1) });
      }
    };

    handleOk = async () => {
      const { pin, confirmPin, isConfirming } = this.state;
      if (!isConfirming) {
        if (pin.length === 4) {
          this.setState({ isConfirming: true });
        } else {
          Alert.alert('Error', 'PIN harus terdiri dari 4 digit');
        }
      } else {
        if (pin === confirmPin) {
          try {
            const iduser = await AsyncStorage.getItem('userid');
            if (!iduser) {
              this.props.navigation.navigate('Login');
              return;
            }

            const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=setpin', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userid: iduser,
                pin: pin,
              }),
            });

            console.log(response);
            const result = await response.json();
            console.log(result);

            if (response.ok) {
              Alert.alert('Success', 'PIN berhasil disimpan');
              this.setState({ pin: '', confirmPin: '', isConfirming: false });
              this.props.navigation.navigate('Home');
            } else {
              Alert.alert('Error', result.message || 'Gagal menyimpan PIN');
            }
          } catch (error) {
            Alert.alert('Ada Kesalahan Jaringan', 'Kesalahan jaringan Coba lagi nanti');
          }
        } else {
          Alert.alert('Error', 'PIN tidak cocok');
          this.setState({ confirmPin: '' });
        }
      }
    };

    renderNumberButton = (number) => (
      <TouchableOpacity
        key={number}
        style={styles.numberButton}
        onPress={() => this.handlePress(number.toString())}
      >
        <Text style={styles.numberText}>{number}</Text>
      </TouchableOpacity>
    );

    render() {
      const { pin, confirmPin, isConfirming } = this.state;
      const displayedPin = isConfirming ? confirmPin : pin;

      return (
        <View style={styles.container}>
          <Text style={styles.title}>{isConfirming ? 'Konfirmasi PIN Anda' : 'Masukkan PIN Anda'}</Text>
          <View style={styles.pinContainer}>
            {Array(4)
              .fill()
              .map((_, i) => (
                <View key={i} style={styles.pinBox}>
                  <Text style={styles.pinText}>{displayedPin[i] ? '*' : ''}</Text>
                </View>
              ))}
          </View>
          <View style={styles.numpad}>
            <View style={styles.row}>
              {this.renderNumberButton(1)}
              {this.renderNumberButton(2)}
              {this.renderNumberButton(3)}
            </View>
            <View style={styles.row}>
              {this.renderNumberButton(4)}
              {this.renderNumberButton(5)}
              {this.renderNumberButton(6)}
            </View>
            <View style={styles.row}>
              {this.renderNumberButton(7)}
              {this.renderNumberButton(8)}
              {this.renderNumberButton(9)}
            </View>
            <View style={styles.row}>
              <View style={styles.emptyButton} />
              {this.renderNumberButton(0)}
              <TouchableOpacity style={styles.numberButton} onPress={this.handleDelete}>
                <Text style={styles.numberText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.okButton} onPress={this.handleOk}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 24,
    },
    pinContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 24,
    },
    pinBox: {
      width: 50,
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 5,
    },
    pinText: {
      fontSize: 24,
    },
    numpad: {
      width: '80%',
      justifyContent: 'center',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    numberButton: {
      width: 60,
      height: 60,
      backgroundColor: 'transparent',
      borderColor: 'black',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      margin: 5,
    },
    numberText: {
      color: 'black',
      fontSize: 24,
    },
    emptyButton: {
      width: 60,
      height: 60,
      margin: 5,
    },
    okButton: {
      width: '80%',
      height: 60,
      backgroundColor: '#28A745',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },
    okText: {
      color: '#fff',
      fontSize: 24,
    },
  });
