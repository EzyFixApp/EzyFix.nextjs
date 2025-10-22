/**
 * Service Types
 * Type definitions for Service management
 */

// ========================================
// Service Types
// ========================================

export type Service = {
  id: string;
  categoryId: string;
  categoryName?: string;
  serviceName: string;
  description: string;
  serviceIconUrl?: string;
  basePrice: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateServiceRequest = {
  categoryId: string;
  serviceName: string;
  description: string;
  serviceIconUrl?: File | string;
  basePrice: number;
};

export type UpdateServiceRequest = {
  categoryId?: string;
  serviceName?: string;
  description?: string;
  serviceIconUrl?: File | string;
  basePrice?: number;
  isActive?: boolean;
};

export type ServiceResponse = {
  id: string;
  categoryId: string;
  serviceName: string;
  description: string;
  serviceIconUrl: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ========================================
// Category Types (for Service dropdown)
// ========================================

export type Category = {
  id: string;
  categoryName: string;
  description?: string;
  isActive: boolean;
};
