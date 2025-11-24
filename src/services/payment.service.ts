/**
 * Payment Service
 * Handles all payment-related API calls
 */

import api from './api.service';
import { API_ENDPOINTS } from '../config/api.config';
import { Payment, PaymentOrder, ApiResponse } from '../types';

class PaymentService {
    /**
     * Create a payment order
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
    }): Promise<{
        paymentId: number;
        status: string;
        planId: number;
    }> {
        const response = await api.post<ApiResponse<{
            paymentId: number;
            status: string;
            planId: number;
        }>>(API_ENDPOINTS.PAYMENTS.VERIFY, data);
        return response.data.data;
    }

    /**
     * Get my payment history
     */
    async getMyPayments(): Promise<Payment[]> {
        const response = await api.get<ApiResponse<Payment[]>>(
            API_ENDPOINTS.PAYMENTS.MY_PAYMENTS
        );
        return response.data.data;
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
