/**
 * Auth Store
 * Zustand store for authentication state
 */

import { create } from 'zustand';
import { User } from '../types';
import authService from '../services/auth.service';
import { clearStorage, getUserData, storeUserData } from '../services/api.service';

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
      
      // Get refresh token and logout
      const refreshToken = ''; // Get from storage if needed
      await authService.logout(refreshToken);
      
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
      throw error;
    }
  },

  loadUserData: async () => {
    try {
      const userData = await getUserData();
      if (userData) {
        set({ user: userData, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
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
