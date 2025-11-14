/**
 * API Configuration
 * Base URLs and API endpoints configuration
 */

import { Platform } from 'react-native';

/**
 * Get API URL based on platform
 * - Android Emulator: 10.0.2.2 (host machine's localhost)
 * - iOS Simulator: localhost (shares host network)
 * - Physical Device: Use your computer's local IP (192.168.x.x)
 * - Production: Render backend URL
 */
const getApiUrl = () => {
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:8080',      // Android Emulator (local backend)
      ios: 'http://localhost:8080',          // iOS Simulator (local backend)
      default: 'http://192.168.29.22:8080'   // Physical devices (local backend)
    })!;
  }
  return 'https://chhattisgarhshadi-backend.onrender.com'; // Production backend on Render
};

export const API_CONFIG = {
  // Backend uses /api/v1 path
  BASE_URL: `${getApiUrl()}/api/v1`,
  
  SOCKET_URL: getApiUrl(),
  
  TIMEOUT: 10000, // 10 seconds
  
  // Token expiry times
  ACCESS_TOKEN_EXPIRY: 15 * 60 * 1000, // 15 minutes in milliseconds
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    GOOGLE_SIGNIN: '/auth/google',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    SEND_OTP: '/auth/phone/send-otp',
    VERIFY_OTP: '/auth/phone/verify-otp',
  },
  
  // Users
  USERS: {
    ME: '/users/me',
    SEARCH: '/users/search',
    BY_ID: (userId: number) => `/users/${userId}`,
  },
  
  // Profiles (Backend uses /profile not /profiles)
  PROFILES: {
    CREATE: '/profile',
    ME: '/profile/me',
    UPDATE: '/profile/me',
    DELETE: '/profile/me',
    BY_ID: (userId: number) => `/profile/${userId}`,
    SEARCH: '/profile/search',
  },
  
  // Matches
  MATCHES: {
    CREATE: '/matches',
    SENT: '/matches/sent',
    RECEIVED: '/matches/received',
    ACCEPTED: '/matches/accepted',
    ACCEPT: (matchId: number) => `/matches/${matchId}/accept`,
    REJECT: (matchId: number) => `/matches/${matchId}/reject`,
    DELETE: (matchId: number) => `/matches/${matchId}`,
  },
  
  // Messages
  MESSAGES: {
    SEND: '/messages',
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: (userId: number) => `/messages/${userId}`,
    MARK_READ: (userId: number) => `/messages/${userId}/read`,
    UNREAD_COUNT: '/messages/unread-count',
    DELETE: (messageId: number) => `/messages/${messageId}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: (notificationId: number) => `/notifications/${notificationId}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (notificationId: number) => `/notifications/${notificationId}`,
    DELETE_ALL: '/notifications',
  },
  
  // Uploads (Backend uses /upload not /uploads)
  UPLOADS: {
    PROFILE_PHOTO: '/upload/profile-photo',
    PROFILE_PHOTOS: '/upload/profile-photos',
    DOCUMENT: '/upload/document',
  },
  
  // Payments
  PAYMENTS: {
    CREATE_ORDER: '/payments/orders',
    VERIFY: '/payments/verify',
    MY_PAYMENTS: '/payments/me',
    BY_ID: (paymentId: number) => `/payments/${paymentId}`,
  },
  
  // Health check
  HEALTH: '/health',
};
