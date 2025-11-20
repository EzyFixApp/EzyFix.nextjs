/**
 * Revenue Analytics Service
 * Tích hợp đầy đủ 5 API endpoints theo RevenueAnalytics.md
 */

import type {
  ApiResponse,
  CommissionReportData,
  CommissionReportParams,
  RevenueByServiceData,
  RevenueByServiceParams,
  RevenueByTechnicianData,
  RevenueByTechnicianParams,
  RevenueOverviewData,
  RevenueOverviewParams,
  TransactionsData,
  TransactionsParams,
} from '@/types/analytics';

import apiClient from './ApiClient';

export class RevenueAnalyticsService {
  private static readonly BASE_PATH = '/admin/analytics';

  /**
   * GET /admin/analytics/revenue/overview
   * Lấy tổng quan doanh thu trong khoảng thời gian
   */
  static async getRevenueOverview(
    params: RevenueOverviewParams,
  ): Promise<ApiResponse<RevenueOverviewData>> {
    try {
      const response = await apiClient.get<ApiResponse<RevenueOverviewData>>(
        `${this.BASE_PATH}/revenue/overview`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue overview:', error);
      throw error;
    }
  }

  /**
   * GET /admin/analytics/revenue/by-service
   * Phân tích doanh thu theo từng loại dịch vụ
   */
  static async getRevenueByService(
    params: RevenueByServiceParams,
  ): Promise<ApiResponse<RevenueByServiceData>> {
    try {
      const response = await apiClient.get<ApiResponse<RevenueByServiceData>>(
        `${this.BASE_PATH}/revenue/by-service`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by service:', error);
      throw error;
    }
  }

  /**
   * GET /admin/analytics/revenue/by-technician
   * Xem thu nhập của từng technician
   */
  static async getRevenueByTechnician(
    params: RevenueByTechnicianParams,
  ): Promise<ApiResponse<RevenueByTechnicianData>> {
    try {
      const response = await apiClient.get<ApiResponse<RevenueByTechnicianData>>(
        `${this.BASE_PATH}/revenue/by-technician`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by technician:', error);
      throw error;
    }
  }

  /**
   * GET /admin/analytics/transactions
   * Xem chi tiết tất cả giao dịch tài chính
   */
  static async getTransactions(
    params?: TransactionsParams,
  ): Promise<ApiResponse<TransactionsData>> {
    try {
      const response = await apiClient.get<ApiResponse<TransactionsData>>(
        `${this.BASE_PATH}/transactions`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * GET /admin/analytics/commission-report
   * Báo cáo hoa hồng đã thu chi tiết
   */
  static async getCommissionReport(
    params: CommissionReportParams,
  ): Promise<ApiResponse<CommissionReportData>> {
    try {
      const response = await apiClient.get<ApiResponse<CommissionReportData>>(
        `${this.BASE_PATH}/commission-report`,
        { params },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching commission report:', error);
      throw error;
    }
  }

  /**
   * Helper: Generate date range for common periods
   */
  static getDateRange(period: '7days' | '30days' | 'thisMonth' | 'lastMonth' | 'thisYear'): {
    fromDate: string;
    toDate: string;
  } {
    const now = new Date();
    const toDate = now.toISOString();
    let fromDate: Date;

    switch (period) {
      case '7days':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'thisMonth':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'thisYear':
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return {
      fromDate: fromDate.toISOString(),
      toDate,
    };
  }

  /**
   * Helper: Format currency VND
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  /**
   * Helper: Format percentage
   */
  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  /**
   * Helper: Format number
   */
  static formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
  }
}

export default RevenueAnalyticsService;
