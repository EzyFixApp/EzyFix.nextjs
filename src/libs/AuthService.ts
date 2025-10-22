/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '@/types/api';
import { getRoleFromJWT } from '@/utils/jwt';

import apiClient, { clearAuthData, setAuthToken } from './ApiClient';

// ========================================
// Constants
// ========================================
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/delete-refresh-token',
  REFRESH: '/auth/refresh-token',
  ME: '/auth/me',
  VERIFY: '/auth/verify',
  FORGOT_PASSWORD: '/auth/forgot-password',
  CHANGE_PASSWORD: '/auth/change-password',
  DELETE_REFRESH_TOKEN: '/auth/delete-refresh-token',
} as const;

const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'ezyfix_refresh_token';

// ========================================
// Auth Service Class
// ========================================
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials,
    );

    const apiResponse = response.data;

    // Check if login was successful
    if (apiResponse.is_success && apiResponse.data) {
      // Store tokens
      if (apiResponse.data.accessToken) {
        setAuthToken(apiResponse.data.accessToken);
      }

      if (apiResponse.data.refreshToken) {
        this.setRefreshToken(apiResponse.data.refreshToken);
      }

      // Store user data in localStorage for getCurrentUser()
      if (typeof window !== 'undefined') {
        const userData = {
          id: apiResponse.data.id,
          email: apiResponse.data.email,
          fullName: apiResponse.data.fullName,
          avatarLink: apiResponse.data.avatarLink,
          isActive: apiResponse.data.isActive,
          isPasswordExpired: apiResponse.data.isPasswordExpired,
        };
        localStorage.setItem('ezyfix_user_data', JSON.stringify(userData));
      }
    }

    return apiResponse;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      userData,
    );

    const apiResponse = response.data;

    // Check if registration was successful
    if (apiResponse.is_success && apiResponse.data) {
      // Store tokens
      if (apiResponse.data.accessToken) {
        setAuthToken(apiResponse.data.accessToken);
      }

      if (apiResponse.data.refreshToken) {
        this.setRefreshToken(apiResponse.data.refreshToken);
      }
    }

    return apiResponse;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();

      // If we have a refresh token, revoke it on the backend
      if (refreshToken) {
        await apiClient.delete(AUTH_ENDPOINTS.LOGOUT, {
          params: { refreshToken },
        });
      }
    } catch {
      // Silent fail - will clear local data in finally block anyway
    } finally {
      // Always clear local data even if API call fails
      clearAuthData();
    }
  }

  /**
   * Get current authenticated user
   * Read from localStorage and decode JWT token
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Check if we have a valid token
      if (!this.isAuthenticated()) {
        return null;
      }

      // Get token from localStorage
      const token = typeof window !== 'undefined'
        ? localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'ezyfix_admin_token')
        : null;

      if (!token) {
        return null;
      }

      // Decode JWT to get user info
      const role = getRoleFromJWT(token);

      // Get user data from localStorage (saved during login)
      const userDataStr = typeof window !== 'undefined'
        ? localStorage.getItem('ezyfix_user_data')
        : null;

      if (!userDataStr) {
        // If no user data in localStorage, we only have the token
        // We can't fetch from /auth/me because it doesn't exist
        // So we return null and user will need to login again
        return null;
      }

      const userData = JSON.parse(userDataStr) as AuthUser;

      return {
        ...userData,
        role: role || undefined,
      };
    } catch {
      // Silent fail - return null
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const payload: RefreshTokenRequest = { refreshToken };

      const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.REFRESH,
        payload,
      );

      const apiResponse = response.data;

      // Update tokens if successful
      if (apiResponse.is_success && apiResponse.data) {
        if (apiResponse.data.accessToken) {
          setAuthToken(apiResponse.data.accessToken);
        }

        if (apiResponse.data.refreshToken) {
          this.setRefreshToken(apiResponse.data.refreshToken);
        }
      }

      return apiResponse;
    } catch {
      // If refresh fails, clear all auth data
      clearAuthData();
      return null;
    }
  }

  /**
   * Verify email/phone with code
   */
  async verify(code: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.VERIFY, { code });
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  }

  /**
   * Delete refresh token (logout from specific device)
   */
  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await apiClient.delete(AUTH_ENDPOINTS.DELETE_REFRESH_TOKEN, {
      data: { refreshToken },
    });
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const token = localStorage.getItem(
      process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'ezyfix_admin_token',
    );
    return !!token;
  }

  /**
   * Store refresh token
   */
  private setRefreshToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  /**
   * Get refresh token
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
}

// ========================================
// Export Singleton Instance
// ========================================
const authService = new AuthService();
export default authService;
