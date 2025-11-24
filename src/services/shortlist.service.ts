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
    async addToShortlist(profileId: number): Promise<void> {
        await api.post(API_ENDPOINTS.SHORTLISTS.CREATE, { profileId });
    }

    /**
     * Get my shortlist
     */
    async getShortlist(params?: { page?: number; limit?: number }): Promise<{
        results: Shortlist[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: Shortlist[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.SHORTLISTS.LIST, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Remove from shortlist
     */
    async removeFromShortlist(profileId: number): Promise<void> {
        await api.delete(API_ENDPOINTS.SHORTLISTS.DELETE(profileId));
    }
}

export default new ShortlistService();
