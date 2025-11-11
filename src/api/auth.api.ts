import { apiClient } from './client';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

export interface GoogleAuthRequest {
  idToken: string;
  deviceInfo?: {
    deviceId: string;
    deviceName: string;
    deviceType: 'IOS' | 'ANDROID';
    userAgent?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      profilePicture: string | null;
      role: string;
      isPhoneVerified: boolean;
      preferredLanguage: string;
      profile: any;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    isNewUser: boolean;
  };
}

export const AuthAPI = {
  // Google Sign-In
  async googleAuth(idToken: string): Promise<AuthResponse> {
    const deviceInfo = {
      deviceId: await DeviceInfo.getUniqueId(),
      deviceName: await DeviceInfo.getDeviceName(),
      deviceType: Platform.OS === 'ios' ? 'IOS' as const : 'ANDROID' as const,
      userAgent: await DeviceInfo.getUserAgent(),
    };

    const response = await apiClient.post<AuthResponse>('/auth/google', {
      idToken,
      deviceInfo,
    });

    return response.data;
  },

  // Logout
  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  // Send OTP
  async sendOTP(phone: string, countryCode: string = '+91'): Promise<any> {
    const response = await apiClient.post('/auth/phone/send-otp', {
      phone,
      countryCode,
    });
    return response.data;
  },

  // Verify OTP
  async verifyOTP(phone: string, otp: string): Promise<any> {
    const response = await apiClient.post('/auth/phone/verify-otp', {
      phone,
      otp,
    });
    return response.data;
  },
};