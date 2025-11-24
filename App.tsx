/**
 * Main App Component
 * Entry point for the React Native app
 */

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#D81B60" />
      <AppNavigator />
    </>
  );
};

export default App;
