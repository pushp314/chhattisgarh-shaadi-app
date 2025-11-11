// OVERWRITE: src/navigation/MainNavigator.tsx
import React from 'react';
// FIX: Corrected typo in package name
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabsParamList} from './types';
import {useTheme} from 'react-native-paper';
// FIX: This import should be correct if you've installed react-native-vector-icons
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// TODO: Create these screens
const DiscoverScreen = () => null;
const MatchesScreen = () => null;
const MessagesScreen = () => null;
const MeScreen = () => null;

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Define icon render functions with proper types to satisfy linter
const renderDiscoverIcon = ({color, size}: {color: string; size: number}) => (
  <Icon name="compass" color={color} size={size} />
);

const renderMatchesIcon = ({color, size}: {color: string; size: number}) => (
  <Icon name="heart-multiple" color={color} size={size} />
);

const renderMessagesIcon = ({color, size}: {color: string; size: number}) => (
  <Icon name="message-text" color={color} size={size} />
);

const renderMeIcon = ({color, size}: {color: string; size: number}) => (
  <Icon name="account-circle" color={color} size={size} />
);

export const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
      }}>
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: renderDiscoverIcon, // Use stable function
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: renderMatchesIcon, // Use stable function
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: renderMessagesIcon, // Use stable function
          // TODO: Add badge from /api/messages/unread-count
          // tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Me"
        component={MeScreen}
        options={{
          tabBarIcon: renderMeIcon, // Use stable function
        }}
      />
    </Tab.Navigator>
  );
};