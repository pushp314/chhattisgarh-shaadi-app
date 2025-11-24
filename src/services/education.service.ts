/**
 * Education Service
 * Handles all education-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Education, ApiResponse } from '../types';

class EducationService {
    /**
     * Create education record
     */
    async createEducation(data: Partial<Education>): Promise<Education> {
        const response = await api.post<ApiResponse<Education>>(
            API_ENDPOINTS.EDUCATION.CREATE,
            data
        );
        return response.data.data;
    }

    /**
     * Get my education records
     */
    async getMyEducation(): Promise<Education[]> {
        const response = await api.get<ApiResponse<Education[]>>(
            API_ENDPOINTS.EDUCATION.LIST
        );
        return response.data.data;
    }

    /**
     * Update education record
     */
    async updateEducation(id: number, data: Partial<Education>): Promise<Education> {
        const response = await api.put<ApiResponse<Education>>(
            API_ENDPOINTS.EDUCATION.BY_ID(id),
            data
        );
        return response.data.data;
    }

    /**
     * Delete education record
     */
    async deleteEducation(id: number): Promise<void> {
        await api.delete(API_ENDPOINTS.EDUCATION.BY_ID(id));
    }
}

export default new EducationService();
