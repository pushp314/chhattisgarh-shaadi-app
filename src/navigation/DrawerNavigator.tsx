/**
 * Drawer Navigator
 * Root navigator for authenticated users, wrapping the bottom tabs
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from './types';
import MainNavigator from './MainNavigator';
import ProfileStack from './stacks/ProfileStack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator<DrawerParamList>();

// Custom header component
const DrawerHeader = () => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text variant="headlineSmall" style={styles.headerTitle}>
                    Chhattisgarh Shaadi
                </Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity
                    onPress={() => navigation.toggleDrawer()}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                >
                    <Icon name="menu" size={28} color={Theme.colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const DrawerNavigator: React.FC = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: true,
                header: () => <DrawerHeader />,
                drawerActiveTintColor: Theme.colors.primary,
                drawerInactiveTintColor: Theme.colors.textSecondary,
                drawerLabelStyle: {
                    marginLeft: -20,
                    fontSize: 16,
                },
                drawerStyle: {
                    backgroundColor: Theme.colors.white,
                    width: 280,
                },
            }}>
            <Drawer.Screen
                name="MainTabs"
                component={MainNavigator}
                options={{
                    drawerLabel: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="home" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    drawerLabel: 'My Profile',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="account" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50, // Account for status bar
        backgroundColor: Theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.surfaceCard,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: Theme.colors.primary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
    },
});

export default DrawerNavigator;
