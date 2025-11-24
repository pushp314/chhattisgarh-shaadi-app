/**
 * Partner Preference Service
 * Handles all partner preference related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { PartnerPreference, ApiResponse } from '../types';

class PartnerPreferenceService {
    /**
     * Get my partner preferences
     */
    async getMyPreferences(): Promise<PartnerPreference> {
        const response = await api.get<ApiResponse<PartnerPreference>>(
            API_ENDPOINTS.PARTNER_PREFERENCE.GET
        );
        return response.data.data;
    }

    /**
     * Update my partner preferences
     */
    async updatePreferences(data: Partial<PartnerPreference>): Promise<PartnerPreference> {
        const response = await api.put<ApiResponse<PartnerPreference>>(
            API_ENDPOINTS.PARTNER_PREFERENCE.UPDATE,
            data
        );
        return response.data.data;
    }
}

export default new PartnerPreferenceService();
