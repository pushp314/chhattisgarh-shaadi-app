// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const STORAGE_KEYS = {
  USER: '@user',
  // Tokens are no longer in this list
};

const KEYCHAIN_SERVICE = 'com.chhattisgarhshaadi.app'; // Use your bundle ID

export const StorageService = {
  // --- Secure Token Storage ---
  async saveTokens(accessToken: string, refreshToken: string) {
    try {
      // Store tokens securely
      await Keychain.setGenericPassword(
        accessToken, // Use username field for access token
        refreshToken, // Use password field for refresh token
        { service: KEYCHAIN_SERVICE }
      );
    } catch (error) {
      console.error('Error saving tokens to Keychain:', error);
      throw error;
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
      return credentials ? credentials.username : null; // Access token
    } catch (error) {
      console.error('Error getting access token from Keychain:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
      return credentials ? credentials.password : null; // Refresh token
    } catch (error) {
      console.error('Error getting refresh token from Keychain:', error);
      return null;
    }
  },

  // --- Unsafe User Data Storage ---
  // Note: For PII, this should also be encrypted, but for now...
  async saveUser(user: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Clear all data
  async clearAll() {
    try {
      // Clear secure tokens
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
      // Clear async storage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};