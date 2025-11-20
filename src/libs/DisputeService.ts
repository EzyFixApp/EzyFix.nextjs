/**
 * Dispute Service
 * Handles all dispute-related API calls for Support Portal
 * Note: Dispute APIs don't have /v1 prefix, different from other APIs
 */

import type { ApiResponse } from '@/types/api';
import type {
  AddDisputeMessageRequest,
  DisputeDetails,
  GetDisputesParams,
  GetDisputesResponse,
  ResolveDisputeRequest,
  ReviewDisputeRequest,
} from '@/types/dispute';

import axios from 'axios';

// Create a separate axios instance for dispute APIs (no /v1 prefix)
const disputeApiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ezyfix.up.railway.app'}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
disputeApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ezyfix_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

class DisputeService {
  private readonly baseUrl = '/admin/disputes';

  /**
   * Get all disputes with filtering and pagination
   * GET /api/admin/disputes (no /v1)
   */
  async getAllDisputes(params?: GetDisputesParams): Promise<GetDisputesResponse> {
    const response = await disputeApiClient.get<ApiResponse<GetDisputesResponse>>(this.baseUrl, {
      params: {
        status: params?.status,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    });

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch disputes');
    }

    return response.data.data;
  }

  /**
   * Get dispute details by ID
   * GET /api/admin/disputes/{id} (no /v1)
   */
  async getDisputeById(disputeId: string): Promise<DisputeDetails> {
    const response = await disputeApiClient.get<ApiResponse<DisputeDetails>>(
      `${this.baseUrl}/${disputeId}`,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch dispute details');
    }

    return response.data.data;
  }

  /**
   * Start reviewing a dispute (Open → InReview)
   * PATCH /api/admin/disputes/{id}/review (no /v1)
   */
  async reviewDispute(
    disputeId: string,
    request: ReviewDisputeRequest,
  ): Promise<boolean> {
    const response = await disputeApiClient.patch<ApiResponse<boolean>>(
      `${this.baseUrl}/${disputeId}/review`,
      request,
    );

    if (!response.data.is_success) {
      throw new Error(response.data.message || 'Failed to start review');
    }

    return response.data.data ?? true;
  }

  /**
   * Resolve a dispute with decision
   * PATCH /api/admin/disputes/{id}/resolve (no /v1)
   */
  async resolveDispute(
    disputeId: string,
    request: ResolveDisputeRequest,
  ): Promise<boolean> {
    const response = await disputeApiClient.patch<ApiResponse<boolean>>(
      `${this.baseUrl}/${disputeId}/resolve`,
      request,
    );

    if (!response.data.is_success) {
      throw new Error(response.data.message || 'Failed to resolve dispute');
    }

    return response.data.data ?? true;
  }

  /**
   * Add supporter message to dispute
   * POST /api/admin/disputes/{id}/messages (no /v1)
   */
  async addMessage(
    disputeId: string,
    request: AddDisputeMessageRequest,
  ): Promise<boolean> {
    const response = await disputeApiClient.post<ApiResponse<boolean>>(
      `${this.baseUrl}/${disputeId}/messages`,
      request,
    );

    if (!response.data.is_success) {
      throw new Error(response.data.message || 'Failed to add message');
    }

    return response.data.data ?? true;
  }
}

// Export singleton instance
const disputeService = new DisputeService();
export default disputeService;
