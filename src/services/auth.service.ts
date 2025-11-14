/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import InAppBrowser from 'react-native-inappbrowser-reborn';
import api, { storeTokens, storeUserData } from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { AuthResponse, DeviceInfo as DeviceInfoType, ApiResponse } from '../types';
import * as RNDeviceInfo from 'react-native-device-info';
import { Platform, Linking } from 'react-native';

const GOOGLE_OAUTH_CONFIG = {
  // Web Client ID from Google Cloud Console (for InAppBrowser OAuth)
  clientId: '250704044564-r7usqdp7hrfotfjug73rph9qpuetvh1e.apps.googleusercontent.com',
  
  // Backend callback URL - Google redirects here, backend handles token exchange
  // Backend should then redirect back to app with tokens or deep link
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
   * Backend callback route handles token exchange and redirects back to app
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        // Build OAuth URL
        const oauthParams = new URLSearchParams({
          client_id: GOOGLE_OAUTH_CONFIG.clientId,
          redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
          response_type: 'code',
          scope: GOOGLE_OAUTH_CONFIG.scopes.join(' '),
          access_type: 'offline',
          prompt: 'consent',
        });

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${oauthParams.toString()}`;

        // Setup deep link listener BEFORE opening browser
        const handleDeepLink = async ({ url }: { url: string }) => {
          console.log('Deep link received:', url);

          try {
            // Close browser
            await InAppBrowser.close();

            // Check if it's an error callback
            if (url.includes('oauth-error')) {
              const errorMatch = url.match(/error=([^&]+)/);
              const errorMsg = errorMatch ? decodeURIComponent(errorMatch[1]) : 'Unknown error';
              Linking.removeAllListeners('url');
              reject(new Error(`OAuth failed: ${errorMsg}`));
              return;
            }

            // Check if it's a success callback
            if (url.includes('oauth-success')) {
              // Parse URL parameters manually
              const urlParts = url.split('?');
              if (urlParts.length < 2) {
                console.error('No query parameters in URL:', url);
                Linking.removeAllListeners('url');
                reject(new Error('Invalid callback URL from backend - no parameters'));
                return;
              }

              // Extract parameters manually
              const queryString = urlParts[1];
              const urlParams: Record<string, string> = {};
              queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key && value) {
                  urlParams[key] = decodeURIComponent(value);
                }
              });

              console.log('Parsed URL params:', urlParams);

              const accessToken = urlParams.accessToken;
              const refreshToken = urlParams.refreshToken;
              const isNewUserStr = urlParams.isNewUser;
              const userData = urlParams.user;

              if (!accessToken || !refreshToken) {
                console.error('Missing tokens. Params received:', Object.keys(urlParams));
                Linking.removeAllListeners('url');
                reject(new Error('No tokens received from backend'));
                return;
              }

              // Parse user data if present
              const user = userData ? JSON.parse(userData) : null;

              // Store tokens and user data
              await storeTokens(accessToken, refreshToken);
              if (user) {
                await storeUserData(user);
              }

              console.log('Sign-in successful! isNewUser:', isNewUserStr);

              Linking.removeAllListeners('url');
              resolve({ 
                accessToken, 
                refreshToken, 
                user,
                expiresIn: '900', // 15 minutes
                isNewUser: isNewUserStr === 'true',
              });
            }
          } catch (error: any) {
            console.error('Deep link handling error:', error);
            Linking.removeAllListeners('url');
            reject(error);
          }
        };

        // Add listener
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Timeout after 5 minutes
        const timeout = setTimeout(() => {
          subscription.remove();
          reject(new Error('Authentication timeout'));
        }, 5 * 60 * 1000);

        // Open OAuth in InAppBrowser
        if (await InAppBrowser.isAvailable()) {
          try {
            await InAppBrowser.open(authUrl, {
              // iOS options
              ephemeralWebSession: false,
              // Android options
              showTitle: false,
              enableUrlBarHiding: true,
              enableDefaultShare: false,
            });
            
            // Note: Browser will stay open until deep link is triggered or user closes it
            console.log('InAppBrowser opened, waiting for callback...');
          } catch (browserError: any) {
            clearTimeout(timeout);
            subscription.remove();
            console.error('Browser error:', browserError);
            
            // Check if user dismissed/cancelled
            if (browserError.message?.includes('cancel') || browserError.message?.includes('dismiss')) {
              reject(new Error('Sign-in cancelled by user'));
            } else {
              reject(browserError);
            }
          }
        } else {
          clearTimeout(timeout);
          subscription.remove();
          reject(new Error('InAppBrowser not available'));
        }
      } catch (error: any) {
        console.error('Google Sign-In Error:', error);
        reject(error);
      }
    });
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
