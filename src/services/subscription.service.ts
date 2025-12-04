/**
 * Subscription Service
 * Handles all subscription-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Subscription, SubscriptionPlan, ApiResponse, PaginationResponse } from '../types';
import userService from './user.service';

class SubscriptionService {
    /**
     * Get subscription plans
     */
    async getPlans(params?: { page?: number; limit?: number }): Promise<{
        results: SubscriptionPlan[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<any>>(
            API_ENDPOINTS.SUBSCRIPTION.PLANS,
            { params }
        );

        const data = response.data.data;

        // Handle both formats: direct array or paginated response
        if (Array.isArray(data)) {
            // Backend returned array directly
            return {
                results: data,
                pagination: {
                    page: 1,
                    limit: data.length,
                    totalPages: 1,
                    total: data.length,
                },
            };
        } else if (data && typeof data === 'object') {
            // Backend returned paginated response - check for 'plans' or 'results' field
            const plans = data.plans || data.results;
            if (plans && Array.isArray(plans)) {
                return {
                    results: plans,
                    pagination: data.pagination || {
                        page: 1,
                        limit: plans.length,
                        totalPages: 1,
                        total: plans.length,
                    },
                };
            }
        }

        // Unexpected format
        console.warn('Unexpected subscription plans response format:', data);
        return {
            results: [],
            pagination: {
                page: 1,
                limit: 0,
                totalPages: 0,
                total: 0,
            },
        };
    }

    /**
     * Get current user's subscription
     */
    async getCurrentSubscription(): Promise<Subscription | null> {
        try {
            // Fetch user details which includes subscription info
            const user = await userService.getMe();
            return user.subscription || null;
        } catch (error) {
            console.error('Error fetching subscription:', error);
            return null;
        }
    }
}

export default new SubscriptionService();
