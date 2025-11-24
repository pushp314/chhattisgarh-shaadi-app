/**
 * Notification Service
 * Handles all notification-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Notification, ApiResponse, PaginationResponse } from '../types';

class NotificationService {
    /**
     * Get my notifications
     */
    async getNotifications(params?: { page?: number; limit?: number }): Promise<{
        results: Notification[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: Notification[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Mark notifications as read
     */
    async markRead(): Promise<void> {
        await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ);
    }

    /**
     * Get notification settings
     */
    async getSettings(): Promise<any> {
        const response = await api.get<ApiResponse<any>>(
            API_ENDPOINTS.NOTIFICATIONS.SETTINGS
        );
        return response.data.data;
    }

    /**
     * Update notification settings
     */
    async updateSettings(settings: any): Promise<any> {
        const response = await api.put<ApiResponse<any>>(
            API_ENDPOINTS.NOTIFICATIONS.SETTINGS,
            settings
        );
        return response.data.data;
    }
}

export default new NotificationService();
