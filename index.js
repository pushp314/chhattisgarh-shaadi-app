/**
 * @format
 */

import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import { name as appName } from './app.json';
import App from './App';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Set up background message handler BEFORE app registration
// This must be at the top level, outside any component
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background FCM message received:', remoteMessage);
  // You can store the notification or update badge count here
});

export default function Main() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => Main);