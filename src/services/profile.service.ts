/**
 * Profile Service
 * Handles all profile-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Profile, ApiResponse, SearchProfilesParams, PaginationResponse } from '../types';

class ProfileService {
  /**
   * Create profile
   */
  async createProfile(data: Partial<Profile>): Promise<{
    profile: Profile;
    profileCompleteness: number;
  }> {
    const response = await api.post<ApiResponse<{
      profile: Profile;
      profileCompleteness: number;
    }>>(API_ENDPOINTS.PROFILES.CREATE, data);
    return response.data.data;
  }

  /**
   * Get my profile
   */
  async getMyProfile(): Promise<Profile> {
    const response = await api.get<ApiResponse<Profile>>(
      API_ENDPOINTS.PROFILES.ME
    );
    return response.data.data;
  }

  /**
   * Update my profile
   */
  async updateMyProfile(data: Partial<Profile>): Promise<{
    profile: Profile;
    profileCompleteness: number;
  }> {
    const response = await api.put<ApiResponse<{
      profile: Profile;
      profileCompleteness: number;
    }>>(API_ENDPOINTS.PROFILES.ME, data);
    return response.data.data;
  }

  /**
   * Search profiles
   */
  async searchProfiles(params: SearchProfilesParams): Promise<{
    profiles: Profile[];
    pagination: PaginationResponse;
  }> {
    const response = await api.get<ApiResponse<{
      profiles: Profile[];
      pagination: PaginationResponse;
    }>>(API_ENDPOINTS.PROFILES.SEARCH, { params });
    return response.data.data;
  }

  /**
   * Get profile by ID (profile ID, not user ID)
   */
  async getProfileById(profileId: number): Promise<Profile> {
    const response = await api.get<ApiResponse<Profile>>(
      API_ENDPOINTS.PROFILES.BY_ID(profileId)
    );
    return response.data.data;
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(photoUri: string): Promise<any> {
    const formData = new FormData();

    formData.append('photo', {
      uri: photoUri,
      type: 'image/jpeg',
      name: `profile-photo-${Date.now()}.jpg`,
    } as any);

    const response = await api.post<ApiResponse>(
      API_ENDPOINTS.UPLOADS.PROFILE_PHOTO,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  /**
   * Upload multiple profile photos
   */
  async uploadProfilePhotos(photoUris: string[]): Promise<any> {
    const formData = new FormData();

    photoUris.forEach((uri, index) => {
      formData.append('photos', {
        uri,
        type: 'image/jpeg',
        name: `profile-photo-${index}-${Date.now()}.jpg`,
      } as any);
    });

    const response = await api.post<ApiResponse>(
      API_ENDPOINTS.UPLOADS.PROFILE_PHOTOS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }

  /**
   * Delete profile photo
   */
  async deletePhoto(mediaId: number): Promise<void> {
    await api.delete(API_ENDPOINTS.PROFILES.DELETE_PHOTO(mediaId));
  }

  /**
   * Delete my profile
   */
  async deleteMyProfile(): Promise<void> {
    await api.delete(API_ENDPOINTS.PROFILES.DELETE);
  }

}

export default new ProfileService();
