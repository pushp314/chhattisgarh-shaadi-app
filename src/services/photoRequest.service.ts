/**
 * Photo Request Service
 * Handles all photo request related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { PhotoRequest, ApiResponse, PaginationResponse, PhotoRequestStatus } from '../types';

class PhotoRequestService {
    /**
     * Send a photo view request
     */
    async sendRequest(data: {
        photoId: number;
        message?: string;
    }): Promise<PhotoRequest> {
        const response = await api.post<ApiResponse<PhotoRequest>>(
            API_ENDPOINTS.PHOTO_REQUESTS.CREATE,
            data
        );
        return response.data.data;
    }

    /**
     * Get sent photo view requests
     */
    async getSentRequests(params?: { page?: number; limit?: number; status?: PhotoRequestStatus }): Promise<{
        results: PhotoRequest[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: PhotoRequest[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.PHOTO_REQUESTS.SENT, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Get received photo view requests
     */
    async getReceivedRequests(params?: { page?: number; limit?: number; status?: PhotoRequestStatus }): Promise<{
        results: PhotoRequest[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: PhotoRequest[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.PHOTO_REQUESTS.RECEIVED, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Respond to a photo view request
     */
    async respondToRequest(id: number, status: PhotoRequestStatus): Promise<PhotoRequest> {
        const response = await api.post<ApiResponse<PhotoRequest>>(
            API_ENDPOINTS.PHOTO_REQUESTS.RESPOND(id),
            { status }
        );
        return response.data.data;
    }
}

export default new PhotoRequestService();
