/**
 * Drawer Navigator
 * Root navigator for authenticated users with Jeevansathi-style sidebar
 */

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from './types';
import MainNavigator from './MainNavigator';
import ProfileStack from './stacks/ProfileStack';
import { Theme } from '../constants/theme';
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false, // Hide the header - HomeScreen has its own
                drawerActiveTintColor: Theme.colors.primary,
                drawerInactiveTintColor: Theme.colors.textSecondary,
                drawerStyle: {
                    backgroundColor: Theme.colors.white,
                    width: '80%', // Take 80% of screen width
                },
                drawerType: 'front',
                swipeEnabled: true,
                swipeEdgeWidth: 100,
            }}>
            <Drawer.Screen
                name="MainTabs"
                component={MainNavigator}
            />
            <Drawer.Screen
                name="ProfileStack"
                component={ProfileStack}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
