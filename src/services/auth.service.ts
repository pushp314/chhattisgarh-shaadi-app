/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import InAppBrowser from 'react-native-inappbrowser-reborn';
import api, { storeTokens, storeUserData } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { AuthResponse, DeviceInfo as DeviceInfoType, ApiResponse } from '../types';
import * as RNDeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const GOOGLE_OAUTH_CONFIG = {
  // Client ID from Google Cloud Console
  clientId: '250704044564-r7usqdp7hrfotfjug73rph9qpuetvh1e.apps.googleusercontent.com',
  
  // Backend redirect URI (must match Google Console Authorized redirect URIs)
  redirectUri: 'https://chhattisgarhshadi-backend.onrender.com/api/v1/auth/google/callback',
  
  scopes: [
    'openid',
    'profile',
    'email',
  ],
};

class AuthService {
  /**
   * Configure Google Sign-In (Legacy - not used with Web OAuth)
   */
  configureGoogleSignIn() {
    // No longer needed with Web-based OAuth
    console.log('Using Web-based OAuth flow');
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
   * Sign in with Google using Web-based OAuth
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Build OAuth URL
      const params = new URLSearchParams({
        client_id: GOOGLE_OAUTH_CONFIG.clientId,
        redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
        response_type: 'code',
        scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
        access_type: 'offline',
        prompt: 'consent',
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      // Open OAuth in InAppBrowser
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(authUrl, GOOGLE_OAUTH_CONFIG.redirectUri, {
          // iOS options
          ephemeralWebSession: false,
          // Android options
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });

        if (result.type === 'success' && result.url) {
          // Extract authorization code from redirect URL
          const match = result.url.match(/code=([^&]+)/);
          if (!match || !match[1]) {
            throw new Error('No authorization code received from Google');
          }

          const authCode = match[1];

          // Get device info
          const deviceInfo = await this.getDeviceInfo();

          // Send authorization code to backend
          const response = await api.post<ApiResponse<AuthResponse>>(
            API_ENDPOINTS.AUTH.GOOGLE_SIGNIN,
            {
              authorizationCode: authCode,
              redirectUri: GOOGLE_OAUTH_CONFIG.redirectUri,
              deviceInfo,
            }
          );

          const { accessToken, refreshToken, user } = response.data.data;

          // Store tokens and user data
          await storeTokens(accessToken, refreshToken);
          await storeUserData(user);

          return response.data.data;
        } else {
          throw new Error('User cancelled Google Sign-In or authentication failed');
        }
      } else {
        throw new Error('InAppBrowser not available');
      }
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
    }
    // No need to sign out from Google with web-based OAuth
  }
}

export default new AuthService();
