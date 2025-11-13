/**
 * Home Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';

// Import screens
import HomeScreen from '../../screens/home/HomeScreen.tsx';
import ProfileDetailsScreen from '../../screens/search/ProfileDetailsScreen.tsx';
import SendMatchRequestScreen from '../../screens/matches/SendMatchRequestScreen.tsx';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Chhattisgarh Shaadi' }}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ title: 'Profile Details' }}
      />
      <Stack.Screen
        name="SendMatchRequest"
        component={SendMatchRequestScreen}
        options={{ title: 'Send Match Request' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
