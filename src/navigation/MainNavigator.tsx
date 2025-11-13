/**
 * Main Navigator
 * Bottom tab navigator for authenticated users
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MainTabParamList } from './types';

// Import stack navigators
import HomeStack from './stacks/HomeStack.tsx';
import SearchStack from './stacks/SearchStack.tsx';
import MatchesStack from './stacks/MatchesStack.tsx';
import MessagesStack from './stacks/MessagesStack.tsx';
import ProfileStack from './stacks/ProfileStack.tsx';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Icon render functions to avoid creating components during render
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="home" size={size} color={color} />
);

const SearchIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="search" size={size} color={color} />
);

const MatchesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="favorite" size={size} color={color} />
);

const MessagesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="chat" size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="person" size={size} color={color} />
);

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D81B60',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: SearchIcon,
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesStack}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: MatchesIcon,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStack}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: MessagesIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
