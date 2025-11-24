/**
 * Contact Request Service
 * Handles all contact request related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ContactRequest, ApiResponse, PaginationResponse, ContactRequestStatus, ContactRequestType } from '../types';

class ContactRequestService {
    /**
     * Create a contact request
     */
    async createContactRequest(data: {
        profileId: number;
        requestType: ContactRequestType;
        message?: string;
    }): Promise<ContactRequest> {
        const response = await api.post<ApiResponse<ContactRequest>>(
            API_ENDPOINTS.CONTACT_REQUESTS.CREATE,
            data
        );
        return response.data.data;
    }

    /**
     * Get sent contact requests
     */
    async getSentRequests(params?: { page?: number; limit?: number; status?: ContactRequestStatus }): Promise<{
        results: ContactRequest[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: ContactRequest[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.CONTACT_REQUESTS.SENT, { params });

        // The API returns the pagination data at the root of the data object, 
        // but our types expect it to be separate or part of the response structure.
        // Based on Backend_API.md, the response data contains results, page, limit, etc.
        // We'll map it to our return type.
        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Get received contact requests
     */
    async getReceivedRequests(params?: { page?: number; limit?: number; status?: ContactRequestStatus }): Promise<{
        results: ContactRequest[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: ContactRequest[];
            pagination: PaginationResponse;
        }>>(API_ENDPOINTS.CONTACT_REQUESTS.RECEIVED, { params });

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Respond to a contact request
     */
    async respondToRequest(id: number, status: ContactRequestStatus): Promise<ContactRequest> {
        const response = await api.post<ApiResponse<ContactRequest>>(
            API_ENDPOINTS.CONTACT_REQUESTS.RESPOND(id),
            { status }
        );
        return response.data.data;
    }
}

export default new ContactRequestService();
