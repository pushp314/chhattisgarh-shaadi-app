// OVERWRITE: src/navigation/AuthNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackParamList} from './types';

// FIX: Import the real screens
import {LoginScreen} from '../screens/Auth/LoginScreen';

// TODO: Create these screens and uncomment the imports
// import { PhoneLoginScreen } from '../screens/Auth/PhoneLoginScreen';
// import { VerifyOtpScreen } from '../screens/Auth/VerifyOtpScreen';

// FIX: Remove the placeholder declarations
// const LoginScreen = () => null; // <-- Remove this
const PhoneLoginScreen = () => null; // <-- Keep this for now if not created
const VerifyOtpScreen = () => null; // <-- Keep this for now if not created

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
    </Stack.Navigator>
  );
};