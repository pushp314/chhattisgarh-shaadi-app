/**
 * Privacy Service
 * Handles all privacy-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import {
    PhotoPrivacySettings,
    ProfilePrivacySettings,
    CommunicationSettings,
    SearchVisibilitySettings,
    AccountSecuritySettings,
    ApiResponse
} from '../types';

class PrivacyService {
    /**
     * Get photo privacy settings
     */
    async getPhotoPrivacy(mediaId: number): Promise<PhotoPrivacySettings> {
        const response = await api.get<ApiResponse<PhotoPrivacySettings>>(
            API_ENDPOINTS.PRIVACY.PHOTO(mediaId)
        );
        return response.data.data;
    }

    /**
     * Update photo privacy settings
     */
    async updatePhotoPrivacy(mediaId: number, data: Partial<PhotoPrivacySettings>): Promise<PhotoPrivacySettings> {
        const response = await api.put<ApiResponse<PhotoPrivacySettings>>(
            API_ENDPOINTS.PRIVACY.PHOTO(mediaId),
            data
        );
        return response.data.data;
    }

    /**
     * Get profile privacy settings
     */
    async getProfilePrivacy(): Promise<ProfilePrivacySettings> {
        const response = await api.get<ApiResponse<ProfilePrivacySettings>>(
            API_ENDPOINTS.PRIVACY.PROFILE
        );
        return response.data.data;
    }

    /**
     * Update profile privacy settings
     */
    async updateProfilePrivacy(data: Partial<ProfilePrivacySettings>): Promise<ProfilePrivacySettings> {
        const response = await api.put<ApiResponse<ProfilePrivacySettings>>(
            API_ENDPOINTS.PRIVACY.PROFILE,
            data
        );
        return response.data.data;
    }

    /**
     * Get communication settings
     */
    async getCommunicationSettings(): Promise<CommunicationSettings> {
        const response = await api.get<ApiResponse<CommunicationSettings>>(
            API_ENDPOINTS.PRIVACY.COMMUNICATION
        );
        return response.data.data;
    }

    /**
     * Update communication settings
     */
    async updateCommunicationSettings(data: Partial<CommunicationSettings>): Promise<CommunicationSettings> {
        const response = await api.put<ApiResponse<CommunicationSettings>>(
            API_ENDPOINTS.PRIVACY.COMMUNICATION,
            data
        );
        return response.data.data;
    }

    /**
     * Get search visibility settings
     */
    async getSearchVisibility(): Promise<SearchVisibilitySettings> {
        const response = await api.get<ApiResponse<SearchVisibilitySettings>>(
            API_ENDPOINTS.PRIVACY.SEARCH
        );
        return response.data.data;
    }

    /**
     * Update search visibility settings
     */
    async updateSearchVisibility(data: Partial<SearchVisibilitySettings>): Promise<SearchVisibilitySettings> {
        const response = await api.put<ApiResponse<SearchVisibilitySettings>>(
            API_ENDPOINTS.PRIVACY.SEARCH,
            data
        );
        return response.data.data;
    }

    /**
     * Get account security settings
     */
    async getAccountSecurity(): Promise<AccountSecuritySettings> {
        const response = await api.get<ApiResponse<AccountSecuritySettings>>(
            API_ENDPOINTS.PRIVACY.SECURITY
        );
        return response.data.data;
    }

    /**
     * Update account security settings
     */
    async updateAccountSecurity(data: Partial<AccountSecuritySettings>): Promise<AccountSecuritySettings> {
        const response = await api.put<ApiResponse<AccountSecuritySettings>>(
            API_ENDPOINTS.PRIVACY.SECURITY,
            data
        );
        return response.data.data;
    }
}

export default new PrivacyService();
