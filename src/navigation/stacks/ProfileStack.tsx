/**
 * Profile Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types';

import ProfileScreen from '../../screens/profile/ProfileScreen.tsx';
import EditProfileScreen from '../../screens/profile/EditProfileScreen.tsx';
import CreateProfileScreen from '../../screens/profile/CreateProfileScreen.tsx';
import SettingsScreen from '../../screens/profile/SettingsScreen.tsx';
import SubscriptionScreen from '../../screens/profile/SubscriptionScreen.tsx';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={{ title: 'Create Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{ title: 'Subscription' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
