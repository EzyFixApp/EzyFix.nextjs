/**
 * UploadService - Handle file uploads to backend API
 */

import apiClient from './ApiClient';

type MediaUploadResponse = {
  fileUrl: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data: T;
};

class UploadService {
  /**
   * Upload bill image for payout proof using /api/v1/media endpoint
   * @param file - Image file to upload
   * @param requestId - Optional request ID for tracking
   * @param appointmentId - Optional appointment ID for tracking
   * @returns URL of uploaded image
   */
  async uploadPayoutBillImage(
    file: File,
    requestId?: string,
    appointmentId?: string,
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('File', file);

      // Build query parameters
      const params: Record<string, string> = {
        MediaType: 'PAYMENT',
      };

      if (requestId) {
        params.RequestID = requestId;
      }
      if (appointmentId) {
        params.AppointmentID = appointmentId;
      }

      // eslint-disable-next-line no-console
      console.log('📤 Uploading bill image:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        params,
        endpoint: '/media',
      });

      const response = await apiClient.post<ApiResponse<MediaUploadResponse>>(
        '/media',
        formData,
        {
          params,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // eslint-disable-next-line no-console
      console.log('✅ Upload response:', response.data);

      if (response.data.isSuccess && response.data.data) {
        return response.data.data.fileUrl;
      }

      // Check alternative response format (status_code instead of isSuccess)
      if ((response.data as any).is_success && response.data.data) {
        return (response.data.data as any).fileURL || response.data.data.fileUrl;
      }

      throw new Error(response.data.message || 'Failed to upload image');
    } catch (error: any) {
      console.error('❌ Error uploading bill image:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        fullUrl: error.config?.baseURL + error.config?.url,
        params: error.config?.params,
      });
      throw new Error(error.message || 'Không thể upload ảnh bill. Vui lòng thử lại.');
    }
  }

  /**
   * Generic media upload for other purposes
   * @param file - File to upload
   * @param mediaType - Type of media (PAYMENT, INITIAL, FINAL, EXCEED)
   * @param requestId - Optional request ID
   * @param appointmentId - Optional appointment ID
   * @returns URL of uploaded file
   */
  async uploadMedia(
    file: File,
    mediaType: 'PAYMENT' | 'INITIAL' | 'FINAL' | 'EXCEED',
    requestId?: string,
    appointmentId?: string,
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('File', file);

      // Build query parameters
      const params: Record<string, string> = {
        MediaType: mediaType,
      };

      if (requestId) {
        params.RequestID = requestId;
      }
      if (appointmentId) {
        params.AppointmentID = appointmentId;
      }

      const response = await apiClient.post<ApiResponse<MediaUploadResponse>>(
        '/media',
        formData,
        {
          params,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data.fileUrl;
      }

      throw new Error(response.data.message || 'Failed to upload file');
    } catch (error: any) {
      console.error('Error uploading media:', error);
      throw new Error(error.message || 'Không thể upload file. Vui lòng thử lại.');
    }
  }
}

export default new UploadService();
