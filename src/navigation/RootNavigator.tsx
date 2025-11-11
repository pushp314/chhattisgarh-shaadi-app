/* eslint-disable react-native/no-inline-styles */
// CREATE: src/navigation/RootNavigator.tsx
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {useAuthStore} from '../store/auth.store';
import {AuthNavigator} from './AuthNavigator';
import {AppNavigator} from './AppNavigator';
import {useUserService} from '../hooks/useUserService'; // We will create this
import {View} from 'react-native';
import {ActivityIndicator, useTheme} from 'react-native-paper';

const SplashScreen = () => {
  const theme = useTheme();
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background}}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const {status, initializeAuth, user} = useAuthStore(state => ({
    status: state.status,
    initializeAuth: state.initializeAuth,
    user: state.user,
  }));

  const {fetchUser, isLoading} = useUserService();

  useEffect(() => {
    // Check for refresh token on app start
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    // If we are authenticated but have no user data, fetch it.
    if (status === 'authenticated' && !user) {
      fetchUser();
    }
  }, [status, user, fetchUser]);


  if (status === 'idle' || status === 'loading' || (status === 'authenticated' && isLoading)) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {status === 'authenticated' && user ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
      {/* We could also add a check here for `user.profile.isComplete`
        to route to ProfileSetup vs. App.
        
        Example:
        {status === 'authenticated' && user ? (
          user.profile?.isComplete ? (
            <Stack.Screen name="App" component={AppNavigator} />
          ) : (
            <Stack.Screen name="App" component={AppNavigator} initialParams={{ screen: 'ProfileSetup' }} />
          )
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      */}
    </Stack.Navigator>
  );
};