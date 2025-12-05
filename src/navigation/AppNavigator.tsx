/**
 * App Navigator
 * Root navigation configuration
 */

import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import { RootStackParamList } from './types';
import socketService from '../services/socket.service';
import { ToastProvider } from '../providers/ToastProvider';
import { Theme } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loadUserData, isNewUser } = useAuthStore();
  const { fetchProfile, profile } = useProfileStore();
  const navigationRef = useRef<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Load persisted user data on app start
    const initializeAuth = async () => {
      try {
        await loadUserData();
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        // Small delay to ensure Zustand hydration is complete
        setTimeout(() => {
          setIsInitializing(false);
        }, 300);
      }
    };

    initializeAuth();
  }, [loadUserData]);

  useEffect(() => {
    // Don't connect socket or fetch profile until initialization is complete
    if (isInitializing) return;

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

      // For existing users, fetch profile and subscription
      const initData = async () => {
        try {
          // Define profile fetch with specific error handling for 404 (New User)
          const profilePromise = fetchProfile().catch((error: any) => {
            if (error.response?.status === 404 || error.response?.status === 500) {
              // Redirect to Create Profile
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
              return null; // Resolve as null so Promise.all completes
            }
            throw error;
          });

          // Fetch subscription silently (don't block UI on error)
          const subPromise = useSubscriptionStore.getState().fetchSubscription()
            .catch(err => console.error('Subscription fetch init error:', err));

          // Run in parallel
          await Promise.all([profilePromise, subPromise]);

          // Check if profile exists after fetch
          const currentProfile = useProfileStore.getState().profile;
          if (currentProfile) {
            // Profile exists - navigate to Home
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
          }
        } catch (error) {
          console.error('Error initializing app data:', error);
        }
      };

      initData();
      socketService.connect().catch(console.error);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated, isNewUser, fetchProfile, isInitializing]);

  // Show loading screen while checking stored tokens
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
});

export default AppNavigator;

