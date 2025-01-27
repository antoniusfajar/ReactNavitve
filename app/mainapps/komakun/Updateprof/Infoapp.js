import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import logomembership from '../../../../assets/logomembership.png';

export default class Infoapp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logocontainer}>
          <View style={styles.cardlogo}>
            <Image source={logomembership} style={styles.logosk} />
          </View>
          <Text style={styles.versitext}>Sonokembang Membership V 1.0</Text>
        </View>
        <View style={styles.sisacontainer}>
          <Text style={styles.paragraph}>
            {'\t'} Sonokembang membership merupakan sebuah aplikasi yang dibuat guna mempermudah pelanggan 
            Sonokembang Malang dalam melihat status transaksi yang telah dilakukan oleh pelanggan dan juga 
            memberikan apresiasi berupa bonus point member dan point referal dimana pelanggan bisa menukarkan 
            point tersebut untuk keperluan memotong jumlah tagihan yang akan diberikan user jika menggunakan jasa 
            pembelian di Sonokembang Malang.
          </Text>
        </View>
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
    flexDirection: 'column',
    padding: 20,
  },
  logocontainer: {
    flexDirection: 'column',
    width: '100%',
    height: '30%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardlogo: {
    width: '60%',
    height: '60%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b0000',
    marginBottom: 10,
  },
  logosk: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  versitext: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  sisacontainer: {
    width: '100%',
    height: '70%',
    flexDirection: 'column',
    padding: 20,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
    marginTop: 20,
    lineHeight: 20,
  },
});
