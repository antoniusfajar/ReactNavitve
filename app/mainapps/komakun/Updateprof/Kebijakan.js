import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Kebijakan extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>

          <Text style={styles.subHeader}>1. Pendahuluan</Text>
          <Text style={styles.text}>
            Selamat datang di Sonokembang Membership. Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi informasi data pribadi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda sebagai anggota (user membership) dari platform kami.
          </Text>

          <Text style={styles.subHeader}>2. Informasi yang Kami Kumpulkan</Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Informasi Pendaftaran :</Text> Nama, alamat email, nomor telepon, alamat, dan informasi identitas lainnya yang diperlukan saat mendaftar sebagai anggota.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Informasi Pembayaran :</Text> Informasi terkait dengan pembayaran yang telah Anda lakukan di Sonokembang.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Informasi Penggunaan :</Text> Data mengenai bagaimana Anda menggunakan platform kami, termasuk halaman yang Anda kunjungi, waktu akses, dan interaksi dengan konten.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Data Teknis :</Text> Alamat IP, jenis perangkat, versi sistem operasi, dan data teknis lainnya yang terkait dengan penggunaan platform.
          </Text>

          <Text style={styles.subHeader}>3. Penggunaan Informasi</Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Pemrosesan Keanggotaan :</Text> Untuk memproses pendaftaran, memverifikasi identitas Anda, dan mengelola akun keanggotaan Anda.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Pembayaran :</Text> Untuk memproses pembayaran dan transaksi yang telah Anda lakukan.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Personalisasi :</Text> Untuk menyediakan konten yang disesuaikan dengan preferensi dan minat Anda.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Komunikasi :</Text> Untuk menghubungi Anda mengenai pembaruan, pemberitahuan penting, dan penawaran khusus terkait keanggotaan.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Peningkatan Layanan :</Text> Untuk menganalisis data dan meningkatkan fungsi dan fitur platform kami.
          </Text>

          <Text style={styles.subHeader}>4. Penyimpanan dan Keamanan Data</Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Penyimpanan :</Text> Data Anda disimpan di server kami yang berlokasi di [lokasi penyimpanan] dan akan disimpan selama akun Anda aktif atau selama diperlukan untuk memenuhi tujuan pengumpulan data.
          </Text>
          <Text style={styles.text}>
            -&nbsp;<Text style={styles.bold}>Keamanan&nbsp;:</Text>&nbsp;Kami menerapkan langkah - langkah keamanan yang ketat, termasuk enkripsi data dan kontrol akses, untuk melindungi informasi data pribadi Anda dari akses yang tidak sah, pengungkapan, atau perubahan.
          </Text>

          <Text style={styles.subHeader}>5. Pembagian Informasi</Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Pihak Ketiga :</Text> Kami dapat membagikan data Anda dengan penyedia layanan pihak ketiga yang membantu kami dalam menjalankan platform, seperti pemrosesan pembayaran, analitik, dan layanan pemasaran, namun hanya sebatas yang diperlukan untuk menyediakan layanan tersebut.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Kepatuhan Hukum :</Text> Kami dapat mengungkapkan informasi pribadi Anda jika diwajibkan oleh hukum atau sebagai respons terhadap permintaan yang sah dari otoritas penegak hukum.
          </Text>

          <Text style={styles.subHeader}>6. Hak Pengguna</Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Akses dan Koreksi :</Text> Anda memiliki hak untuk mengakses dan mengoreksi informasi pribadi yang kami miliki tentang Anda. Anda dapat melakukannya melalui pengaturan akun Anda atau dengan menghubungi kami di [alamat email kontak].
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Penghapusan Data :</Text> Anda dapat meminta penghapusan data pribadi Anda kapan saja, kecuali jika kami diwajibkan oleh hukum untuk menyimpannya.
          </Text>
          <Text style={styles.text}>
            - <Text style={styles.bold}>Penarikan Persetujuan :</Text> Anda dapat menarik persetujuan Anda terhadap pemrosesan data pribadi Anda kapan saja, yang mungkin mempengaruhi akses Anda ke beberapa layanan atau fitur platform.
          </Text>

          <Text style={styles.subHeader}>7. Perubahan Kebijakan</Text>
          <Text style={styles.text}>
            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diberitahukan kepada Anda melalui email atau pemberitahuan di platform kami. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
          </Text>

          <Text style={styles.subHeader}>8. Hubungi Kami</Text>
          <Text style={styles.text}>
            Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan privasi ini, silakan hubungi kami di :
          </Text>
          <Text style={styles.text}>
            [Sonokembang Malang]{'\n'}
            [sonokembangmalang@gmail.com]{'\n'}
          </Text>
        </ScrollView>
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
  },
  scrollView: {
    marginHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10, // Add margin bottom to create space between text blocks
  },
  bold: {
    fontWeight: 'bold',
  },
});
