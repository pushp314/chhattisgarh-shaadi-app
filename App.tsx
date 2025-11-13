/**
 * Main App Component
 * Entry point for the React Native app
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import authService from './src/services/auth.service';

const App = () => {
  useEffect(() => {
    // Configure Google Sign-In on app start
    authService.configureGoogleSignIn();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
      <AppNavigator />
    </>
  );
};

export default App;
