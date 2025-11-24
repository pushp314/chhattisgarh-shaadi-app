/**
 * Report Service
 * Handles all report-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Report, ApiResponse, ReportType } from '../types';

class ReportService {
    /**
     * Report a user
     */
    async reportUser(data: {
        reportedUserId: number;
        reason: string;
        description?: string;
        reportType: ReportType;
    }): Promise<Report> {
        const response = await api.post<ApiResponse<Report>>(
            API_ENDPOINTS.REPORTS.CREATE,
            data
        );
        return response.data.data;
    }
}

export default new ReportService();
