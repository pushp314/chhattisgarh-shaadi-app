/**
 * Block Service
 * Handles all block/unblock related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { BlockedUser, ApiResponse, PaginationResponse } from '../types';

class BlockService {
    /**
     * Block a user
     */
    async blockUser(blockedId: number, reason?: string): Promise<void> {
        await api.post(API_ENDPOINTS.BLOCK.CREATE, { blockedId, reason });
    }

    /**
     * Get blocked users list
     */
    async getBlockedList(params?: { page?: number; limit?: number }): Promise<{
        results: BlockedUser[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: BlockedUser[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.BLOCK.LIST, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Unblock a user
     */
    async unblockUser(blockedId: number): Promise<void> {
        await api.delete(API_ENDPOINTS.BLOCK.DELETE(blockedId));
    }
}

export default new BlockService();
