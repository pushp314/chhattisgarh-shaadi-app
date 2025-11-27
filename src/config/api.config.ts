import axios, { AxiosError } from 'axios';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://chhattisgarhshadi-backend.onrender.com/api/v1';

// Export API configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  SOCKET_URL: 'https://chhattisgarhshadi-backend.onrender.com',
  TIMEOUT: 10000,
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
    // If the request was successful, just return the response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not a retry request
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        // If we are already refreshing, add this request to the queue
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

        // Make the refresh token API call
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshTokenCredentials.password,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        // Store the new tokens
        const userId = useAuthStore.getState().user?.id || 'user';
        await Keychain.setGenericPassword(String(userId), newAccessToken, { service: 'accessToken' });
        await Keychain.setGenericPassword(String(userId), newRefreshToken, { service: 'refreshToken' });

        console.log('Token refreshed successfully.');

        // Update the header of the original request
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        (originalRequest as any).headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Process the queue with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error('Failed to refresh token:', refreshError.response?.data || refreshError.message);
        processQueue(refreshError, null);
        // If refresh fails, clear the session
        await clearAuthSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For all other errors, just reject the promise
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
    SEND_OTP: '/auth/phone/send-otp',
    VERIFY_OTP: '/auth/phone/verify-otp',
  },
  USERS: {
    ME: '/users/me',
    BY_ID: (id: number) => `/users/${id}`,
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
    PROFILE_PHOTO: '/users/upload-profile-picture',
    PROFILE_PHOTOS: '/users/upload-profile-picture/multiple',
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
    GET: '/partner-preference',
    UPDATE: '/partner-preference',
  },
  CONTACT_REQUESTS: {
    CREATE: '/contact-requests',
    SENT: '/contact-requests/sent',
    RECEIVED: '/contact-requests/received',
    RESPOND: (id: number) => `/contact-requests/${id}/respond`,
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
    PLANS: '/subscription',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/mark-read',
    SETTINGS: '/notification-settings',
  },
  REPORTS: {
    CREATE: '/reports',
  },
  SHORTLISTS: {
    CREATE: '/shortlists',
    LIST: '/shortlists',
    DELETE: (id: number) => `/shortlists/${id}`,
  },
  PHOTO_REQUESTS: {
    CREATE: '/photo-requests',
    SENT: '/photo-requests/sent',
    RECEIVED: '/photo-requests/received',
    RESPOND: (id: number) => `/photo-requests/${id}/respond`,
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
    LOG: '/profile-views',
    WHO_VIEWED_ME: '/profile-views/who-viewed-me',
    MY_HISTORY: '/profile-views/my-history',
  },
};
