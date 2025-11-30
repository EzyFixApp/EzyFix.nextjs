/**
 * User Service
 * Handles all user management API calls for Admin Portal
 * Note: User APIs don't have /v1 prefix, different from other APIs
 */

import type { ApiResponse } from '@/types/api';
import type {
  ChangeRoleRequest,
  ChangeRoleResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetUsersParams,
  GetUsersResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateStatusRequest,
  UpdateStatusResponse,
  UserDetails,
  VerifyUserRequest,
  VerifyUserResponse,
} from '@/types/user';

import axios from 'axios';

import { getAccessToken } from '@/utils/storage';

// Create a separate axios instance for user APIs (no /v1 prefix)
const userApiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ezyfix.up.railway.app'}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
userApiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

class UserService {
  private readonly baseUrl = '/admin/users';

  /**
   * Get all users with filtering and pagination
   * GET /api/admin/users (no /v1)
   */
  async getAllUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const response = await userApiClient.get<ApiResponse<GetUsersResponse>>(this.baseUrl, {
      params: {
        role: params?.role,
        isActive: params?.isActive,
        isVerified: params?.isVerified,
        searchKeyword: params?.searchKeyword,
        fromDate: params?.fromDate,
        toDate: params?.toDate,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
    });

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch users');
    }

    return response.data.data;
  }

  /**
   * Get user details by ID
   * GET /api/admin/users/{id} (no /v1)
   */
  async getUserById(userId: string): Promise<UserDetails> {
    const response = await userApiClient.get<ApiResponse<UserDetails>>(
      `${this.baseUrl}/${userId}`,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user details');
    }

    return response.data.data;
  }

  /**
   * Update user status (activate/deactivate)
   * PATCH /api/admin/users/{id}/status (no /v1)
   */
  async updateStatus(
    userId: string,
    request: UpdateStatusRequest,
  ): Promise<UpdateStatusResponse> {
    const response = await userApiClient.patch<ApiResponse<UpdateStatusResponse>>(
      `${this.baseUrl}/${userId}/status`,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update user status');
    }

    return response.data.data;
  }

  /**
   * Verify user email manually
   * PATCH /api/admin/users/{id}/verify (no /v1)
   */
  async verifyUser(
    userId: string,
    request: VerifyUserRequest,
  ): Promise<VerifyUserResponse> {
    const response = await userApiClient.patch<ApiResponse<VerifyUserResponse>>(
      `${this.baseUrl}/${userId}/verify`,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to verify user');
    }

    return response.data.data;
  }

  /**
   * Change user role
   * PATCH /api/admin/users/{id}/role (no /v1)
   */
  async changeRole(
    userId: string,
    request: ChangeRoleRequest,
  ): Promise<ChangeRoleResponse> {
    const response = await userApiClient.patch<ApiResponse<ChangeRoleResponse>>(
      `${this.baseUrl}/${userId}/role`,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to change user role');
    }

    return response.data.data;
  }

  /**
   * Delete user (soft delete by default)
   * DELETE /api/admin/users/{id} (no /v1)
   */
  async deleteUser(
    userId: string,
    request: DeleteUserRequest,
    hardDelete: boolean = false,
  ): Promise<DeleteUserResponse> {
    const response = await userApiClient.delete<ApiResponse<DeleteUserResponse>>(
      `${this.baseUrl}/${userId}`,
      {
        params: { hardDelete },
        data: request,
      },
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to delete user');
    }

    return response.data.data;
  }

  /**
   * Reset user password
   * PATCH /api/admin/users/{id}/reset-password (no /v1)
   */
  async resetPassword(
    userId: string,
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const response = await userApiClient.patch<ApiResponse<ResetPasswordResponse>>(
      `${this.baseUrl}/${userId}/reset-password`,
      request,
    );

    if (!response.data.is_success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to reset password');
    }

    return response.data.data;
  }
}

// Export singleton instance
const userService = new UserService();
export default userService;
