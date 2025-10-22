/**
 * Service Service
 * Handles all service management API calls
 */

import type { ApiResponse } from '@/types/api';
import type {
  CreateServiceRequest,
  ServiceResponse,
  UpdateServiceRequest,
} from '@/types/service';

import apiClient from './ApiClient';

// ========================================
// Constants
// ========================================
const SERVICE_ENDPOINTS = {
  GET_ALL: '/services',
  GET_BY_ID: (id: string) => `/services/${id}`,
  CREATE: '/services',
  UPDATE: (id: string) => `/services/${id}/update`,
  DELETE: (id: string) => `/services/${id}/delete`,
} as const;

// ========================================
// Service Service Class
// ========================================
class ServiceService {
  /**
   * Get all services
   */
  async getAllServices(): Promise<ServiceResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<ServiceResponse[]>>(
        SERVICE_ENDPOINTS.GET_ALL,
      );

      if (response.data.is_success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Get all services error:', error);
      throw error;
    }
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: string): Promise<ServiceResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<ServiceResponse>>(
        SERVICE_ENDPOINTS.GET_BY_ID(id),
      );

      if (response.data.is_success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error('Get service by ID error:', error);
      throw error;
    }
  }

  /**
   * Create new service
   * Uses multipart/form-data for file upload
   */
  async createService(
    serviceData: CreateServiceRequest,
  ): Promise<ServiceResponse> {
    try {
      const formData = new FormData();

      formData.append('CategoryId', serviceData.categoryId);
      formData.append('ServiceName', serviceData.serviceName);
      formData.append('Description', serviceData.description);
      formData.append('BasePrice', serviceData.basePrice.toString());

      if (serviceData.serviceIconUrl instanceof File) {
        formData.append('ServiceIconUrl', serviceData.serviceIconUrl);
      }

      const response = await apiClient.post<ApiResponse<ServiceResponse>>(
        SERVICE_ENDPOINTS.CREATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.is_success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to create service');
    } catch (error) {
      console.error('Create service error:', error);
      throw error;
    }
  }

  /**
   * Update service
   * Uses multipart/form-data for file upload
   */
  async updateService(
    id: string,
    serviceData: UpdateServiceRequest,
  ): Promise<ServiceResponse> {
    try {
      const formData = new FormData();

      if (serviceData.categoryId) {
        formData.append('CategoryId', serviceData.categoryId);
      }
      if (serviceData.serviceName) {
        formData.append('ServiceName', serviceData.serviceName);
      }
      if (serviceData.description) {
        formData.append('Description', serviceData.description);
      }
      if (serviceData.basePrice !== undefined) {
        formData.append('BasePrice', serviceData.basePrice.toString());
      }
      if (serviceData.isActive !== undefined) {
        formData.append('IsActive', serviceData.isActive.toString());
      }
      if (serviceData.serviceIconUrl instanceof File) {
        formData.append('ServiceIconUrl', serviceData.serviceIconUrl);
      }

      const response = await apiClient.put<ApiResponse<ServiceResponse>>(
        SERVICE_ENDPOINTS.UPDATE(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.is_success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to update service');
    } catch (error) {
      console.error('Update service error:', error);
      throw error;
    }
  }

  /**
   * Delete service
   */
  async deleteService(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(
        SERVICE_ENDPOINTS.DELETE(id),
      );

      return response.data.is_success;
    } catch (error) {
      console.error('Delete service error:', error);
      throw error;
    }
  }
}

// ========================================
// Export singleton instance
// ========================================
const serviceService = new ServiceService();
export default serviceService;
