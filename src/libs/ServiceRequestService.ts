/**
 * Service Request Service
 * API calls for admin service request management
 * Based on ServiceRequestManagement.md
 */

import type {
  CancelServiceRequestRequest,
  CancelServiceRequestResponse,
  GetServiceRequestsParams,
  ServiceRequestDetails,
  ServiceRequestsResponse,
  UpdateServiceRequestStatusRequest,
  UpdateServiceRequestStatusResponse,
} from '@/types/serviceRequest';

import apiClient from './ApiClient';

class ServiceRequestService {
  private readonly BASE_PATH = '/admin/serviceRequests';

  /**
   * GET /admin/serviceRequests
   * Get all service requests with filters
   */
  async getAllServiceRequests(
    params?: GetServiceRequestsParams,
  ): Promise<ServiceRequestsResponse> {
    const response = await apiClient.get<{
      data: ServiceRequestsResponse;
    }>(this.BASE_PATH, { params });
    return response.data.data;
  }

  /**
   * GET /admin/serviceRequests/{id}
   * Get service request details
   */
  async getServiceRequestById(id: string): Promise<ServiceRequestDetails> {
    const response = await apiClient.get<{
      data: ServiceRequestDetails;
    }>(`${this.BASE_PATH}/${id}`);
    return response.data.data;
  }

  /**
   * PATCH /admin/serviceRequests/{id}/cancel
   * Cancel a service request
   */
  async cancelServiceRequest(
    id: string,
    data: CancelServiceRequestRequest,
  ): Promise<CancelServiceRequestResponse> {
    const response = await apiClient.patch<{
      data: CancelServiceRequestResponse;
    }>(`${this.BASE_PATH}/${id}/cancel`, data);
    return response.data.data;
  }

  /**
   * PATCH /admin/serviceRequests/{id}/status
   * Update service request status manually
   */
  async updateServiceRequestStatus(
    id: string,
    data: UpdateServiceRequestStatusRequest,
  ): Promise<UpdateServiceRequestStatusResponse> {
    const response = await apiClient.patch<{
      data: UpdateServiceRequestStatusResponse;
    }>(`${this.BASE_PATH}/${id}/status`, data);
    return response.data.data;
  }
}

const serviceRequestService = new ServiceRequestService();
export default serviceRequestService;
