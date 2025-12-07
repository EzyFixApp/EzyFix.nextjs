import type { ApiResponse } from '@/types/api';
import type {
  GetPaymentsParams,
  PaymentDetails,
  PaymentsResponse,
} from '@/types/payment';

import ApiClient from './ApiClient';

/**
 * PaymentService - Admin Payment Management API
 */
class PaymentService {
  /**
   * Get all payments with filters
   */
  async getAllPayments(params: GetPaymentsParams = {}): Promise<PaymentsResponse> {
    try {
      const response = await ApiClient.get<ApiResponse<PaymentsResponse>>('/admin/payments', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  /**
   * Get payment details by ID
   */
  async getPaymentById(paymentId: string): Promise<PaymentDetails> {
    try {
      const response = await ApiClient.get<ApiResponse<PaymentDetails>>(`/admin/payments/${paymentId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching payment ${paymentId}:`, error);
      throw error;
    }
  }
}

export default new PaymentService();
