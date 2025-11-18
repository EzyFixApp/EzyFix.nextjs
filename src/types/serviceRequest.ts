/**
 * Service Request Types
 * Based on ServiceRequestManagement.md API Documentation
 */

// ========================================
// Enums
// ========================================

/**
 * Service Request Status
 */
export type ServiceRequestStatus
  = | 'PENDING'
    | 'QUOTED'
    | 'QUOTE_REJECTED'
    | 'QUOTE_ACCEPTED'
    | 'COMPLETED'
    | 'CANCELLED';

/**
 * Media Type for attachments
 */
export type MediaType
  = | 'ISSUE'
    | 'INITIAL'
    | 'EXCEED'
    | 'FINAL'
    | 'PAYMENT'
    | 'OTHER';

/**
 * Offer Status
 */
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

// ========================================
// List View Types (GET /admin/serviceRequests)
// ========================================

/**
 * Service Request in list view
 */
export type ServiceRequest = {
  requestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  fullName: string;
  phoneNumber: string;
  requestAddress: string;
  serviceDescription: string;
  addressNote: string | null;
  requestedDate: string;
  expectedStartTime: string | null;
  status: ServiceRequestStatus;
  createdDate: string;
  totalOffers: number;
  acceptedOfferId: string | null;
  mediaCount: number;
};

/**
 * Pagination metadata
 */
export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

/**
 * Service Requests List Response
 */
export type ServiceRequestsResponse = {
  items: ServiceRequest[];
  pagination: Pagination;
};

/**
 * Query parameters for listing service requests
 */
export type GetServiceRequestsParams = {
  status?: ServiceRequestStatus;
  customerId?: string;
  serviceId?: string;
  fromDate?: string;
  toDate?: string;
  searchKeyword?: string;
  page?: number;
  pageSize?: number;
};

// ========================================
// Detail View Types (GET /admin/serviceRequests/{id})
// ========================================

/**
 * Customer details in service request
 */
export type CustomerDetails = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarLink: string | null;
  isVerify: boolean;
};

/**
 * Service details in service request
 */
export type ServiceDetails = {
  serviceId: string;
  serviceName: string;
  categoryName: string;
};

/**
 * Offer (báo giá) from technician
 */
export type ServiceDeliveryOffer = {
  offerId: string;
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  technicianRating: number;
  estimatedCost: number;
  finalCost: number;
  submitDate: string;
  status: OfferStatus;
  notes: string | null;
};

/**
 * Media attachment
 */
export type Media = {
  mediaId: string;
  url: string;
  mediaType: MediaType;
  uploadedDate: string;
};

/**
 * Voucher usage
 */
export type VoucherUsage = {
  voucherId: string;
  voucherCode: string;
  discountAmount: number;
  appliedAt: string;
};

/**
 * Activity log entry
 */
export type ActivityLog = {
  logId: string;
  action: string;
  performedBy: string;
  performedAt: string;
  oldValue: string | null;
  newValue: string | null;
  notes?: string | null;
};

/**
 * Full Service Request Details
 */
export type ServiceRequestDetails = {
  requestId: string;
  customerId: string;
  customer: CustomerDetails;
  serviceId: string;
  service: ServiceDetails;
  fullName: string;
  phoneNumber: string;
  requestAddress: string;
  serviceDescription: string;
  addressNote: string | null;
  requestedDate: string;
  expectedStartTime: string | null;
  status: ServiceRequestStatus;
  createdDate: string;
  offers: ServiceDeliveryOffer[];
  media: Media[];
  voucherUsages: VoucherUsage[];
  activityLogs: ActivityLog[];
};

// ========================================
// Request/Response Types for Actions
// ========================================

/**
 * Cancel Service Request Request Body
 */
export type CancelServiceRequestRequest = {
  reason: string;
  notifyCustomer?: boolean;
  notifyTechnicians?: boolean;
};

/**
 * Cancel Service Request Response
 */
export type CancelServiceRequestResponse = {
  requestId: string;
  status: ServiceRequestStatus;
  cancelledBy: string;
  cancelledAt: string;
  cancelReason: string;
  expiredOffersCount: number;
  notificationsSent: {
    customer: boolean;
    technicians: number;
  };
};

/**
 * Update Status Request Body
 */
export type UpdateServiceRequestStatusRequest = {
  newStatus: ServiceRequestStatus;
  reason: string;
  notifyAffectedParties?: boolean;
};

/**
 * Update Status Response
 */
export type UpdateServiceRequestStatusResponse = {
  requestId: string;
  oldStatus: ServiceRequestStatus;
  newStatus: ServiceRequestStatus;
  updatedBy: string;
  updatedAt: string;
  reason: string;
  warnings: string[];
};
