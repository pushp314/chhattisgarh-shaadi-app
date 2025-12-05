/**
 * Profile View Service
 * Handles all profile view tracking related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ProfileView, ApiResponse, PaginationResponse } from '../types';

class ProfileViewService {
    /**
     * Log a profile view
     */
    async logView(profileId: number, isAnonymous?: boolean): Promise<ProfileView> {
        const response = await api.post<ApiResponse<ProfileView>>(
            API_ENDPOINTS.PROFILE_VIEWS.LOG,
            { profileId, isAnonymous }
        );
        return response.data.data;
    }

    /**
     * Get who viewed my profile
     * Note: Free users only see last 2 viewers
     */
    async getWhoViewedMe(params?: { page?: number; limit?: number }): Promise<{
        results: ProfileView[];
        pagination: PaginationResponse;
        isPremium?: boolean;
        totalViewers?: number;
        message?: string | null;
    }> {
        const response = await api.get<ApiResponse<{
            profiles: ProfileView[];
            pagination: PaginationResponse;
            isPremium: boolean;
            totalViewers: number;
            message: string | null;
        }>>(API_ENDPOINTS.PROFILE_VIEWS.WHO_VIEWED_ME, { params });

        const data = response.data.data;
        return {
            results: data.profiles,
            pagination: data.pagination,
            isPremium: data.isPremium,
            totalViewers: data.totalViewers,
            message: data.message,
        };
    }

    /**
     * Get my view history
     */
    async getMyViewHistory(params?: { page?: number; limit?: number }): Promise<{
        results: ProfileView[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: ProfileView[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.PROFILE_VIEWS.MY_HISTORY, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }
}

export default new ProfileViewService();
