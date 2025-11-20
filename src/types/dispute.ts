/**
 * Dispute Types
 * Based on /api/admin/disputes endpoints
 */

export type DisputeStatus = 'Open' | 'InReview' | 'Resolved';

export type RaisedBy = 'CUSTOMER' | 'TECHNICIAN';

export type ResolutionType
  = 'FAVOR_CUSTOMER'
    | 'FAVOR_TECHNICIAN'
    | 'PARTIAL_REFUND'
    | 'NO_ACTION';

// List item from GET /api/admin/disputes
export type Dispute = {
  disputeId: string;
  appointmentId: string;
  customerName: string;
  technicianName: string;
  reason: string;
  status: DisputeStatus;
  amount: number;
  createdDate: string;
  daysOpen: number;
  raisedBy: RaisedBy;
};

// Activity history item
export type ActivityHistoryItem = {
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
};

// Details from GET /api/admin/disputes/{id}
export type DisputeDetails = {
  disputeId: string;
  appointmentId: string;
  reason: string;
  description: string | null;
  status: DisputeStatus;
  createdDate: string;
  resolvedDate: string | null;
  customerId: string;
  customerName: string;
  customerPhone: string;
  technicianId: string;
  technicianName: string;
  technicianPhone: string;
  finalCost: number;
  paymentStatus: string | null;
  scheduledDate: string;
  customerEvidenceUrls: string[];
  technicianEvidenceUrls: string[];
  activityHistory: ActivityHistoryItem[];
};

// Summary stats
export type DisputeSummary = {
  totalDisputes: number;
  openDisputes: number;
  inReviewDisputes: number;
  resolvedDisputes: number;
};

// Response from GET /api/admin/disputes
export type GetDisputesResponse = {
  items: Dispute[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  summary: DisputeSummary;
};

// Request params for GET /api/admin/disputes
export type GetDisputesParams = {
  status?: DisputeStatus;
  page?: number;
  pageSize?: number;
};

// Request for PATCH /api/admin/disputes/{id}/review
export type ReviewDisputeRequest = {
  adminNotes?: string;
  status: 'InReview';
};

// Request for PATCH /api/admin/disputes/{id}/resolve
export type ResolveDisputeRequest = {
  resolution: ResolutionType;
  resolutionNotes?: string;
  refundAmount?: number;
  adjustTechnicianCommission?: boolean;
  applyTechnicianPenalty?: boolean;
};

// Request for POST /api/admin/disputes/{id}/messages
export type AddDisputeMessageRequest = {
  message: string;
};
