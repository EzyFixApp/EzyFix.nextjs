/**
 * Revenue Analytics API Types
 * Theo đúng cấu trúc response từ Backend API
 */

// ============================================
// Common Types
// ============================================

export type PeriodInfo = {
  fromDate: string; // ISO DateTime
  toDate: string; // ISO DateTime
  groupBy: string | null; // "day" | "week" | "month"
};

export type PaginationMeta = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

// ============================================
// Revenue Overview Types
// ============================================

export type RevenueOverviewSummary = {
  totalRevenue: number;
  totalCommission: number;
  totalPayouts: number;
  totalTransactions: number;
  completedAppointments: number;
  averageOrderValue: number;
  commissionRate: number;
};

export type RevenueComparison = {
  previousPeriodRevenue: number;
  revenueGrowth: number;
  previousPeriodTransactions: number;
  transactionGrowth: number;
};

export type RevenueBreakdownItem = {
  date: string | null;
  revenue: number;
  commission: number;
  payouts: number;
  transactions: number;
};

export type PaymentMethodBreakdown = {
  ONLINE?: {
    count: number;
    total: number;
    percentage: number;
  };
  CASH?: {
    count: number;
    total: number;
    percentage: number;
  };
};

export type RevenueOverviewData = {
  period: PeriodInfo;
  summary: RevenueOverviewSummary;
  comparison: RevenueComparison;
  breakdown: RevenueBreakdownItem[];
  paymentMethods: PaymentMethodBreakdown | null;
};

// ============================================
// Revenue By Service Types
// ============================================

export type ServiceRevenueItem = {
  serviceId: string;
  serviceName: string | null;
  categoryName: string | null;
  totalRevenue: number;
  totalCommission: number;
  totalTransactions: number;
  averagePrice: number;
  percentageOfTotal: number;
  growth: number;
};

export type RevenueByServiceData = {
  period: PeriodInfo;
  totalRevenue: number;
  totalCommission: number;
  services: ServiceRevenueItem[];
};

// ============================================
// Revenue By Technician Types
// ============================================

export type TechnicianStatistics = {
  totalEarnings: number;
  platformCommission: number;
  netEarnings: number;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  averageJobValue: number;
  averageRating: number;
  totalReviews: number;
};

export type TechnicianPaymentStatus = {
  pendingPayout: number;
  paidOut: number;
  inEscrow: number;
};

export type TechnicianPerformance = {
  completionRate: number;
  onTimeRate: number;
  disputeCount: number;
  rank: number;
};

export type TechnicianRevenueItem = {
  technicianId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  avatarLink: string | null;
  statistics: TechnicianStatistics;
  paymentStatus: TechnicianPaymentStatus;
  performance: TechnicianPerformance;
};

export type RevenueByTechnicianData = {
  period: PeriodInfo;
  totalTechnicians: number;
  technicians: TechnicianRevenueItem[];
};

// ============================================
// Transactions Types
// ============================================

export type TransactionSummary = {
  totalAmount: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
};

export type TransactionUser = {
  userId: string;
  name: string | null;
  role: string | null;
};

export type TransactionRelatedEntity = {
  type: string | null;
  id: string;
};

export type TransactionItem = {
  transactionId: string;
  type: string | null;
  amount: number;
  status: string | null;
  createdDate: string; // ISO DateTime
  completedDate: string | null;
  from: TransactionUser;
  to: TransactionUser;
  relatedEntity: TransactionRelatedEntity;
  paymentMethod: string | null;
  paymentProvider: string | null;
  transactionCode: string | null;
  commissionAmount: number;
  netAmount: number;
  notes: string | null;
};

export type TransactionsData = {
  summary: TransactionSummary;
  items: TransactionItem[];
  pagination: PaginationMeta;
};

// ============================================
// Commission Report Types
// ============================================

export type CommissionReportSummary = {
  totalCommission: number;
  totalRevenue: number;
  averageCommissionRate: number;
  totalTransactions: number;
};

export type CommissionBreakdownItem = {
  serviceId: string | null;
  serviceName: string | null;
  categoryName: string | null;
  technicianId: string | null;
  technicianName: string | null;
  date: string | null;
  totalRevenue: number;
  commissionCollected: number;
  commissionRate: number;
  transactions: number;
};

export type CommissionReportData = {
  period: PeriodInfo;
  summary: CommissionReportSummary;
  breakdown: CommissionBreakdownItem[];
};

// ============================================
// API Response Wrappers
// ============================================

export type ApiResponse<T> = {
  status_code: number;
  message: string | null;
  reason: string | null;
  is_success: boolean;
  data: T;
};

// ============================================
// Query Parameters
// ============================================

export type RevenueOverviewParams = {
  fromDate: string; // ISO DateTime
  toDate: string; // ISO DateTime
  groupBy?: 'day' | 'week' | 'month';
};

export type RevenueByServiceParams = {
  fromDate: string;
  toDate: string;
  categoryId?: string;
  top?: number;
};

export type RevenueByTechnicianParams = {
  fromDate: string;
  toDate: string;
  technicianId?: string;
  sortBy?: 'revenue' | 'jobs' | 'rating';
  order?: 'asc' | 'desc';
  top?: number;
};

export type TransactionsParams = {
  fromDate?: string;
  toDate?: string;
  type?: string;
  status?: string;
  customerId?: string;
  technicianId?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  pageSize?: number;
};

export type CommissionReportParams = {
  fromDate: string;
  toDate: string;
  groupBy?: 'service' | 'technician' | 'date';
};
