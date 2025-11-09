import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // ✅ DEVELOPER MODE - Set to true during development
  const DEV_MODE = true; // ✅ Change to false for production
  const [showDevMenu, setShowDevMenu] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthComplete = () => {
    console.log('✅ Auth Complete - Moving to Profile Creation');
    setIsAuthenticated(true);
  };

  const handleProfileComplete = () => {
    console.log('✅ Profile Complete - Moving to Main App');
    setHasProfile(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth">
              {(props) => <AuthNavigator {...props} onAuthComplete={handleAuthComplete} />}
            </Stack.Screen>
          ) : !hasProfile ? (
            <Stack.Screen name="Profile">
              {(props) => <ProfileNavigator {...props} onProfileComplete={handleProfileComplete} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>

      {/* Developer Menu */}
      {DEV_MODE && (
        <>
          <TouchableOpacity
            style={styles.devToggle}
            onPress={() => setShowDevMenu(!showDevMenu)}>
            <Text style={styles.devToggleText}>🛠️</Text>
          </TouchableOpacity>

          {showDevMenu && (
            <View style={styles.devMenu}>
              <Text style={styles.devMenuTitle}>Developer Menu</Text>
              
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => {
                  setIsAuthenticated(false);
                  setHasProfile(false);
                  setShowDevMenu(false);
                }}>
                <Text style={styles.devButtonText}>🔐 Auth Flow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.devButton}
                onPress={() => {
                  setIsAuthenticated(true);
                  setHasProfile(false);
                  setShowDevMenu(false);
                }}>
                <Text style={styles.devButtonText}>📝 Profile Creation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.devButton}
                onPress={() => {
                  setIsAuthenticated(true);
                  setHasProfile(true);
                  setShowDevMenu(false);
                }}>
                <Text style={styles.devButtonText}>🏠 Home Screen</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.devButton, styles.devButtonClose]}
                onPress={() => setShowDevMenu(false)}>
                <Text style={styles.devButtonText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  devToggle: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  devToggleText: {
    fontSize: 24,
  },
  devMenu: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    width: 220,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  devMenuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: colors.primary.lighter,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  devButtonClose: {
    backgroundColor: colors.neutral.gray200,
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
});

export default RootNavigator;