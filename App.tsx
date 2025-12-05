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

import { permissionService } from './src/services/permission.service';
import ErrorBoundary from './src/utils/ErrorBoundary';

const App = () => {
  useEffect(() => {
    const initApp = async () => {
      // 1. Request core permissions (Camera, Gallery, Notifs)
      await permissionService.requestInitialPermissions();

      // 2. Init FCM
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

    initApp();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
          <AppNavigator />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
