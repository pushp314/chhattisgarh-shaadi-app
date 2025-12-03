/**
 * App Navigator
 * Root navigation configuration
 */

import React, { useEffect, useRef } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import { RootStackParamList } from './types';
import socketService from '../services/socket.service';
import { ToastProvider } from '../providers/ToastProvider';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  // ... existing hooks
  const { isAuthenticated, loadUserData, isNewUser } = useAuthStore();
  const { fetchProfile, profile } = useProfileStore();
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    // Load persisted user data on app start
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    // Connect socket and handle profile fetching when authenticated
    if (isAuthenticated) {
      // For new users, don't fetch profile - they don't have one yet
      // ProfileStack will handle navigation to CreateProfile
      if (isNewUser) {
        // Just connect socket, skip profile fetch
        socketService.connect().catch(console.error);

        // Navigate to Profile tab -> CreateProfile
        if (navigationRef.current) {
          setTimeout(() => {
            navigationRef.current?.navigate('Main', {
              screen: 'ProfileStack',
              params: {
                screen: 'CreateProfile',
              },
            });
          }, 100);
        }
        return;
      }

      // For existing users, fetch profile to check status
      fetchProfile()
        .then(() => {
          // Profile exists - navigate to Home
          // Skip phone verification check since it's handled during sign-up
          if (navigationRef.current) {
            setTimeout(() => {
              navigationRef.current?.navigate('Main', {
                screen: 'MainTabs',
                params: {
                  screen: 'Home',
                },
              });
            }, 500);
          }
        })
        .catch((error: any) => {
          // If profile doesn't exist (404 or 500), navigate to Profile tab -> CreateProfile
          if (error.response?.status === 404 || error.response?.status === 500) {
            if (navigationRef.current) {
              setTimeout(() => {
                navigationRef.current?.navigate('Main', {
                  screen: 'ProfileStack',
                  params: {
                    screen: 'CreateProfile',
                  },
                });
              }, 500);
            }
          } else {
            // Only log non-404/500 errors
            console.error('Error fetching profile:', error);
          }
        });

      socketService.connect().catch(console.error);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, isNewUser, fetchProfile]);

  return (
    <ToastProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Main" component={DrawerNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
};

export default AppNavigator;
