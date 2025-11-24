/**
 * Occupation Service
 * Handles all occupation-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Occupation, ApiResponse } from '../types';

class OccupationService {
    /**
     * Create occupation record
     */
    async createOccupation(data: Partial<Occupation>): Promise<Occupation> {
        const response = await api.post<ApiResponse<Occupation>>(
            API_ENDPOINTS.OCCUPATION.CREATE,
            data
        );
        return response.data.data;
    }

    /**
     * Get my occupation records
     */
    async getMyOccupation(): Promise<Occupation[]> {
        const response = await api.get<ApiResponse<Occupation[]>>(
            API_ENDPOINTS.OCCUPATION.LIST
        );
        return response.data.data;
    }

    /**
     * Update occupation record
     */
    async updateOccupation(id: number, data: Partial<Occupation>): Promise<Occupation> {
        const response = await api.put<ApiResponse<Occupation>>(
            API_ENDPOINTS.OCCUPATION.BY_ID(id),
            data
        );
        return response.data.data;
    }

    /**
     * Delete occupation record
     */
    async deleteOccupation(id: number): Promise<void> {
        await api.delete(API_ENDPOINTS.OCCUPATION.BY_ID(id));
    }
}

export default new OccupationService();
