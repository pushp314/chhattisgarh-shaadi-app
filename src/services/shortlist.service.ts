/**
 * Shortlist Service
 * Handles all shortlist-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Shortlist, ApiResponse, PaginationResponse } from '../types';

class ShortlistService {
    /**
     * Add to shortlist
     */
    async addToShortlist(userId: number): Promise<void> {
        await api.post(API_ENDPOINTS.SHORTLISTS.CREATE, { shortlistedUserId: userId });
    }

    /**
     * Get my shortlist
     */
    async getShortlist(params?: { page?: number; limit?: number }): Promise<{
        results: Shortlist[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            profiles: Shortlist[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.SHORTLISTS.LIST, { params });

        // Backend returns 'profiles', map to 'results' for consistent frontend usage
        const { profiles, pagination } = response.data.data || { profiles: [], pagination: {} };
        return { results: profiles || [], pagination: pagination as PaginationResponse };
    }

    /**
     * Remove from shortlist
     */
    async removeFromShortlist(userId: number): Promise<void> {
        await api.delete(API_ENDPOINTS.SHORTLISTS.DELETE(userId));
    }
}

export default new ShortlistService();
