/**
 * Subscription Stack
 * Stack navigator for subscription related screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SubscriptionPlansScreen from '../../screens/subscription/SubscriptionPlansScreen';
import TransactionHistoryScreen from '../../screens/subscription/TransactionHistoryScreen';
import PaymentScreen from '../../screens/subscription/PaymentScreen';
import { SubscriptionStackParamList } from '../types';

const Stack = createNativeStackNavigator<SubscriptionStackParamList>();

const SubscriptionStack: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
            <Stack.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ headerShown: true, title: 'Payment' }}
            />
            <Stack.Screen
                name="TransactionHistory"
                component={TransactionHistoryScreen}
                options={{ headerShown: true, title: 'Transaction History' }}
            />
        </Stack.Navigator>
    );
};

export default SubscriptionStack;
