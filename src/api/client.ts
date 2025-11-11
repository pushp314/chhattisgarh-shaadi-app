// OVERWRITE: src/api/client.ts
import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {env} from '../config/env';
import * as storage from '../services/storage'; // FIX: Was 'import *s storage'
import {useAuthStore} from '../store/auth.store';
import {AuthTokens, User} from '../types'; // FIX: Added 'User' import

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const {accessToken} = useAuthStore.getState();
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response Interceptor: Handle 401s and Refresh Token
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/auth/refresh' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If refreshing, wait for the new token
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await storage.loadRefreshToken(); // This will work now
      if (!refreshToken) {
        useAuthStore.getState().logout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const {data: tokens} = await axios.post<AuthTokens>(
          `${env.API_BASE_URL}/auth/refresh`,
          {refreshToken},
        );

        // Update store and keychain
        await useAuthStore.getState().setTokens(tokens);

        // Update header for the original request
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

        // Process the queue with the new token
        processQueue(null, tokens.accessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
        useAuthStore.getState().logout();
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/**
 * API Service definitions
 * We can create separate files for these as the app grows.
 */

// Auth Service
export const authService = {
  googleLogin: (idToken: string) =>
    apiClient.post<AuthTokens>('/auth/google', {idToken}),
  sendOtp: (phone: string) =>
    apiClient.post('/auth/phone/send-otp', {phone}),
  verifyOtp: (phone: string, otp: string) =>
    apiClient.post('/auth/phone/verify-otp', {phone, otp}),
};

// User/Profile Service
export const userService = {
  getMe: () => apiClient.get<User>('/users/me'), // This will work now
  createProfile: (data: unknown) => apiClient.post('/profiles', data),
  updateProfile: (data: unknown) => apiClient.put('/profiles/me', data),
};

// ... Add other services (matchService, messageService, etc.)
// following the backend contract.