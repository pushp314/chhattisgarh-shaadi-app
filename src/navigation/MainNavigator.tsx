import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- Type Imports ---
// (Make sure these are in src/navigation/types.ts)
export type MainStackParamList = {
  MainTabs: undefined;
  ChatScreen: {
    profileId: number;
    profileName: string;
    profilePhoto: string;
  };
  ProfileDetail: {
    profileId: number;
  };
  CreateProfile: undefined; // Screen for editing profile
};

export type MainTabParamList = {
  Discover: undefined;
  Matches: undefined;
  Chat: undefined;
  Settings: undefined;
};
// --- End Type Imports ---

import { colors } from '../theme/colors';

// --- Screen Imports ---
import { DiscoverScreen, MatchesScreen } from '../screens/main';
import ConversationsScreen from '../screens/chat/ConversationsScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen'; // Import real component
import { CreateProfileScreen } from '../screens/profile'; // Import profile creation screen

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * 1. The Bottom Tab Navigator
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Discover"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.neutral.gray200,
          backgroundColor: colors.neutral.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💕</Text>,
          tabBarBadge: 3, // Mock badge
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ConversationsScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💬</Text>,
          tabBarBadge: 5, // Mock badge
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen} // Use real component
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * 2. The Main Stack Navigator
 */
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Screen 1: The entire Bottom Tab navigator */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Screen 2: The individual chat screen, which covers the tabs */}
      <Stack.Screen name="ChatScreen" component={ChatScreen} />

      {/* Screen 3: The profile detail screen, which also covers the tabs */}
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />

      {/* --- FIXED: Use render prop to pass 'onComplete' --- */}
      <Stack.Screen name="CreateProfile">
        {props => (
          <CreateProfileScreen
            {...props} // Pass default navigation/route props
            onComplete={() => {
              // When "Edit Profile" is complete, just go back.
              if (props.navigation.canGoBack()) {
                props.navigation.goBack();
              }
            }}
          />
        )}
      </Stack.Screen>
      
    </Stack.Navigator>
  );
};

export default MainNavigator;