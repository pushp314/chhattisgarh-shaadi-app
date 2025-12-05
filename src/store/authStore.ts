/**
 * Auth Store
 * Zustand store for authentication state
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  signInWithGoogle: (agentCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUserData: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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

      signInWithGoogle: async (agentCode?: string) => {
        try {
          set({ isLoading: true });
          const response = await authService.signInWithGoogle(agentCode);
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

      // Note: Firebase phone OTP is handled directly in PhoneVerificationScreen
      // No need for sendPhoneOTP/verifyPhoneOTP here anymore

      logout: async () => {
        try {
          set({ isLoading: true });

          // Call logout service (handles token retrieval internally)
          try {
            await authService.logout();
          } catch (error) {
            // Log error but continue with local logout
            console.warn('Logout API call failed, continuing with local logout:', error);
          }

          // Disconnect socket
          try {
            const { default: socketService } = await import('../services/socket.service');
            socketService.disconnect();
          } catch (error) {
            console.warn('Socket disconnect failed:', error);
          }

          // Clear storage
          await clearStorage();

          // Clear profile store
          try {
            const { useProfileStore } = await import('./profileStore');
            useProfileStore.getState().clearProfile();
          } catch (error) {
            console.warn('Profile store clear failed:', error);
          }

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

          if (__DEV__) {
            console.log('🔐 loadUserData - Checking stored credentials:', {
              hasAccessToken: !!accessToken,
              hasRefreshToken: !!refreshToken,
              hasUserData: !!userData,
            });
          }

          // If no tokens, we definitely need to login
          if (!accessToken || !refreshToken) {
            if (__DEV__) console.log('🔐 No tokens found - requiring login');
            await clearStorage();
            set({ user: null, isAuthenticated: false, isNewUser: false });
            return;
          }

          // If we have tokens but no userData, don't logout - try to fetch from server
          // This handles edge case where AsyncStorage is cleared but Keychain isn't

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

            if (__DEV__) console.log('User session restored successfully');
          } catch (validationError: any) {
            // Check if it's an auth error (401)
            if (validationError.response?.status === 401) {
              if (__DEV__) console.log('Access token expired, attempting refresh...');

              try {
                // Try to refresh the token
                await authService.refreshToken();

                // Token refreshed successfully - validate again
                const userResponse = await api.get(API_ENDPOINTS.USERS.ME);
                const updatedUser = userResponse.data.data;

                set({
                  user: updatedUser,
                  isAuthenticated: true,
                  isNewUser: false,
                });
                await storeUserData(updatedUser);

                if (__DEV__) console.log('Token refreshed and session restored successfully');
              } catch (refreshError) {
                // Refresh failed - ONLY clear if we can't refresh
                if (__DEV__) console.log('Token refresh failed, clearing session');
                await clearStorage();
                set({
                  user: null,
                  isAuthenticated: false,
                  isNewUser: false
                });
              }
            } else {
              // Network error or server error (500)
              // IMPORTANT: Do NOT logout the user. Assume offline/cached mode.
              console.warn('Token validation failed (network/server), restoring cached session:', validationError.message);

              // We already have userData from getUserData(), so just set it active
              set({
                user: userData,
                isAuthenticated: true,
                isNewUser: false,
              });
            }
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Don't clear storage here blindly.
          // If we have tokens, we might just be offline.
          try {
            const { accessToken } = await getTokens();
            if (accessToken) {
              // We have a token but something else failed (e.g. AsyncStorage read error)
              // Best effort: try to keep them logged in if state allows, otherwise allow retry later
              if (__DEV__) console.log('Keeping potential session despite load error');
            } else {
              await clearStorage();
              set({ user: null, isAuthenticated: false, isNewUser: false });
            }
          } catch {
            // If we can't even read tokens, then we must reset
            await clearStorage();
            set({ user: null, isAuthenticated: false, isNewUser: false });
          }
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
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isNewUser: state.isNewUser,
      }),
    }
  )
);
