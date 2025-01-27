import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const Alltrans = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(null); // Default tab
  const [orders, setOrders] = useState([]); // Store orders
  const [statuses, setStatuses] = useState([]); // Store statuses
  const [loading, setLoading] = useState(true);

  

    const fetchData = async () => {
      try {
        const iduser = await AsyncStorage.getItem('userid');
        if (iduser !== 'Trial') {
          const response = await fetch('https://eska.sonokembangmalang.tech/api.php?action=getusertransaksi', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: iduser }),
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
  
          const result = await response.json();
          setStatuses(result.statuses);
          setOrders(result.orders);
          if (result.statuses.length > 0) {
            setActiveTab(result.statuses[0].nama_status); // Set default active tab
          }
        } else {
          navigation.navigate('Beranda');
        }
      } catch (error) {
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

  const loadData = () => {
    setLoading(true);
    fetchData();
  };
  
  useFocusEffect(
    React.useCallback(() => {
        loadData(); // Load data when screen is focused
    }, []) // Make sure to not include any state variables here
  );

  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString().replace(/\./g, ',');
  };
  
  const renderOrders = () => {
    const filteredOrders = orders.filter(order => order.nama_status === activeTab);
    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id_nota_jual.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (item.nama_status == 'DALAM PROSES PENGISIAN') {
                navigation.navigate('Pembayaran', {
                  nonota: item.id_nota_jual,
                  nomorapi: item.nomor_ecount,
                });
              } else if (item.nama_status == 'MENUNGGU PEMBAYARAN') {
                navigation.navigate('Vapembayaran', {
                  nonota: item.id_nota_jual,
                });
              } else {
                navigation.navigate('Pembayaranselesai', {
                  nonota: item.id_nota_jual,
                });
              }
            }}
          >
            <View style={styles.orderItem}>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>ID Nota : </Text>
                <Text style={styles.orderValue}>{item.id_nota_jual}</Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Status:</Text>
                <Text style={styles.orderValue}>{item.nama_status}</Text>
              </View>
              <View style={styles.orderRow}>
                <Text style={styles.orderLabel}>Total Nota:</Text>
                <Text style={styles.orderValue}>{formatCurrency(item.total_nota)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };
  

  if (loading) {
    return (
      <View style={styles.content}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.buttonContainer}>
          {statuses.map(status => (
            <TouchableOpacity
              key={status.status_nota}
              style={[
                styles.tabButton,
                activeTab === status.nama_status && styles.activeTabButton,
              ]}
              onPress={() => handleTabChange(status.nama_status)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === status.nama_status && styles.activeTabButtonText,
                ]}
              >
                {status.nama_status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.contentContainer}>
        {renderOrders()}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flexGrow: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  tabButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
  },
  tabButtonText: {
    color: '#000',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '100%', // Ensure full width for the content container
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    width: '100%', // Ensure full width for the order item
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff', // Optional: Add background color for clarity
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderLabel: {
    fontWeight: 'bold',
  },
  orderValue: {
    flex: 1,
    textAlign: 'right',
  },
});

export default Alltrans;
