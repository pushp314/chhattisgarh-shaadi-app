/**
 * Main App Component
 * Entry point for the React Native app
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import fcmService from './src/services/fcm.service';
import { ToastProvider } from './src/context/ToastContext';
import { ThemeProvider } from './src/context/ThemeContext';

const App = () => {
  useEffect(() => {
    const initFCM = async () => {
      const hasPermission = await fcmService.requestUserPermission();
      if (hasPermission) {
        await fcmService.registerTokenWithBackend();
        const unsubscribe = fcmService.listenForMessages();
        const unsubscribeToken = fcmService.onTokenRefresh();

        return () => {
          unsubscribe();
          unsubscribeToken();
        };
      }
    };

    initFCM();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
        <AppNavigator />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
