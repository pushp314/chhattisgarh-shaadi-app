import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { AuthService } from '../services/auth.service';

export const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await AuthService.getCurrentUser();
    setUser(userData);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AuthService.logout();
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        {user && (
          <>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.info}>User ID: {user.id}</Text>
            <Text style={styles.info}>Role: {user.role}</Text>
            <Text style={styles.info}>
              Phone Verified: {user.isPhoneVerified ? 'Yes' : 'No'}
            </Text>
          </>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  info: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 32,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});