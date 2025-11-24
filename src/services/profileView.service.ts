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
     */
    async getWhoViewedMe(params?: { page?: number; limit?: number }): Promise<{
        results: ProfileView[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: ProfileView[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.PROFILE_VIEWS.WHO_VIEWED_ME, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
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
