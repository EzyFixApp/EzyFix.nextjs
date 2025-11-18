/**
 * useServiceRequests Hook
 * Custom hook for managing service requests data
 */

import type {
  CancelServiceRequestRequest,
  GetServiceRequestsParams,
  ServiceRequest,
  ServiceRequestDetails,
  UpdateServiceRequestStatusRequest,
} from '@/types/serviceRequest';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getErrorMessage } from '@/libs/ApiClient';
import serviceRequestService from '@/libs/ServiceRequestService';

export function useServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });

  /**
   * Fetch all service requests
   */
  const fetchServiceRequests = useCallback(
    async (params?: GetServiceRequestsParams) => {
      try {
        setIsLoading(true);
        setError(null);
        const response
          = await serviceRequestService.getAllServiceRequests(params);
        setServiceRequests(response.items);
        setPagination(response.pagination);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Get service request details
   */
  const getServiceRequestDetails = useCallback(
    async (id: string): Promise<ServiceRequestDetails | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const details = await serviceRequestService.getServiceRequestById(id);
        return details;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(`Failed to fetch details: ${errorMessage}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Cancel a service request
   */
  const cancelServiceRequest = useCallback(
    async (id: string, data: CancelServiceRequestRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await serviceRequestService.cancelServiceRequest(
          id,
          data,
        );

        // Update local state
        setServiceRequests(prev =>
          prev.map(sr =>
            sr.requestId === id ? { ...sr, status: 'CANCELLED' } : sr,
          ),
        );

        toast.success('Service request cancelled successfully');
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(`Failed to cancel: ${errorMessage}`);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Update service request status
   */
  const updateServiceRequestStatus = useCallback(
    async (id: string, data: UpdateServiceRequestStatusRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const result
          = await serviceRequestService.updateServiceRequestStatus(id, data);

        // Update local state
        setServiceRequests(prev =>
          prev.map(sr =>
            sr.requestId === id ? { ...sr, status: data.newStatus } : sr,
          ),
        );

        toast.success(`Status updated to ${data.newStatus}`);
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(`Failed to update status: ${errorMessage}`);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  return {
    serviceRequests,
    isLoading,
    error,
    pagination,
    fetchServiceRequests,
    getServiceRequestDetails,
    cancelServiceRequest,
    updateServiceRequestStatus,
  };
}
