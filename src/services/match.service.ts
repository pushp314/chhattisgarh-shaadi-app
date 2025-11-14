/**
 * Match Service
 * Handles all match request-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { MatchRequest, MatchStatus, ApiResponse, PaginationParams, PaginationResponse } from '../types';

class MatchService {
  /**
   * Send match request
   */
  async sendMatchRequest(receiverId: number, message?: string): Promise<MatchRequest> {
    const response = await api.post<ApiResponse<MatchRequest>>(
      API_ENDPOINTS.MATCHES.CREATE,
      {
        receiverId,
        message,
      }
    );
    return response.data.data;
  }

  /**
   * Get sent match requests
   */
  async getSentMatches(
    params?: PaginationParams & { status?: MatchStatus }
  ): Promise<{
    matches: MatchRequest[];
    pagination: PaginationResponse;
  }> {
    const response = await api.get<ApiResponse<{
      matches: MatchRequest[];
      pagination: PaginationResponse;
    }>>(API_ENDPOINTS.MATCHES.SENT, { params });
    return response.data.data;
  }

  /**
   * Get received match requests
   */
  async getReceivedMatches(
    params?: PaginationParams & { status?: MatchStatus }
  ): Promise<{
    matches: MatchRequest[];
    pagination: PaginationResponse;
  }> {
    const response = await api.get<ApiResponse<{
      matches: MatchRequest[];
      pagination: PaginationResponse;
    }>>(API_ENDPOINTS.MATCHES.RECEIVED, { params });
    return response.data.data;
  }

  /**
   * Get accepted matches
   */
  async getAcceptedMatches(
    params?: PaginationParams
  ): Promise<{
    matches: MatchRequest[];
    pagination: PaginationResponse;
  }> {
    const response = await api.get<ApiResponse<{
      matches: MatchRequest[];
      pagination: PaginationResponse;
    }>>(API_ENDPOINTS.MATCHES.ACCEPTED, { params });
    return response.data.data;
  }

  /**
   * Accept match request
   */
  async acceptMatch(matchId: number, responseMessage?: string): Promise<MatchRequest> {
    const response = await api.post<ApiResponse<MatchRequest>>(
      API_ENDPOINTS.MATCHES.ACCEPT(matchId),
      { responseMessage }
    );
    return response.data.data;
  }

  /**
   * Reject match request
   */
  async rejectMatch(matchId: number, responseMessage?: string): Promise<MatchRequest> {
    const response = await api.post<ApiResponse<MatchRequest>>(
      API_ENDPOINTS.MATCHES.REJECT(matchId),
      { responseMessage }
    );
    return response.data.data;
  }

  /**
   * Cancel/delete match
   */
  async deleteMatch(matchId: number): Promise<void> {
    await api.delete(API_ENDPOINTS.MATCHES.DELETE(matchId));
  }
}

export default new MatchService();
