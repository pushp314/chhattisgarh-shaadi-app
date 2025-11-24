/**
 * Subscription Service
 * Handles all subscription-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { SubscriptionPlan, ApiResponse, PaginationResponse } from '../types';

class SubscriptionService {
    /**
     * Get subscription plans
     */
    async getPlans(params?: { page?: number; limit?: number }): Promise<{
        results: SubscriptionPlan[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: SubscriptionPlan[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.SUBSCRIPTION.PLANS, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }
}

export default new SubscriptionService();
