/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import api, { storeTokens, storeUserData } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { AuthResponse, DeviceInfo as DeviceInfoType, ApiResponse } from '../types';
import * as RNDeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

class AuthService {
  /**
   * Configure Google Sign-In
   */
  configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: '250704044564-q3ql66oruro0a17ipumla9cloda24tkk.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  /**
   * Get device information
   */
  private async getDeviceInfo(): Promise<DeviceInfoType> {
    return {
      deviceId: await RNDeviceInfo.getUniqueId(),
      deviceName: await RNDeviceInfo.getDeviceName(),
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      userAgent: await RNDeviceInfo.getUserAgent(),
    };
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices();

      // Sign in and get user info
      await GoogleSignin.signIn();

      // Get ID token
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;

      if (!idToken) {
        throw new Error('Failed to get ID token from Google');
      }

      // Get device info
      const deviceInfo = await this.getDeviceInfo();

      // Send to backend
      const response = await api.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.GOOGLE_SIGNIN,
        {
          idToken,
          deviceInfo,
        }
      );

      const { accessToken, refreshToken, user } = response.data.data;

      // Store tokens and user data
      await storeTokens(accessToken, refreshToken);
      await storeUserData(user);

      return response.data.data;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  /**
   * Send OTP to phone
   */
  async sendPhoneOTP(phone: string, countryCode: string = '+91'): Promise<void> {
    const response = await api.post<ApiResponse>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      {
        phone,
        countryCode,
      }
    );
    return response.data.data;
  }

  /**
   * Verify phone OTP
   */
  async verifyPhoneOTP(phone: string, otp: string): Promise<void> {
    const response = await api.post<ApiResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      {
        phone,
        otp,
      }
    );
    return response.data.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await api.post<ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
    await storeTokens(newAccessToken, newRefreshToken);
    
    return response.data.data;
  }

  /**
   * Logout
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Sign out from Google
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.error('Google sign out error:', error);
      }
    }
  }
}

export default new AuthService();
