import axios, { AxiosError } from 'axios';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://chhattisgarhshadi-backend.onrender.com/api/v1';

// Export API configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  SOCKET_URL: 'https://chhattisgarhshadi-backend.onrender.com',
  TIMEOUT: 10000,
  GOOGLE_CLIENT_ID: '250704044564-r7usqdp7hrfotfjug73rph9qpuetvh1e.apps.googleusercontent.com',
};

// Create the main Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10-second timeout
});

// --- Axios Request Interceptor ---
// Automatically attaches the access token to every outgoing request.
apiClient.interceptors.request.use(
  async (config) => {
    const credentials = await Keychain.getGenericPassword({ service: 'accessToken' });
    if (credentials) {
      config.headers.Authorization = `Bearer ${credentials.password}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// A flag to prevent an infinite loop of refresh token calls
let isRefreshing = false;
// A queue to hold failed requests while the token is being refreshed
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper function to clear auth session (avoids circular dependency)
const clearAuthSession = async () => {
  await Keychain.resetGenericPassword({ service: 'accessToken' });
  await Keychain.resetGenericPassword({ service: 'refreshToken' });
  useAuthStore.getState().logout();
};

// --- Axios Response Interceptor ---
// Handles 401 Unauthorized errors by attempting to refresh the token.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a retry request
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          (originalRequest as any).headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        console.log('Access token expired. Attempting to refresh...');
        const refreshTokenCredentials = await Keychain.getGenericPassword({ service: 'refreshToken' });

        if (!refreshTokenCredentials) {
          console.log('No refresh token available. Clearing session.');
          await clearAuthSession();
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshTokenCredentials.password,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        const userId = useAuthStore.getState().user?.id || 'user';
        await Keychain.setGenericPassword(String(userId), newAccessToken, { service: 'accessToken' });
        await Keychain.setGenericPassword(String(userId), newRefreshToken, { service: 'refreshToken' });

        console.log('Token refreshed successfully.');

        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        (originalRequest as any).headers['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('Failed to refresh token:', refreshError.response?.data || refreshError.message);
        processQueue(refreshError, null);
        await clearAuthSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REFRESH_TOKEN: '/auth/refresh',
    GOOGLE: '/auth/google',
    SEND_OTP: '/auth/phone/send-otp', // Deprecated - kept for reference
    VERIFY_OTP: '/auth/phone/verify-otp', // Deprecated - kept for reference
    VERIFY_FIREBASE_PHONE: '/auth/phone/verify-firebase', // New Firebase endpoint
  },
  USERS: {
    ME: '/users/me',
    BY_ID: (id: number) => `/users/${id}`,
    FCM_TOKEN: '/users/fcm-token', // ✅ ADDED: Missing in previous config
  },
  PROFILES: {
    CREATE: '/profiles',
    ME: '/profiles/me',
    SEARCH: '/profiles/search',
    BY_ID: (id: number) => `/profiles/${id}`,
    DELETE: '/profiles/me',
    DELETE_PHOTO: (mediaId: number) => `/profiles/photos/${mediaId}`,
  },
  UPLOADS: {
    PROFILE_PHOTO: '/uploads/profile-photo',
    PROFILE_PHOTOS: '/uploads/profile-photos',
    ID_PROOF: '/uploads/id-proof',
  },
  EDUCATION: {
    CREATE: '/education',
    LIST: '/education',
    BY_ID: (id: number) => `/education/${id}`,
  },
  OCCUPATION: {
    CREATE: '/occupation',
    LIST: '/occupation',
    BY_ID: (id: number) => `/occupation/${id}`,
  },
  PARTNER_PREFERENCE: {
    GET: '/preference',
    UPDATE: '/preference',
  },
  CONTACT_REQUESTS: {
    CREATE: '/contact-request',
    SENT: '/contact-request/sent',
    RECEIVED: '/contact-request/received',
    RESPOND: (id: number) => `/contact-request/${id}/respond`,
  },
  MATCHES: {
    SEND: '/matches',
    SENT: '/matches/sent',
    RECEIVED: '/matches/received',
    ACCEPTED: '/matches/accepted',
    ACCEPT: (id: number) => `/matches/${id}/accept`,
    REJECT: (id: number) => `/matches/${id}/reject`,
    DELETE: (id: number) => `/matches/${id}`,
  },
  MESSAGES: {
    SEND: '/messages',
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: (userId: number) => `/messages/${userId}`,
    WITH_USER: (userId: number) => `/messages/${userId}`,
    MARK_READ: (userId: number) => `/messages/${userId}/read`,
    UNREAD_COUNT: '/messages/unread-count',
    DELETE: (messageId: number) => `/messages/${messageId}`,
  },
  BLOCK: {
    CREATE: '/block',
    LIST: '/block',
    DELETE: (id: number) => `/block/${id}`,
  },
  SUBSCRIPTION: {
    PLANS: '/plans',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_AS_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id: number) => `/notifications/${id}`,
    DELETE_ALL: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    SETTINGS: '/settings/notifications',
  },
  REPORTS: {
    CREATE: '/report',
  },
  SHORTLISTS: {
    CREATE: '/shortlist',
    LIST: '/shortlist',
    DELETE: (id: number) => `/shortlist/${id}`,
  },
  PHOTO_REQUESTS: {
    CREATE: '/photo-request',
    SENT: '/photo-request/sent',
    RECEIVED: '/photo-request/received',
    RESPOND: (id: number) => `/photo-request/${id}/respond`,
  },
  PRIVACY: {
    PHOTO: (id: number) => `/photos/${id}/privacy`,
    PROFILE: '/privacy/profile',
    COMMUNICATION: '/privacy/communication',
    SEARCH: '/privacy/search',
    SECURITY: '/privacy/security',
  },
  PAYMENTS: {
    CREATE_ORDER: '/payments/orders',
    VERIFY: '/payments/verify',
    MY_PAYMENTS: '/payments/me',
    BY_ID: (id: number) => `/payments/${id}`,
  },
  PROFILE_VIEWS: {
    LOG: '/view',
    WHO_VIEWED_ME: '/view/who-viewed-me',
    MY_HISTORY: '/view/my-history',
  },
};