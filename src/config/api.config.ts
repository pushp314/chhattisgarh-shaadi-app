/**
 * API Configuration
 * Base URLs and API endpoints configuration
 */

export const API_CONFIG = {
  // Change to production URL when deploying
  BASE_URL: __DEV__
    ? 'http://localhost:5000/api/v1'
    : 'https://your-domain.com/api/v1',
  
  SOCKET_URL: __DEV__
    ? 'http://localhost:5000'
    : 'https://your-domain.com',
  
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
  
  // Profiles
  PROFILES: {
    CREATE: '/profiles',
    ME: '/profiles/me',
    SEARCH: '/profiles/search',
    BY_USER_ID: (userId: number) => `/profiles/${userId}`,
    DELETE_PHOTO: (mediaId: number) => `/profiles/photos/${mediaId}`,
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
  
  // Uploads
  UPLOADS: {
    PROFILE_PHOTO: '/uploads/profile-photo',
    PROFILE_PHOTOS: '/uploads/profile-photos',
    ID_PROOF: '/uploads/id-proof',
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
