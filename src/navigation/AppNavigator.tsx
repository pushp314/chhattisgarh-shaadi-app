// CREATE: src/navigation/AppNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackParamList} from './types';
import {MainNavigator} from './MainNavigator';

// TODO: Create these screens
const ProfileSetupScreen = () => null;
const ProfileDetailScreen = () => null;
const ChatDetailScreen = () => null;
const PaymentScreen = () => null;
const SettingsScreen = () => null;

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{headerShown: true, title: 'Profile'}}
      />
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={({route}) => ({
          headerShown: true,
          title: route.params.name,
        })}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
};