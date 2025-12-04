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
import HomeStack from './stacks/HomeStack.tsx'; // This will be the "Matches" tab
import ActivityStack from './stacks/ActivityStack.tsx';
import MessagesStack from './stacks/MessagesStack.tsx';
import SubscriptionStack from './stacks/SubscriptionStack.tsx';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Icon render functions to avoid creating components during render
const MatchesIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="favorite" size={size} color={color} />
);

const ActivityIcon = ({ color, size }: { color: string; size: number }) => (
  <Icon name="notifications" size={size} color={color} />
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
      initialRouteName="Matches"
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
        name="Matches"
        component={HomeStack}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: MatchesIcon,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityStack}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ActivityIcon,
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
