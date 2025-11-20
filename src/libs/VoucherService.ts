/**
 * Voucher Service
 * Handles all voucher management API calls for Admin Portal
 * API Base: /api/v1/admin/vouchers
 */

import type { ApiResponse } from '@/types/api';
import type {
  CreateVoucherRequest,
  CreateVoucherResponse,
  GetVoucherDetailsResponse,
  GetVouchersParams,
  GetVouchersResponse,
  GetVoucherUsageResponse,
  ToggleVoucherStatusRequest,
  ToggleVoucherStatusResponse,
  UpdateVoucherRequest,
  UpdateVoucherResponse,
} from '@/types/voucher';

import axios from 'axios';

// Create axios instance for voucher APIs (has /v1 prefix)
const voucherApiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ezyfix.up.railway.app'}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
voucherApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ezyfix_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

class VoucherService {
  private readonly baseUrl = '/admin/vouchers';

  /**
   * Get all vouchers with filtering and pagination
   * GET /api/v1/admin/vouchers
   */
  async getVouchers(params?: GetVouchersParams): Promise<GetVouchersResponse> {
    const response = await voucherApiClient.get<ApiResponse<GetVouchersResponse>>(this.baseUrl, {
      params: {
        keyword: params?.keyword,
        isActive: params?.isActive,
        includeExpired: params?.includeExpired,
        categoryId: params?.categoryId,
        serviceId: params?.serviceId,
        paymentMethodId: params?.paymentMethodId,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
    });

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch vouchers');
    }

    return response.data.data;
  }

  /**
   * Get voucher details by ID
   * GET /api/v1/admin/vouchers/{voucherId}
   */
  async getVoucherById(voucherId: string): Promise<GetVoucherDetailsResponse> {
    const response = await voucherApiClient.get<ApiResponse<GetVoucherDetailsResponse>>(
      `${this.baseUrl}/${voucherId}`,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch voucher details');
    }

    return response.data.data;
  }

  /**
   * Create new voucher
   * POST /api/v1/admin/vouchers
   */
  async createVoucher(request: CreateVoucherRequest): Promise<CreateVoucherResponse> {
    const response = await voucherApiClient.post<ApiResponse<CreateVoucherResponse>>(
      this.baseUrl,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create voucher');
    }

    return response.data.data;
  }

  /**
   * Update voucher
   * PUT /api/v1/admin/vouchers/{voucherId}
   */
  async updateVoucher(
    voucherId: string,
    request: UpdateVoucherRequest,
  ): Promise<UpdateVoucherResponse> {
    const response = await voucherApiClient.put<ApiResponse<UpdateVoucherResponse>>(
      `${this.baseUrl}/${voucherId}`,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update voucher');
    }

    return response.data.data;
  }

  /**
   * Toggle voucher status (activate/deactivate)
   * POST /api/v1/admin/vouchers/{voucherId}/status
   */
  async toggleStatus(
    voucherId: string,
    request: ToggleVoucherStatusRequest,
  ): Promise<ToggleVoucherStatusResponse> {
    const response = await voucherApiClient.post<ApiResponse<ToggleVoucherStatusResponse>>(
      `${this.baseUrl}/${voucherId}/status`,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to toggle voucher status');
    }

    return response.data.data;
  }

  /**
   * Get voucher usage report
   * GET /api/v1/admin/vouchers/{voucherId}/usage
   */
  async getUsageReport(voucherId: string): Promise<GetVoucherUsageResponse> {
    const response = await voucherApiClient.get<ApiResponse<GetVoucherUsageResponse>>(
      `${this.baseUrl}/${voucherId}/usage`,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch usage report');
    }

    return response.data.data;
  }
}

// Export singleton instance
const voucherService = new VoucherService();
export default voucherService;
