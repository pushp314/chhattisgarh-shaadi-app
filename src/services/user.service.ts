/**
 * User Service
 * Handles user-related API calls
 */
import apiClient from '../config/api.config';
import { API_ENDPOINTS } from '../config/api.config';

class UserService {
    /**
     * Register FCM Token
     * @param token FCM Token
     * @param deviceId Unique Device ID
     * @param deviceName Device Name
     * @param deviceType Device Type (ANDROID/IOS)
     */
    async registerFcmToken(
        token: string,
        deviceId: string,
        deviceName: string,
        deviceType: 'ANDROID' | 'IOS'
    ) {
        try {
            const response = await apiClient.post(API_ENDPOINTS.USERS.FCM_TOKEN, {
                token,
                deviceId,
                deviceName,
                deviceType,
            });
            return response.data;
        } catch (error: any) {
            console.error('Failed to register FCM token:', error.response?.data || error.message);
            // Don't throw, just log, as this shouldn't block app usage
        }
    }
    /**
     * Get current user details
     */
    async getMe() {
        const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
        return response.data.data;
    }
}

export default new UserService();
