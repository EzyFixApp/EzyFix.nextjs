import type {
  AppointmentDetails,
  AppointmentListResponse,
  CancelAppointmentRequest,
  CancelAppointmentResponse,
  GetAppointmentsParams,
  ReassignAppointmentRequest,
  ReassignAppointmentResponse,
  UpdateStatusRequest,
  UpdateStatusResponse,
} from '@/types/appointment';

import apiClient from './ApiClient';

export class AppointmentService {
  private static readonly BASE_PATH = '/admin/appointments';

  /**
   * GET /admin/appointments
   * Lấy danh sách tất cả appointments với filter và pagination
   */
  static async getAllAppointments(params?: GetAppointmentsParams): Promise<AppointmentListResponse> {
    const response = await apiClient.get<{ data: AppointmentListResponse }>(this.BASE_PATH, { params });
    return response.data.data;
  }

  /**
   * GET /admin/appointments/{id}
   * Lấy thông tin chi tiết đầy đủ của một appointment
   */
  static async getAppointmentById(id: string): Promise<AppointmentDetails> {
    const response = await apiClient.get<{ data: AppointmentDetails }>(`${this.BASE_PATH}/${id}`);
    return response.data.data;
  }

  /**
   * PATCH /admin/appointments/{id}/cancel
   * Admin hủy một appointment
   */
  static async cancelAppointment(
    id: string,
    data: CancelAppointmentRequest,
  ): Promise<CancelAppointmentResponse> {
    const response = await apiClient.patch<{ data: CancelAppointmentResponse }>(
      `${this.BASE_PATH}/${id}/cancel`,
      data,
    );
    return response.data.data;
  }

  /**
   * PATCH /admin/appointments/{id}/reassign
   * Admin chỉ định thợ khác cho appointment
   */
  static async reassignAppointment(
    id: string,
    data: ReassignAppointmentRequest,
  ): Promise<ReassignAppointmentResponse> {
    const response = await apiClient.patch<{ data: ReassignAppointmentResponse }>(
      `${this.BASE_PATH}/${id}/reassign`,
      data,
    );
    return response.data.data;
  }

  /**
   * PATCH /admin/appointments/{id}/status
   * Admin override trạng thái appointment
   */
  static async updateStatus(
    id: string,
    data: UpdateStatusRequest,
  ): Promise<UpdateStatusResponse> {
    const response = await apiClient.patch<{ data: UpdateStatusResponse }>(
      `${this.BASE_PATH}/${id}/status`,
      data,
    );
    return response.data.data;
  }
}
