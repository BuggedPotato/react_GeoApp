import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from './components/HomeScreen';
import LocationScreen from './components/LocationScreen';
import MapScreen from './components/MapScreen';

const Stack = createNativeStackNavigator();
const LittleDarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(245, 219, 90)', // yellow yay!
    background: '#202124', // dark theme chrome ¯\_(ツ)_/¯
    card: 'gold',
    text: 'whitesmoke',
    border: 'rgb(28, 28, 30)',
    notification: 'rgb(255, 69, 58)',
  }
};

export default function App() {

  return (
    <NavigationContainer theme={LittleDarkTheme}>
      <Stack.Navigator>
        <Stack.Screen name="home" component={HomeScreen}
        options={{ headerShown: false }} />
        <Stack.Screen name="location" component={LocationScreen}
        options={{ headerTitle: "Zapis pozycji" }} />
        <Stack.Screen name="map" component={MapScreen}
        options={{ headerTitle: "Pozycje na mapie" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
