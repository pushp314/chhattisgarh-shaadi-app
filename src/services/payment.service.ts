/**
 * Payment Service
 * Handles all payment-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { ApiResponse, PaginationResponse } from '../types';

interface PaymentOrder {
    orderId: string;
    amount: number;
    currency: string;
    razorpayKey: string;
}

interface PaymentVerification {
    success: boolean;
    subscription?: any;
    message?: string;
}

export interface Payment {
    id: number;
    userId: number;
    subscriptionId?: number;
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    paymentMethod?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    createdAt: string;
    updatedAt: string;
    subscription?: any;
}

class PaymentService {
    /**
     * Create payment order
     */
    async createOrder(planId: number): Promise<PaymentOrder> {
        const response = await api.post<ApiResponse<PaymentOrder>>(
            API_ENDPOINTS.PAYMENTS.CREATE_ORDER,
            { planId }
        );
        return response.data.data;
    }

    /**
     * Verify payment
     */
    async verifyPayment(data: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<PaymentVerification> {
        const response = await api.post<ApiResponse<PaymentVerification>>(
            API_ENDPOINTS.PAYMENTS.VERIFY,
            data
        );
        return response.data.data;
    }

    /**
     * Get user's payment history
     */
    async getMyPayments(params?: {
        page?: number;
        limit?: number;
        status?: 'SUCCESS' | 'FAILED' | 'PENDING';
    }): Promise<{
        results: Payment[];
        pagination: PaginationResponse;
    }> {
        const response = await api.get<ApiResponse<{
            results: Payment[];
            pagination: PaginationResponse;
        }>>(
            API_ENDPOINTS.PAYMENTS.MY_PAYMENTS,
            { params }
        );

        const { results, ...pagination } = response.data.data as any;
        return { results, pagination };
    }

    /**
     * Get payment by ID
     */
    async getPaymentById(paymentId: number): Promise<Payment> {
        const response = await api.get<ApiResponse<Payment>>(
            API_ENDPOINTS.PAYMENTS.BY_ID(paymentId)
        );
        return response.data.data;
    }
}

export default new PaymentService();
