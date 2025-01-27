import { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity , StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Akun from './komakun/AkunStack'; 
import Beranda from './komberanda/BerandaStack'; 
import Pesanan from './komtransaksi/PeananStack';
import Belanja from './komBelanja/BelanjaStack'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

function Apssnav({navigation}) {

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userid');
        if (!userId) {
          await AsyncStorage.setItem('userid', 'Trial');
        }else{
          navigation.navigate('Beranda'); 
        }
      } catch (error) {
        console.error('Error checking userId:', error);
      } finally {
        navigation.navigate('Beranda'); 
      }
    };

    checkUserId();
  }, [navigation]);
  
  return (
        <Tab.Navigator
          initialRouteName="Beranda"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Beranda') {
                iconName = focused ? 'home' : 'home';
              } else if (route.name === 'Produk') {
                iconName = focused ? 'bag-remove' : 'bag-remove';
              } else if (route.name === 'Pesanan') {
                iconName = focused ? 'list' : 'list';
              } else if (route.name === 'Akun') {
                iconName = focused ? 'person' : 'person';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#cb020c',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: styles.tabBar,
            tabBarButton: (props) => {
              const [backgroundColor, setBackgroundColor] = useState('white');

              const handlePress = () => {
                setBackgroundColor('gray'); // Set to gray on press
                setTimeout(() => {
                  setBackgroundColor('white'); // Revert to white after 1 second
                }, 500);
                props.onPress();
              };

              return (
                <TouchableOpacity
                  {...props}
                  onPress={handlePress}
                  style={[
                    props.style,
                    {
                      backgroundColor: backgroundColor, // Dynamic background color
                    },
                  ]}
                />
              );
            },
          })}
        >
      <Tab.Screen name="Beranda" component={Beranda} options={{ headerShown: false }} />
      <Tab.Screen name="Produk" component={Belanja} options={{ headerShown: false }} />
      <Tab.Screen name="Pesanan" component={Pesanan} options={{ headerShown: false }} />
      <Tab.Screen name="Akun" component={Akun} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5, // Untuk Android
    shadowColor: '#000', // Untuk iOS
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 1, // Menambahkan border atas
    borderTopColor: 'gray', // Warna border
    backgroundColor: 'white', // Warna latar belakang tabBar
  },

});

export default Apssnav;
