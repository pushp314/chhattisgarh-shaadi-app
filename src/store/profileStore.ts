/**
 * Profile Store
 * Zustand store for profile state
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from '../types';
import profileService from '../services/profile.service';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  profileCompleteness: number;

  // Actions
  setProfile: (profile: Profile | null) => void;
  createProfile: (data: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadPhoto: (photoUri: string) => Promise<void>;
  uploadPhotos: (photoUris: string[]) => Promise<void>;
  deleteProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      profileCompleteness: 0,

      setProfile: (profile) => {
        set({
          profile,
          profileCompleteness: profile?.profileCompleteness || 0,
        });
      },

      createProfile: async (data) => {
        try {
          set({ isLoading: true });
          const response = await profileService.createProfile(data);
          set({
            profile: response.profile,
            profileCompleteness: response.profileCompleteness,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchProfile: async () => {
        try {
          set({ isLoading: true });
          const profile = await profileService.getMyProfile();
          set({
            profile,
            profileCompleteness: profile.profileCompleteness,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const response = await profileService.updateMyProfile(data);
          set({
            profile: response.profile,
            profileCompleteness: response.profileCompleteness,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      uploadPhoto: async (photoUri) => {
        try {
          set({ isLoading: true });
          await profileService.uploadProfilePhoto(photoUri);

          // Refresh profile to get updated media
          await get().fetchProfile();

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      uploadPhotos: async (photoUris) => {
        try {
          set({ isLoading: true });
          await profileService.uploadProfilePhotos(photoUris);

          // Refresh profile to get updated media
          await get().fetchProfile();

          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      deleteProfile: async () => {
        try {
          set({ isLoading: true });
          await profileService.deleteMyProfile();

          // Clear profile data
          set({
            profile: null,
            profileCompleteness: 0,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }), {
    name: 'profile-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      profile: state.profile,
      profileCompleteness: state.profileCompleteness,
    }),
  }));
