import type { ApiResponse } from '@/types/api';
import type {
  AdminWalletPayout,
  ApprovePayoutRequest,
  GetPayoutsParams,
  MarkPaidRequest,
  PayoutsResponse,
  RejectPayoutRequest,
} from '@/types/wallet';

import apiClient from './ApiClient';

/**
 * WalletService - Admin Wallet & Payout Management
 * Handles payout requests from technicians
 */
class WalletService {
  private readonly basePath = '/admin/payouts';

  /**
   * Get paginated list of payout requests
   * @param params - Filter and pagination parameters
   */
  async getAllPayouts(
    params: GetPayoutsParams = {},
  ): Promise<PayoutsResponse> {
    const response = await apiClient.get<ApiResponse<PayoutsResponse>>(
      this.basePath,
      { params },
    );
    return response.data.data;
  }

  /**
   * Approve a payout request
   * Generates VietQR payload and image
   * @param payoutId - Payout request ID
   * @param request - Approval request with purpose
   */
  async approvePayout(
    payoutId: string,
    request: ApprovePayoutRequest,
  ): Promise<AdminWalletPayout> {
    const response = await apiClient.post<ApiResponse<AdminWalletPayout>>(
      `${this.basePath}/${payoutId}/approve`,
      request,
    );
    return response.data.data;
  }

  /**
   * Mark payout as paid
   * Creates wallet debit transaction and releases hold
   * @param payoutId - Payout request ID
   * @param request - Optional proof note and reference number
   */
  async markPaid(
    payoutId: string,
    request: MarkPaidRequest = {},
  ): Promise<AdminWalletPayout> {
    const response = await apiClient.post<ApiResponse<AdminWalletPayout>>(
      `${this.basePath}/${payoutId}/mark-paid`,
      request,
    );
    return response.data.data;
  }

  /**
   * Reject a payout request
   * Releases hold amount
   * @param payoutId - Payout request ID
   * @param request - Rejection reason
   */
  async rejectPayout(
    payoutId: string,
    request: RejectPayoutRequest,
  ): Promise<AdminWalletPayout> {
    const response = await apiClient.post<ApiResponse<AdminWalletPayout>>(
      `${this.basePath}/${payoutId}/reject`,
      request,
    );
    return response.data.data;
  }
}

export default new WalletService();
