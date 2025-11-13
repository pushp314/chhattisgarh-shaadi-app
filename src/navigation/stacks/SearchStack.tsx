/**
 * Search Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParamList } from '../types';

import SearchScreen from '../../screens/search/SearchScreen.tsx';
import SearchResultsScreen from '../../screens/search/SearchResultsScreen.tsx';
import ProfileDetailsScreen from '../../screens/search/ProfileDetailsScreen.tsx';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchStack: React.FC = () => {
  return (
    <Stack.Navigator>
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
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ title: 'Profile Details' }}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;
