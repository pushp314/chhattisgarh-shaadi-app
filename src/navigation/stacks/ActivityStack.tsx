/**
 * Activity Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityStackParamList } from '../types';

import ActivityScreen from '../../screens/activity/ActivityScreen';
import ProfileDetailsScreen from '../../screens/profile/ProfileDetailsScreen';
import ShortlistScreen from '../../screens/profile/ShortlistScreen';
import WhoViewedMeScreen from '../../screens/profile/WhoViewedMeScreen';

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
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Shortlist"
                component={ShortlistScreen}
                options={{
                    title: 'Shortlisted Profiles',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="WhoViewedMe"
                component={WhoViewedMeScreen}
                options={{
                    title: 'Who Viewed Me',
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    );
};

export default ActivityStack;
