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
        await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
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

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<number> {
        const response = await api.get<ApiResponse<{ count: number }>>(
            API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
        );
        return response.data.data.count;
    }

    /**
     * Mark a single notification as read
     */
    async markAsRead(notificationId: number): Promise<void> {
        await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(notificationId));
    }

    /**
     * Delete a single notification
     */
    async deleteNotification(notificationId: number): Promise<void> {
        await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId));
    }

    /**
     * Delete all notifications
     */
    async deleteAllNotifications(): Promise<void> {
        await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
    }
}

export default new NotificationService();
