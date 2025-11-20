/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import DeviceInfo from 'react-native-device-info';
import apiClient from '../config/api.config';
import { useAuthStore } from '../store/authStore';

// Helper to get device info
const getDeviceInfo = async () => {
  return {
    deviceId: await DeviceInfo.getUniqueId(),
    platform: Platform.OS,
  };
};

// Main Authentication Service
const authService = {
  /**
   * Configures the Google Sign-In SDK.
   * This should be called once at app startup.
   */
  configureGoogleSignIn: () => {
    GoogleSignin.configure({
      webClientId: '250704044564-r7usqdp7hrfotfjug73rph9qpuetvh1e.apps.googleusercontent.com', // From Google Cloud Console
      offlineAccess: false, // Set to false, we are not requesting an auth code
    });
  },

  /**
   * Signs the user in with Google.
   * 1. Gets the idToken from Google Sign-In SDK.
   * 2. Posts the idToken and deviceInfo to the backend.
   * 3. Securely stores the received access and refresh tokens.
   * @param agentCode - Optional tracking code for agent-assisted sign-ups.
   */
  signInWithGoogle: async (agentCode?: string) => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      if (!idToken) {
        throw new Error('Google Sign-In failed: idToken was null.');
      }

      const deviceInfo = await getDeviceInfo();

      // Construct the request body
      const requestBody: {
        idToken: string;
        deviceInfo: { deviceId: string; platform: string };
        agentCode?: string;
      } = {
        idToken,
        deviceInfo,
      };

      if (agentCode) {
        requestBody.agentCode = agentCode;
      }

      // Make the API call to your backend
      const { data } = await apiClient.post('/auth/google', requestBody);
      const responseData = data.data; // Assuming the API response is nested under `data`

      // On success, store tokens and update state
      const { accessToken, refreshToken, user } = responseData;
      
      // Store both tokens securely
      await Keychain.setGenericPassword(user.id || 'user', accessToken, { service: 'accessToken' });
      await Keychain.setGenericPassword(user.id || 'user', refreshToken, { service: 'refreshToken' });
      
      // Update Zustand store
      useAuthStore.getState().setUser(user);
      useAuth-store.getState().setAuthenticated(true);
      
      return { user, isNewUser: responseData.isNewUser || false };

    } catch (error: any) {
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign in is in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.error('Play services not available or outdated');
            break;
          default:
            console.error('Google Sign-In error:', error);
        }
      } else {
        // Handle Axios errors or other exceptions
        console.error('API call failed:', error.response?.data || error.message);
      }
      // Log out from Google to allow retrying
      await GoogleSignin.signOut();
      throw error; // Re-throw the error to be handled by the caller
    }
  },

  /**
   * Logs the user out.
   * 1. Calls the backend logout endpoint.
   * 2. Clears tokens from Keychain.
   * 3. Resets the auth store.
   * 4. Signs out from Google SDK.
   */
  logout: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
      if (credentials) {
        await apiClient.post('/auth/logout', { refreshToken: credentials.password });
      }
    } catch (error: any) {
      console.error('Backend logout failed:', error.response?.data || error.message);
    } finally {
      // Always clear local session
      await Keychain.resetGenericPassword({ service: 'accessToken' });
      await Keychain.resetGenericPassword({ service: 'refreshToken' });
      useAuthStore.getState().logout();
      await GoogleSignin.signOut();
    }
  },
};

export default authService;
