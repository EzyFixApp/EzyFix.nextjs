/**
 * Generic API Response Types for EzyFix Backend
 * Following backend API structure from OpenAPI spec
 */

// ========================================
// Generic API Response Wrapper
// ========================================
export type ApiResponse<T = any> = {
  status_code: number;
  message: string;
  reason: string | null;
  is_success: boolean;
  data: T;
};

// ========================================
// API Error Types
// ========================================
export type ApiError = {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
};

export type ValidationError = {
  field: string;
  message: string;
};

// ========================================
// Pagination Types
// ========================================
export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationMeta;
};

// ========================================
// Filter Types
// ========================================
export type FilterParams = {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  [key: string]: any;
};

// ========================================
// Authentication Types
// ========================================
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleId?: string;
};

// Login Response Data (from backend API)
export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  avatarLink: string | null;
  isPasswordExpired: boolean;
};

export type AuthResponse = ApiResponse<LoginResponseData>;

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  avatarLink?: string | null;
  isActive: boolean;
  isPasswordExpired: boolean;
  role?: string; // Role from JWT token
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

// ========================================
// Request Config Types
// ========================================
export type RequestConfig = {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
};

// ========================================
// HTTP Status Codes
// ========================================
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// ========================================
// API Error Codes
// ========================================
export enum ApiErrorCode {
  // Auth errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Resource errors
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
}

// ========================================
// Loading States
// ========================================
export type LoadingState = {
  isLoading: boolean;
  isRefetching?: boolean;
  isLoadingMore?: boolean;
};

export type ErrorState = {
  hasError: boolean;
  error?: ApiError | null;
  errorMessage?: string;
};

// ========================================
// Query Params Builder
// ========================================
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

// ========================================
// File Upload Types
// ========================================
export type FileUploadResponse = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};
