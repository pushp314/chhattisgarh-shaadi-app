/**
 * Authentication Service
 * Handles all authentication-related API calls using InAppBrowser for OAuth
 */
import { Platform, Linking } from 'react-native';
import * as Keychain from 'react-native-keychain';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import DeviceInfo from 'react-native-device-info';
import apiClient from '../config/api.config';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS } from '../config/api.config';

const API_BASE_URL = 'https://chhattisgarhshadi-backend.onrender.com/api/v1';
const GOOGLE_CLIENT_ID = '250704044564-r7usqdp7hrfotfjug73rph9qpuetvh1e.apps.googleusercontent.com';
// Use the backend callback URL (already authorized in Google Console)
const BACKEND_CALLBACK_URL = 'https://chhattisgarhshadi-backend.onrender.com/api/v1/auth/google/callback';

// Helper to get device info
const getDeviceInfo = async () => {
  return {
    deviceId: await DeviceInfo.getUniqueId(),
    deviceName: await DeviceInfo.getDeviceName(),
    deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    userAgent: await DeviceInfo.getUserAgent(),
  };
};

// Main Authentication Service
const authService = {
  /**
   * Signs the user in with Google using InAppBrowser
   * Flow: Google -> Backend Callback -> App Deep Link with tokens
   * @param agentCode - Optional tracking code for agent-assisted sign-ups
   */
  signInWithGoogle: async (agentCode?: string) => {
    try {
      // Get device info
      const deviceInfo = await getDeviceInfo();
      const deviceInfoParam = encodeURIComponent(JSON.stringify(deviceInfo));
      const agentParam = agentCode ? `&agentCode=${encodeURIComponent(agentCode)}` : '';

      // Construct the Google OAuth URL
      // The backend will handle the callback and redirect to our app
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(BACKEND_CALLBACK_URL)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('openid email profile')}` +
        `&access_type=offline` +
        `&prompt=consent` +
        `&state=${encodeURIComponent(`deviceInfo=${deviceInfoParam}${agentParam}`)}`;

      console.log('Opening Google OAuth URL...');

      // Open the in-app browser
      // The backend will redirect to: com.chhattisgarhshaadi.app://oauth-success?accessToken=...&refreshToken=...&isNewUser=...
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(
          googleAuthUrl,
          'com.chhattisgarhshaadi.app',  // Match both oauth-success and oauth-error
          {
            // iOS Properties
            ephemeralWebSession: false,
            // Android Properties
            showTitle: false,
            enableUrlBarHiding: true,
            enableDefaultShare: false,
          }
        );

        if (result.type === 'success' && result.url) {
          console.log('OAuth callback received:', result.url);

          // Check if it's an error callback
          if (result.url.includes('oauth-error')) {
            const urlParts = result.url.split('?');
            if (urlParts.length >= 2) {
              const params: Record<string, string> = {};
              urlParts[1].split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key && value) {
                  params[key] = decodeURIComponent(value);
                }
              });
              throw new Error(params['error'] || 'Authentication failed');
            }
            throw new Error('Authentication failed');
          }

          // Parse the success callback URL to extract tokens
          const urlParts = result.url.split('?');
          if (urlParts.length < 2) {
            throw new Error('Invalid callback URL format');
          }

          const params: Record<string, string> = {};
          urlParts[1].split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              params[key] = decodeURIComponent(value);
            }
          });

          const accessToken = params['accessToken'];
          const refreshToken = params['refreshToken'];
          const userDataParam = params['user'];
          const isNewUserParam = params['isNewUser'];

          if (!accessToken || !refreshToken) {
            throw new Error('Authentication failed: Missing tokens');
          }

          console.log('Authentication successful!');

          // Parse user data if provided
          let user = null;
          if (userDataParam) {
            try {
              user = JSON.parse(userDataParam);
            } catch (e) {
              console.error('Failed to parse user data:', e);
            }
          }

          const isNewUser = isNewUserParam === 'true';

          // Store both tokens securely
          const userId = user?.id || 'user';
          await Keychain.setGenericPassword(String(userId), accessToken, {
            service: 'accessToken'
          });
          await Keychain.setGenericPassword(String(userId), refreshToken, {
            service: 'refreshToken'
          });

          // Update Zustand store
          if (user) {
            useAuthStore.getState().setUser(user);
          }

          return { user, isNewUser };
        } else if (result.type === 'cancel') {
          throw new Error('User cancelled the authentication');
        } else {
          throw new Error('Authentication failed');
        }
      } else {
        throw new Error('In-app browser is not available on this device');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  },

  /**
   * Sends OTP to phone number
   */
  sendPhoneOTP: async (phone: string, countryCode: string = '+91') => {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.SEND_OTP, {
        phone,
        countryCode,
      });
      return data;
    } catch (error: any) {
      console.error('Send OTP failed:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Verifies phone OTP
   */
  verifyPhoneOTP: async (phone: string, otp: string, countryCode: string = '+91', referralCode?: string) => {
    try {
      const payload: any = {
        phone,
        otp,
        countryCode,
      };

      if (referralCode) {
        payload.referralCode = referralCode;
      }

      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload);
      return data;
    } catch (error: any) {
      console.error('Verify OTP failed:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Logs the user out
   * Optionally pass refreshToken to logout from current device only
   * If no refreshToken provided, logs out from all devices
   */
  logout: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
      if (credentials) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
          refreshToken: credentials.password
        });
      }
    } catch (error: any) {
      console.error('Backend logout failed:', error.response?.data || error.message);
    } finally {
      // Always clear local session (tokens only, state is cleared by authStore)
      await Keychain.resetGenericPassword({ service: 'accessToken' });
      await Keychain.resetGenericPassword({ service: 'refreshToken' });
    }
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'refreshToken' });
      if (!credentials) {
        throw new Error('No refresh token found');
      }

      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken: credentials.password,
      });

      const { accessToken, refreshToken: newRefreshToken } = data.data;
      const userId = useAuthStore.getState().user?.id || 'user';

      // Store new tokens
      await Keychain.setGenericPassword(String(userId), accessToken, { service: 'accessToken' });
      await Keychain.setGenericPassword(String(userId), newRefreshToken, { service: 'refreshToken' });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default authService;
