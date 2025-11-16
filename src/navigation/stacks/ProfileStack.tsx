/**
 * Profile Stack Navigator
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from '../types';
import { useProfileStore } from '../../store/profileStore';
import { useAuthStore } from '../../store/authStore';

import ProfileScreen from '../../screens/profile/ProfileScreen.tsx';
import EditProfileScreen from '../../screens/profile/EditProfileScreen.tsx';
import CreateProfileScreen from '../../screens/profile/CreateProfileScreen.tsx';
import PhoneVerificationScreen from '../../screens/auth/PhoneVerificationScreen.tsx';
import SettingsScreen from '../../screens/profile/SettingsScreen.tsx';
import SubscriptionScreen from '../../screens/profile/SubscriptionScreen.tsx';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, fetchProfile } = useProfileStore();
  const { isAuthenticated, isNewUser, user } = useAuthStore();

  // Determine initial route based on user state
  const getInitialRouteName = (): keyof ProfileStackParamList => {
    if (!isAuthenticated) return 'ProfileScreen';
    
    // New users should start at CreateProfile
    if (isNewUser) return 'CreateProfile';
    
    // If no profile exists, go to CreateProfile
    if (!profile) return 'CreateProfile';
    
    // If profile exists but phone not verified, go to PhoneVerification
    if (!user?.isPhoneVerified) return 'PhoneVerification';
    
    // Otherwise, show profile screen
    return 'ProfileScreen';
  };

  useEffect(() => {
    // Check if user needs to create profile (for cases where state changes)
    if (isAuthenticated) {
      // For existing users, check profile and phone verification
      if (!isNewUser) {
        const checkProfileAndNavigate = async () => {
          try {
            await fetchProfile();
            // Profile exists - check if phone verification is needed
            const currentUser = useAuthStore.getState().user;
            if (!currentUser?.isPhoneVerified) {
              setTimeout(() => {
                navigation.navigate('PhoneVerification');
              }, 300);
            }
          } catch (error: any) {
            // If profile doesn't exist (404), navigate to CreateProfile
            if (error.response?.status === 404) {
              setTimeout(() => {
                navigation.navigate('CreateProfile');
              }, 300);
            }
          }
        };
        
        checkProfileAndNavigate();
      }
    }
  }, [isAuthenticated, isNewUser, fetchProfile, navigation]);

  return (
    <Stack.Navigator initialRouteName={getInitialRouteName()}>
      <Stack.Screen
        name="CreateProfile"
        component={CreateProfileScreen}
        options={{ title: 'Create Profile', headerShown: false }}
      />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{ title: 'Verify Phone', headerShown: false }}
      />
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
