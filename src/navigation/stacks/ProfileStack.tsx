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
import SettingsScreen from '../../screens/settings/SettingsScreen.tsx';
import SubscriptionScreen from '../../screens/profile/SubscriptionScreen.tsx';
import PhotoManagementScreen from '../../screens/profile/PhotoManagementScreen.tsx';
import PartnerPreferencesScreen from '../../screens/profile/PartnerPreferencesScreen.tsx';
import ShortlistScreen from '../../screens/profile/ShortlistScreen.tsx';
import NotificationCenterScreen from '../../screens/notifications/NotificationCenterScreen.tsx';
import WhoViewedMeScreen from '../../screens/profile/WhoViewedMeScreen.tsx';
import ProfileDetailsScreen from '../../screens/profile/ProfileDetailsScreen.tsx';
import BlockedUsersScreen from '../../screens/profile/BlockedUsersScreen.tsx';
import ContactRequestsScreen from '../../screens/profile/ContactRequestsScreen.tsx';
import MatchRequestsScreen from '../../screens/matches/MatchRequestsScreen.tsx';
import PhotoPrivacyScreen from '../../screens/profile/PhotoPrivacyScreen.tsx';
import PhotoRequestsScreen from '../../screens/profile/PhotoRequestsScreen.tsx';
import EducationManagementScreen from '../../screens/profile/EducationManagementScreen.tsx';
import OccupationManagementScreen from '../../screens/profile/OccupationManagementScreen.tsx';
import PrivacyPolicyScreen from '../../screens/legal/PrivacyPolicyScreen.tsx';
import TermsConditionsScreen from '../../screens/legal/TermsConditionsScreen.tsx';

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

    // Phone not verified - this should be handled by AppNavigator, not ProfileStack
    // If we reach here with unverified phone, still show ProfileScreen
    // The AppNavigator should prevent navigation to Main stack if phone not verified

    // Default: show profile screen for authenticated users with profiles
    return 'ProfileScreen';
  };

  // useEffect removed to prevent navigation race conditions. 
  // initialRouteName and AppNavigator handle the logic.

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
        name="PhotoManagement"
        component={PhotoManagementScreen}
        options={{ title: 'Manage Photos' }}
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
      <Stack.Screen
        name="PartnerPreferences"
        component={PartnerPreferencesScreen}
        options={{ title: 'Partner Preferences' }}
      />
      <Stack.Screen
        name="Shortlist"
        component={ShortlistScreen}
        options={{ title: 'My Shortlist' }}
      />
      <Stack.Screen
        name="NotificationCenter"
        component={NotificationCenterScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="WhoViewedMe"
        component={WhoViewedMeScreen}
        options={{ title: 'Who Viewed Me' }}
      />
      <Stack.Screen
        name="ProfileDetails"
        component={ProfileDetailsScreen}
        options={{ title: 'Profile Details' }}
      />
      <Stack.Screen
        name="BlockedUsers"
        component={BlockedUsersScreen}
        options={{ title: 'Blocked Users' }}
      />
      <Stack.Screen
        name="ContactRequests"
        component={ContactRequestsScreen}
        options={{ title: 'Contact Requests' }}
      />
      <Stack.Screen
        name="MatchRequests"
        component={MatchRequestsScreen}
        options={{ title: 'Match Requests' }}
      />
      <Stack.Screen
        name="PhotoPrivacy"
        component={PhotoPrivacyScreen}
        options={{ title: 'Photo Privacy' }}
      />
      <Stack.Screen
        name="PhotoRequests"
        component={PhotoRequestsScreen}
        options={{ title: 'Photo Requests' }}
      />
      <Stack.Screen
        name="EducationManagement"
        component={EducationManagementScreen}
        options={{ title: 'Education Management' }}
      />
      <Stack.Screen
        name="OccupationManagement"
        component={OccupationManagementScreen}
        options={{ title: 'Occupation Management' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <Stack.Screen
        name="TermsConditions"
        component={TermsConditionsScreen}
        options={{ title: 'Terms & Conditions' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
