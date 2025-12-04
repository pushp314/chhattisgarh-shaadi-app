/**
 * Home Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';

// Import screens
import HomeScreen from '../../screens/home/HomeScreen.tsx';
import ProfileDetailsScreen from '../../screens/profile/ProfileDetailsScreen.tsx';
import SendMatchRequestScreen from '../../screens/matches/SendMatchRequestScreen.tsx';
import SearchScreen from '../../screens/search/SearchScreen.tsx';
import SearchResultsScreen from '../../screens/search/SearchResultsScreen.tsx';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
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
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{ title: 'Search Results' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
