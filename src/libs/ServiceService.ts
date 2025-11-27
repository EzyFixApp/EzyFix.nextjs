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
        // Debug: Log raw response from backend
        // eslint-disable-next-line no-console
        console.log('🔍 GET All Services - Raw Response:', JSON.stringify(response.data.data, null, 2));

        // Map backend response to frontend format
        // Backend might return 'serviceId' instead of 'id'
        const services = response.data.data.map((service: any) => ({
          id: service.id || service.serviceId,
          categoryId: service.categoryId,
          serviceName: service.serviceName,
          description: service.description,
          serviceIconUrl: service.serviceIconUrl,
          basePrice: service.basePrice,
          isActive: service.isActive,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        }));
        return services;
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
        // Debug: Log raw response from backend
        // eslint-disable-next-line no-console
        console.log('🔍 GET Service By ID - Raw Response:', JSON.stringify(response.data.data, null, 2));
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
        // Debug: Log raw response from backend
        // eslint-disable-next-line no-console
        console.log('🔍 CREATE Service - Raw Response:', JSON.stringify(response.data.data, null, 2));

        // Map backend response to frontend format
        const service = response.data.data as any;
        return {
          id: service.id || service.serviceId,
          categoryId: service.categoryId,
          serviceName: service.serviceName,
          description: service.description,
          serviceIconUrl: service.serviceIconUrl,
          basePrice: service.basePrice,
          isActive: service.isActive ?? true,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        };
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
      // Validate ID
      if (!id || id === 'undefined') {
        throw new Error('Invalid service ID');
      }

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
      // Note: IsActive is not supported in the update endpoint according to API spec
      // if (serviceData.isActive !== undefined) {
      //   formData.append('IsActive', serviceData.isActive.toString());
      // }

      // Xử lý serviceIconUrl: có thể là File (ảnh mới) hoặc string URL (giữ ảnh cũ)
      if (serviceData.serviceIconUrl instanceof File) {
        formData.append('ServiceIconUrl', serviceData.serviceIconUrl);
        // eslint-disable-next-line no-console
        console.log('✅ ServiceService: Appending NEW icon FILE to FormData');
      } else if (typeof serviceData.serviceIconUrl === 'string' && serviceData.serviceIconUrl) {
        // Gửi URL string để giữ nguyên ảnh cũ
        formData.append('ServiceIconUrl', serviceData.serviceIconUrl);
        // eslint-disable-next-line no-console
        console.log('✅ ServiceService: Appending CURRENT icon URL to FormData:', serviceData.serviceIconUrl);
      } else {
        // eslint-disable-next-line no-console
        console.log('⏭️ ServiceService: NO icon provided');
      }

      // Debug FormData
      // eslint-disable-next-line no-console
      console.log('📋 ServiceService FormData keys:', Array.from(formData.keys()));

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
        // Debug: Log raw response from backend
        // eslint-disable-next-line no-console
        console.log('🔍 UPDATE Service - Raw Response:', JSON.stringify(response.data.data, null, 2));

        // Map backend response to ensure consistent field names
        const service = response.data.data as any;
        return {
          id: service.id || service.serviceId,
          categoryId: service.categoryId,
          serviceName: service.serviceName,
          description: service.description,
          serviceIconUrl: service.serviceIconUrl,
          basePrice: service.basePrice,
          isActive: service.isActive,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        };
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
