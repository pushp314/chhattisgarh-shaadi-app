// CREATE: src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

/**
 * Generic key-value storage (AsyncStorage)
 */

/**
 * Loads a string from AsyncStorage.
 * @param key The key to load.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`[Storage] Error loading string for key: ${key}`, error);
    return null;
  }
}

/**
 * Saves a string to AsyncStorage.
 * @param key The key to save.
 * @param value The string value to save.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[Storage] Error saving string for key: ${key}`, error);
    return false;
  }
}

/**
 * Loads an object from AsyncStorage.
 * @param key The key to load.
 */
export async function loadObject<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (error) {
    console.error(`[Storage] Error loading object for key: ${key}`, error);
    return null;
  }
}

/**
 * Saves an object to AsyncStorage.
 * @param key The key to save.
 * @param value The object to save.
 */
export async function saveObject<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Error saving object for key: ${key}`, error);
    return false;
  }
}

/**
 * Removes an item from AsyncStorage.
 * @param key The key to remove.
 */
export async function remove(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing item for key: ${key}`, error);
    return false;
  }
}

/**
 * Secure Storage (Keychain)
 * Used for storing refresh tokens.
 */
const REFRESH_TOKEN_KEY = 'chhattisgarhShaadiRefreshToken';

/**
 * Saves the refresh token to secure storage.
 * @param token The refresh token.
 */
export async function saveRefreshToken(token: string): Promise<boolean> {
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, token, {
      service: REFRESH_TOKEN_KEY,
    });
    return true;
  } catch (error) {
    console.error('[Storage] Error saving refresh token', error);
    return false;
  }
}

/**
 * Loads the refresh token from secure storage.
 */
export async function loadRefreshToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_KEY,
    });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('[Storage] Error loading refresh token', error);
    return null;
  }
}

/**
 * Removes the refresh token from secure storage.
 */
export async function removeRefreshToken(): Promise<boolean> {
  try {
    await Keychain.resetGenericPassword({
      service: REFRESH_TOKEN_KEY,
    });
    return true;
  } catch (error) {
    console.error('[Storage] Error removing refresh token', error);
    return false;
  }
}