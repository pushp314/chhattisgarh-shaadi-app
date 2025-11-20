import axios, { AxiosError } from 'axios';
import * as Keychain from 'react-native-keychain';
import { useAuthStore } from '../store/authStore';
import authService from '../services/auth.service'; // Import authService for logout

const API_BASE_URL = 'https://chhattisgarhshadi-backend.onrender.com/api/v1';

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
          console.log('No refresh token available. Logging out.');
          await authService.logout();
          return Promise.reject(error);
        }

        // Make the refresh token API call
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshTokenCredentials.password,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

        // Store the new tokens
        const userId = useAuthStore.getState().user?.id || 'user';
        await Keychain.setGenericPassword(userId, newAccessToken, { service: 'accessToken' });
        await Keychain.setGenericPassword(userId, newRefreshToken, { service: 'refreshToken' });

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
        // If refresh fails, log the user out completely
        await authService.logout();
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
