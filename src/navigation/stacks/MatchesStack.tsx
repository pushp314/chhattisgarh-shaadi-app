/**
 * Matches Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MatchesStackParamList } from '../types';

import MatchesScreen from '../../screens/matches/MatchesScreen.tsx';
import MatchDetailsScreen from '../../screens/matches/MatchDetailsScreen.tsx';
import ProfileDetailsScreen from '../../screens/search/ProfileDetailsScreen.tsx';

const Stack = createNativeStackNavigator<MatchesStackParamList>();

const MatchesStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MatchesScreen"
        component={MatchesScreen}
        options={{ title: 'Matches' }}
      />
      <Stack.Screen
        name="MatchDetails"
        component={MatchDetailsScreen}
        options={{ title: 'Match Details' }}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ title: 'Profile Details' }}
      />
    </Stack.Navigator>
  );
};

export default MatchesStack;
