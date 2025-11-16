/**
 * Auth Store
 * Zustand store for authentication state
 */

import { create } from 'zustand';
import { User } from '../types';
import authService from '../services/auth.service';
import { clearStorage, getUserData, storeUserData, getTokens } from '../services/api.service';
import api from '../services/api.service';
import { API_ENDPOINTS } from '../config/api.config';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setIsNewUser: (isNewUser: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOTP: (phone: string, countryCode?: string) => Promise<void>;
  verifyPhoneOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUserData: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isNewUser: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      storeUserData(user);
    }
  },

  setIsNewUser: (isNewUser) => set({ isNewUser }),

  signInWithGoogle: async () => {
    try {
      set({ isLoading: true });
      const response = await authService.signInWithGoogle();
      set({
        user: response.user,
        isAuthenticated: true,
        isNewUser: response.isNewUser,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendPhoneOTP: async (phone, countryCode = '+91') => {
    try {
      set({ isLoading: true });
      await authService.sendPhoneOTP(phone, countryCode);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyPhoneOTP: async (phone, otp) => {
    try {
      set({ isLoading: true });
      await authService.verifyPhoneOTP(phone, otp);
      
      // Update user data
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          phone,
          isPhoneVerified: true,
        };
        set({ user: updatedUser, isLoading: false });
        await storeUserData(updatedUser);
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      
      // Get refresh token from storage and logout
      const { refreshToken } = await getTokens();
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (error) {
          // Log error but continue with local logout
          console.warn('Logout API call failed, continuing with local logout:', error);
        }
      }
      
      // Clear storage
      await clearStorage();
      
      set({
        user: null,
        isAuthenticated: false,
        isNewUser: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      // Even if logout fails, clear local storage
      await clearStorage();
      set({
        user: null,
        isAuthenticated: false,
        isNewUser: false,
        isLoading: false,
      });
    }
  },

  loadUserData: async () => {
    try {
      // Get stored tokens and user data
      const { accessToken, refreshToken } = await getTokens();
      const userData = await getUserData();

      // If no tokens or user data, clear everything and require login
      if (!accessToken || !refreshToken || !userData) {
        // This is expected on first launch - don't log as error
        // console.log('No stored tokens or user data found');
        await clearStorage();
        set({ user: null, isAuthenticated: false, isNewUser: false });
        return;
      }

      // Validate token by making a lightweight API call
      try {
        // Try to fetch current user to validate token
        const response = await api.get(API_ENDPOINTS.USERS.ME);
        
        // Token is valid - update user data with latest from server
        const updatedUser = response.data.data;
        set({ 
          user: updatedUser, 
          isAuthenticated: true,
          isNewUser: false, // Existing user if we can fetch their data
        });
        
        // Update stored user data with latest from server
        await storeUserData(updatedUser);
        
        console.log('User session restored successfully');
      } catch (validationError: any) {
        // Token might be expired, try to refresh
        if (validationError.response?.status === 401) {
          console.log('Access token expired, attempting refresh...');
          
          try {
            // Try to refresh the token
            await authService.refreshToken(refreshToken);
            
            // Token refreshed successfully - validate again
            const userResponse = await api.get(API_ENDPOINTS.USERS.ME);
            const updatedUser = userResponse.data.data;
            
            set({ 
              user: updatedUser, 
              isAuthenticated: true,
              isNewUser: false,
            });
            await storeUserData(updatedUser);
            
            console.log('Token refreshed and session restored successfully');
          } catch (refreshError) {
            // Refresh failed - tokens are invalid, clear everything
            console.log('Token refresh failed, clearing session');
            await clearStorage();
            set({ 
              user: null, 
              isAuthenticated: false, 
              isNewUser: false 
            });
          }
        } else {
          // Other error (network, server error, etc.)
          // Still restore user data but mark as potentially stale
          console.warn('Token validation failed, but restoring cached user data');
          set({ 
            user: userData, 
            isAuthenticated: true,
            isNewUser: false,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // On any error, clear storage to be safe
      await clearStorage();
      set({ user: null, isAuthenticated: false, isNewUser: false });
    }
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
      storeUserData(updatedUser);
    }
  },
}));
