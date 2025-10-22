/**
 * API Client - Axios Instance with Interceptors
 * Centralized HTTP client for EzyFix Backend API
 */

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError, ApiResponse } from '@/types/api';

import axios from 'axios';

// ========================================
// Configuration
// ========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ezyfix.up.railway.app';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;
const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'ezyfix_admin_token';

// Enable logging in development
const ENABLE_LOGGING = process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === 'true';

// ========================================
// Create Axios Instance
// ========================================
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// ========================================
// Request Interceptor
// ========================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log request in development
    if (ENABLE_LOGGING && process.env.NODE_ENV === 'development') {
      // Compute full URL in a robust way to avoid malformed concatenation
      let fullUrl = '';
      try {
        // config.url can be absolute or relative
        fullUrl = new URL(String(config.url), String(config.baseURL)).toString();
      } catch {
        fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      }

      // eslint-disable-next-line no-console
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: fullUrl,
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (ENABLE_LOGGING && process.env.NODE_ENV === 'development') {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  },
);

// ========================================
// Response Interceptor
// ========================================
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (ENABLE_LOGGING && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    // Log error in development
    if (ENABLE_LOGGING && process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle specific error cases
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      // BUT: Don't redirect if we're already on a login page or if this is a login request
      if (status === 401) {
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname || '';
          const isLoginPage = pathname.includes('/login');
          const isLoginRequest = error.config?.url?.includes('/auth/login');

          // Only redirect if not on login page and not a login request
          if (!isLoginPage && !isLoginRequest) {
            // Clear token
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'ezyfix_refresh_token');

            // Portal-aware redirect: if user is on /support routes redirect to support login
            if (pathname.startsWith('/support')) {
              window.location.href = '/support/login';
            } else {
              window.location.href = '/admin/login';
            }
          }
        }
      }
    }

    return Promise.reject(error);
  },
);

// ========================================
// Helper Functions
// ========================================

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    // Check if response has reason first (more specific)
    if (axiosError.response?.data?.reason) {
      return axiosError.response.data.reason;
    }
    // Check if error response has message
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    // Default error messages based on status code
    const status = axiosError.response?.status;
    if (status === 401) {
      return 'Unauthorized. Please login again.';
    }
    if (status === 403) {
      return 'Access denied. You do not have permission.';
    }
    if (status === 404) {
      return 'Resource not found.';
    }
    if (status === 422) {
      return 'Invalid data. Please check your input.';
    }
    if (status && status >= 500) {
      return 'Server error. Please try again later.';
    }
    // Network error
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }

    return axiosError.message || 'An unexpected error occurred.';
  }
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

/**
 * Extract API error object from Axios error
 */
export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    return {
      code: axiosError.code || 'UNKNOWN_ERROR',
      message: getErrorMessage(error),
      statusCode: axiosError.response?.status,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: getErrorMessage(error),
  };
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  return false;
};

/**
 * Set auth token for future requests
 */
export const setAuthToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Clear all auth data
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'ezyfix_refresh_token');
  localStorage.removeItem('ezyfix_user_data'); // Clear user data as well
};

// ========================================
// Export
// ========================================
export default apiClient;

/**
 * Type-safe API request wrapper
 */
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return response.data.data as T;
  } catch (error) {
    throw getApiError(error);
  }
};
