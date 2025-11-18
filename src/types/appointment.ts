// Appointment Types based on AppointmentManagement.md API Documentation

export type AppointmentStatus
  = 'SCHEDULED'
    | 'EN_ROUTE'
    | 'ARRIVED'
    | 'CHECKING'
    | 'PRICE_REVIEW'
    | 'REPAIRING'
    | 'REPAIRED'
    | 'CANCELLED'
    | 'ABSENT'
    | 'DISPUTE';

export type IssueFlag = 'OVERDUE' | 'GPS_MISSING' | 'NO_MEDIA' | 'PRICE_MISMATCH';

export type PaymentStatus = 'PENDING' | 'PAYMENT_SUCCESS' | 'ESCROW' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type MediaType = 'INITIAL' | 'PROGRESS' | 'FINAL';

// Appointment List Item (GET /admin/appointments)
export type Appointment = {
  appointmentId: string;
  offerId: string;
  serviceRequestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  serviceAddress: string;
  scheduledDate: string; // DateOnly: "2025-11-16"
  actualStartTime: string | null; // DateTime: "2025-11-16T09:15:00Z"
  actualEndTime: string | null;
  status: AppointmentStatus;
  createdDate: string; // DateTime
  estimatedCost: number;
  finalCost: number;
  hasPayment: boolean;
  paymentStatus: PaymentStatus | null;
  hasDispute: boolean;
  lastGpsUpdate: string | null; // DateTime
  issueFlags: IssueFlag[];
};

// Appointment Details (GET /admin/appointments/{id})
export type AppointmentDetails = {
  appointmentId: string;
  offerId: string;
  serviceRequest: {
    requestId: string;
    serviceName: string;
    serviceDescription: string;
    requestAddress: string;
    addressNote: string;
  };
  customer: {
    customerId: string;
    fullName: string;
    email: string;
    phone: string;
    avatarLink: string;
  };
  technician: {
    technicianId: string;
    fullName: string;
    email: string;
    phone: string;
    rating: number;
    totalJobs: number;
    avatarLink: string;
  };
  scheduledDate: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  status: AppointmentStatus;
  createdDate: string;
  pricing: {
    estimatedCost: number;
    finalCost: number;
    priceAdjustmentReason: string | null;
  };
  timeline: TimelineItem[];
  media: AppointmentMedia[];
  notes: AppointmentNote[];
  gpsLogs: GPSLog[];
  payment: PaymentDetails | null;
  disputes: DisputeInfo[];
  activityLogs: ActivityLog[];
  walletTransactions: WalletTransaction[];
};

export type TimelineItem = {
  status: AppointmentStatus;
  timestamp: string; // DateTime
  note: string | null;
  gpsLat?: number;
  gpsLng?: number;
};

export type AppointmentMedia = {
  mediaId: string;
  url: string;
  mediaType: MediaType;
  uploadedDate: string; // DateTime
  uploadedBy: string;
};

export type AppointmentNote = {
  noteId: string;
  status: AppointmentStatus;
  noteText: string;
  createdBy: string;
  createdAt: string; // DateTime
};

export type GPSLog = {
  logId: string;
  latitude: number;
  longitude: number;
  loggedAt: string; // DateTime
  status: AppointmentStatus;
};

export type PaymentDetails = {
  paymentId: string;
  amount: number;
  paymentMethod: string; // MOMO, VNPAY, WALLET, etc.
  status: PaymentStatus;
  transactionDate: string; // DateTime
  invoiceRequested: boolean;
};

export type DisputeInfo = {
  disputeId: string;
  reason: string;
  createdBy: string;
  createdAt: string;
  status: string;
};

export type ActivityLog = {
  logId: string;
  action: string; // CREATED, ADMIN_CANCELLED, REASSIGNED, etc.
  performedBy: string;
  performedAt: string; // DateTime
  oldValue: string | null;
  newValue: string | null;
};

export type WalletTransaction = {
  transactionId: string;
  amount: number;
  type: string;
  createdAt: string;
};

// API Response Types
export type AppointmentListResponse = {
  items: Appointment[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

// Request Types
export type GetAppointmentsParams = {
  status?: AppointmentStatus;
  technicianId?: string;
  customerId?: string;
  fromDate?: string; // DateTime
  toDate?: string; // DateTime
  searchKeyword?: string;
  hasIssues?: boolean;
  page?: number;
  pageSize?: number;
};

export type CancelAppointmentRequest = {
  reason: string;
  refundAmount?: number;
  notifyCustomer?: boolean;
  notifyTechnician?: boolean;
  penalizeTechnician?: boolean;
};

export type ReassignAppointmentRequest = {
  newTechnicianId: string;
  reason: string;
  notifyOldTechnician?: boolean;
  notifyNewTechnician?: boolean;
  notifyCustomer?: boolean;
  adjustPrice?: boolean;
  newEstimatedCost?: number;
};

export type UpdateStatusRequest = {
  newStatus: AppointmentStatus;
  reason: string;
  skipValidation?: boolean;
};

// Response Types for Actions
export type CancelAppointmentResponse = {
  appointmentId: string;
  status: AppointmentStatus;
  cancelledBy: string;
  cancelledAt: string;
  cancelReason: string;
  refund: {
    refunded: boolean;
    amount: number;
    refundStatus: string | null;
  };
  penalty: {
    applied: boolean;
    technicianId: string | null;
    penaltyType: string | null;
  };
  notifications: {
    customerNotified: boolean;
    technicianNotified: boolean;
  };
};

export type ReassignAppointmentResponse = {
  appointmentId: string;
  oldTechnician: {
    technicianId: string;
    fullName: string;
    phone: string;
  };
  newTechnician: {
    technicianId: string;
    fullName: string;
    phone: string;
    rating: number;
  };
  newOfferId: string;
  priceAdjusted: boolean;
  newEstimatedCost: number;
  reassignedBy: string;
  reassignedAt: string;
  reason: string;
  notifications: {
    oldTechnicianNotified: boolean;
    newTechnicianNotified: boolean;
    customerNotified: boolean;
  };
};

export type UpdateStatusResponse = {
  appointmentId: string;
  oldStatus: AppointmentStatus;
  newStatus: AppointmentStatus;
  updatedBy: string;
  updatedAt: string;
  reason: string;
  warnings: string[];
};
