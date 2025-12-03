/**
 * Main Navigator
 * Bottom tab navigator for authenticated users
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MainTabParamList } from './types';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';

// Import stack navigators
import HomeStack from './stacks/HomeStack.tsx';
import SearchStack from './stacks/SearchStack.tsx';
import MatchesStack from './stacks/MatchesStack.tsx';
import MessagesStack from './stacks/MessagesStack.tsx';
import SubscriptionStack from './stacks/SubscriptionStack.tsx';

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

const SubscriptionIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="card-membership" size={size} color={color} />
);

const MainNavigator: React.FC = () => {
  const { isNewUser } = useAuthStore();
  const { profile } = useProfileStore();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E7383F', // Love Red
        tabBarInactiveTintColor: '#ADA5A4', // Secondary text
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

          // Hide tab bar on CreateProfile screen within the ProfileStack
          if (routeName === 'CreateProfile') {
            return { display: 'none' };
          }

          return {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            backgroundColor: '#FFFFFF',
            borderTopColor: '#F9DFC0', // Pastel Peach
          };
        })(route),
      })}
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
        name="Subscription"
        component={SubscriptionStack}
        options={{
          tabBarLabel: 'Premium',
          tabBarIcon: SubscriptionIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
