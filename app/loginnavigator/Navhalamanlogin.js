import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import SignUp from './SignUp';
import VertifikasiEmail from './VertifikasiEmail';
import Daftarmember from './Datamember';

const Stack = createStackNavigator();

function Navhalamanlogin() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/>
      <Stack.Screen name="SignUp" component={SignUp}  options={{ headerShown: false }}/>
      <Stack.Screen name="Vertifikasi" component={VertifikasiEmail}  options={{ headerShown: false }}/>
      <Stack.Screen name="DaftarMember" component={Daftarmember}  options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
export default Navhalamanlogin;