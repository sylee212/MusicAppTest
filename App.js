import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './StackNavigator';

export default function App() {
  return (
    <Navigation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// TO build the app from eas.json
// preview is the build command, like npm run coolVersion1
//    eas build -p android --profile preview
// to run the app from the build
//    eas build:run -p android