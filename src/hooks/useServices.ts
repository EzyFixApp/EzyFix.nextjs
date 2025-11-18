/**
 * useServices Hook
 * Custom hook for managing services data
 */

import type {
  CreateServiceRequest,
  ServiceResponse,
  UpdateServiceRequest,
} from '@/types/service';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getErrorMessage } from '@/libs/ApiClient';
import serviceService from '@/libs/ServiceService';

export function useServices() {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all services
   */
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new service
   */
  const createService = useCallback(
    async (serviceData: CreateServiceRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const newService = await serviceService.createService(serviceData);
        // Add to the beginning of the array (newest first)
        // Add current timestamp as createdAt if not provided by backend
        const serviceWithTimestamp = {
          ...newService,
          createdAt: newService.createdAt || new Date().toISOString(),
        };
        setServices(prev => [serviceWithTimestamp, ...prev]);
        toast.success('Service created successfully!');
        return newService;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(`Failed to create service: ${errorMessage}`);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Update service
   */
  const updateService = useCallback(
    async (id: string, serviceData: UpdateServiceRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const updatedService = await serviceService.updateService(
          id,
          serviceData,
        );
        setServices(prev =>
          prev.map(s => (s.id === id ? updatedService : s)),
        );
        toast.success('Service updated successfully!');
        return updatedService;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(`Failed to update service: ${errorMessage}`);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * Delete service
   */
  const deleteService = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await serviceService.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success('Service deleted successfully!');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(`Failed to delete service: ${errorMessage}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get service by ID
   */
  const getServiceById = useCallback(
    (id: string): ServiceResponse | undefined => {
      return services.find(s => s.id === id);
    },
    [services],
  );

  /**
   * Load services on mount
   */
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
    getServiceById,
  };
}
