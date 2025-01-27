import React, { useState , useEffect } from 'react';
import { View, Text, Button, Modal ,TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Navpemesanan from '../komprosespesan/Navpemesanan';
import Riwayattrans from './Alltrans';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

function Detailpesanan({ navigation }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [readStack, setReadStack] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkUserId = async () => {
        const userId = await AsyncStorage.getItem('userid');
        if (userId != null) {
          if (userId === 'Trial') {
            setShowLoginModal(true);
            setReadStack(false);
          } else {
            setShowLoginModal(false);
            setReadStack(true);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Riwayattrans' }],
            });
          }
        } else {
          setShowLoginModal(true);
          setReadStack(false);
        }
      };

      checkUserId();
    }, [navigation])
  );

  const closeModal = () => {
    setShowLoginModal(false);
    navigation.navigate('Beranda');
  };

  const handleLogin = async () => {
    await AsyncStorage.clear();
    setShowLoginModal(false);
    navigation.navigate('Halamanlogin');
  };

  return (
    <React.Fragment>
      <Modal
        visible={showLoginModal}
        transparent={true}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ marginBottom: 20, textAlign: 'center' }}>Anda belum login!</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Tutup" onPress={closeModal} />
              <Button title="Login" onPress={handleLogin} />
            </View>
          </View>
        </View>
      </Modal>

      {readStack && (
        <Stack.Navigator>
          <Stack.Screen 
            name="Riwayattrans" 
            component={Riwayattrans} 
            options={({ navigation }) => ({ 
              title: 'Pesanan Saya',
              headerStyle: {
                backgroundColor: '#fff', 
                elevation: 4, 
                shadowColor: '#000', 
                shadowOffset: { width: 0, height: 2 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 4, 
              },
              headerShown: true,
              headerLeft: () => null,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Navpemesanan')}
                  style={{ marginRight: 10 }}
                >
                  <Ionicons name='cart' size={20} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Navpemesanan"  component={Navpemesanan} options={{headerShown: false} } />
        </Stack.Navigator>
      )}
    </React.Fragment>
  );
}

export default Detailpesanan;
