/**
 * Auth Navigator
 * Navigation for authentication screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Import screens
import WelcomeScreen from '../screens/auth/WelcomeScreen.tsx';
import GoogleSignInScreen from '../screens/auth/GoogleSignInScreen.tsx';
import PhoneVerificationScreen from '../screens/auth/PhoneVerificationScreen.tsx';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
