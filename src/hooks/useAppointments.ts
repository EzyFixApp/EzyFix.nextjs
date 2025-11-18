import type {
  Appointment,
  AppointmentDetails,
  CancelAppointmentRequest,
  GetAppointmentsParams,
  ReassignAppointmentRequest,
  UpdateStatusRequest,
} from '@/types/appointment';
import { useCallback, useEffect, useState } from 'react';

import { AppointmentService } from '@/libs/AppointmentService';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });

  // Fetch appointments with filters
  const fetchAppointments = useCallback(async (params?: GetAppointmentsParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AppointmentService.getAllAppointments(params);
      setAppointments(response.items);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách lịch hẹn');
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch appointment details
  const getAppointmentDetails = useCallback(async (id: string): Promise<AppointmentDetails | null> => {
    try {
      return await AppointmentService.getAppointmentById(id);
    } catch (err: any) {
      setError(err.message || 'Không thể tải chi tiết lịch hẹn');
      console.error('Error fetching appointment details:', err);
      return null;
    }
  }, []);

  // Cancel appointment
  const cancelAppointment = useCallback(async (id: string, data: CancelAppointmentRequest) => {
    try {
      const result = await AppointmentService.cancelAppointment(id, data);

      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.appointmentId === id ? { ...apt, status: 'CANCELLED' } : apt,
        ),
      );

      return result;
    } catch (err: any) {
      setError(err.message || 'Không thể hủy lịch hẹn');
      console.error('Error cancelling appointment:', err);
      throw err;
    }
  }, []);

  // Reassign appointment
  const reassignAppointment = useCallback(async (id: string, data: ReassignAppointmentRequest) => {
    try {
      const result = await AppointmentService.reassignAppointment(id, data);

      // Update local state with new technician
      setAppointments(prev =>
        prev.map(apt =>
          apt.appointmentId === id
            ? {
                ...apt,
                technicianId: result.newTechnician.technicianId,
                technicianName: result.newTechnician.fullName,
                technicianPhone: result.newTechnician.phone,
                estimatedCost: result.newEstimatedCost,
              }
            : apt,
        ),
      );

      return result;
    } catch (err: any) {
      setError(err.message || 'Không thể đổi thợ');
      console.error('Error reassigning appointment:', err);
      throw err;
    }
  }, []);

  // Update status
  const updateStatus = useCallback(async (id: string, data: UpdateStatusRequest) => {
    try {
      const result = await AppointmentService.updateStatus(id, data);

      // Update local state
      setAppointments(prev =>
        prev.map(apt =>
          apt.appointmentId === id ? { ...apt, status: data.newStatus } : apt,
        ),
      );

      return result;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái');
      console.error('Error updating status:', err);
      throw err;
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    error,
    pagination,
    fetchAppointments,
    getAppointmentDetails,
    cancelAppointment,
    reassignAppointment,
    updateStatus,
  };
}
