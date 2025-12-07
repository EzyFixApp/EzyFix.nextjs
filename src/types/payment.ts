/**
 * Payment Types for Admin Payment Management
 * Based on backend API from admin-payments-frontend.md
 */

// ========================================
// Payment Status
// ========================================
export type PaymentStatus
  = | 'PENDING'
    | 'PAYMENT_SUCCESS'
    | 'FAILED'
    | 'ESCROW'
    | 'COMPLETE';

// ========================================
// Payment List Item
// ========================================
export type Payment = {
  paymentId: string;
  appointmentId: string;
  serviceRequestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  technicianId: string;
  technicianName: string;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  grossAmount: number;
  netAmount: number;
  commissionAmount: number;
  paymentMethodName: string;
  isOnline: boolean;
  status: PaymentStatus;
  transactionDate: string;
  paymentSuccessAt: string | null;
  escrowReleasedAt: string | null;
  invoiceRequested: boolean;
  providerOrderCode: string;
  paymentLinkId: string;
  issueFlags: string[];
};

// ========================================
// Payment Details
// ========================================
export type PaymentDetails = {
  paymentId: string;
  appointmentId: string;
  serviceRequestId: string;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  grossAmount: number;
  netAmount: number;
  commissionAmount: number;
  status: PaymentStatus;
  transactionDate: string;
  paymentSuccessAt: string | null;
  escrowReleasedAt: string | null;
  expectedReleaseDate: string | null;
  invoiceRequested: boolean;
  confirmImageUrl: string | null;
  appliedVoucherCode: string | null;
  discountTypeSnapshot: string | null;
  buyerInfoJson: string;
  metadataJson: string;
  voucherMetadataJson: string | null;
  providerOrderCode: string;
  paymentLinkId: string;
  checkoutUrl: string;
  expiresAt: string | null;
  providerSignature: string;
  appointment: PaymentAppointment;
  customer: PaymentCustomer;
  technician: PaymentTechnician;
  paymentMethod: PaymentMethodInfo;
  walletTransactions: WalletTransaction[];
  voucherUsages: VoucherUsage[];
  activityLogs: PaymentActivityLog[];
  issueFlags: string[];
};

export type PaymentAppointment = {
  appointmentId: string;
  serviceRequestId: string;
  serviceName: string;
  serviceAddress: string;
  scheduledDate: string;
  status: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
};

export type PaymentCustomer = {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
};

export type PaymentTechnician = {
  technicianId: string;
  fullName: string;
  email: string;
  phone: string;
  walletAccountId: string | null;
};

export type PaymentMethodInfo = {
  methodCode: string;
  methodName: string;
  isOnline: boolean;
  isActive: boolean;
};

export type WalletTransaction = {
  transactionId: string;
  walletAccountId: string;
  type: string;
  reason: string;
  amount: number;
  referenceType: string;
  referenceId: string;
  note: string;
  createdAt: string;
};

export type VoucherUsage = {
  voucherUsageId: string;
  voucherCode: string;
  discountAmount: number;
  status: string;
  usedAt: string;
  expiresAt: string | null;
};

export type PaymentActivityLog = {
  logId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  oldValue: string | null;
  newValue: string | null;
};

// ========================================
// API Params
// ========================================
export type GetPaymentsParams = {
  status?: PaymentStatus;
  appointmentId?: string;
  customerId?: string;
  technicianId?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  hasIssue?: boolean;
  page?: number;
  pageSize?: number;
};

// ========================================
// API Response Types
// ========================================
export type PaymentsResponse = {
  items: Payment[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  summary: {
    totalAmount: number;
    totalCommission: number;
    pendingEscrow: number;
    completedPayments: number;
    failedPayments: number;
  };
};

export type PaymentDetailsResponse = PaymentDetails;
