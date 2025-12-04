/**
 * Activity Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityStackParamList } from '../types';

import ActivityScreen from '../../screens/activity/ActivityScreen';
import ProfileDetailsScreen from '../../screens/profile/ProfileDetailsScreen';
import ChatScreen from '../../screens/messages/ChatScreen';

const Stack = createNativeStackNavigator<ActivityStackParamList>();

const ActivityStack: React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ActivityScreen"
                component={ActivityScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProfileDetails"
                component={ProfileDetailsScreen}
                options={{ title: 'Profile Details' }}
            />
            {/* Add other screens if needed, e.g. Chat if accessed directly from Activity */}
        </Stack.Navigator>
    );
};

export default ActivityStack;
