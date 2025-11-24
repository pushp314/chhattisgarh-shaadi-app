/**
 * API Service
 * Axios instance with interceptors for authentication
 */

import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { ApiResponse } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'userData',
};

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config: any) => {
    const credentials = await Keychain.getGenericPassword({ service: 'accessToken' });
    if (credentials) {
      config.headers.Authorization = `Bearer ${credentials.password}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token expiry
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest: any = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });

        if (!credentials) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<ApiResponse<{
          accessToken: string;
          refreshToken: string;
        }>>(
          `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken: credentials.password }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens (using 'user' as default username if not available, consistent with auth.service)
        await Keychain.setGenericPassword('user', accessToken, { service: 'accessToken' });
        await Keychain.setGenericPassword('user', newRefreshToken, { service: 'refreshToken' });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        await Keychain.resetGenericPassword({ service: 'accessToken' });
        await Keychain.resetGenericPassword({ service: 'refreshToken' });
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Store authentication tokens
 */
export const storeTokens = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  // We use a default username 'user' as we primarily rely on the service key
  await Keychain.setGenericPassword('user', accessToken, { service: 'accessToken' });
  await Keychain.setGenericPassword('user', refreshToken, { service: 'refreshToken' });
};

/**
 * Get stored tokens
 */
export const getTokens = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
}> => {
  try {
    const accessCreds = await Keychain.getGenericPassword({ service: 'accessToken' });
    const refreshCreds = await Keychain.getGenericPassword({ service: 'refreshToken' });

    return {
      accessToken: accessCreds ? accessCreds.password : null,
      refreshToken: refreshCreds ? refreshCreds.password : null,
    };
  } catch (error) {
    console.error('Error getting tokens:', error);
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * Clear all stored data
 */
export const clearStorage = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
  await Keychain.resetGenericPassword({ service: 'refreshToken' });
  await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Store user data
 */
export const storeUserData = async (userData: any): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

/**
 * Get stored user data
 */
export const getUserData = async (): Promise<any | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
};

export default api;
