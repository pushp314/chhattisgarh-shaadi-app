/**
 * App Navigator
 * Root navigation configuration
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from './types';
import socketService from '../services/socket.service';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loadUserData } = useAuthStore();
  const { fetchProfile } = useProfileStore();

  useEffect(() => {
    // Load persisted user data on app start
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    // Fetch profile and connect socket when authenticated
    if (isAuthenticated) {
      fetchProfile().catch(console.error);
      socketService.connect().catch(console.error);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, fetchProfile]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
