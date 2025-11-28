// Wallet & Payout Types for Admin Portal

export type PayoutStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export type AdminWalletPayout = {
  payoutRequestId: string;
  walletAccountId: string;
  technicianId: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  holdAmount: number;
  status: PayoutStatus;
  receiverName: string;
  receiverAccount: string;
  bankCode: string;
  requestedAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  vietQrPayload: string | null;
  vietQrImageBase64: string | null;
  renderQrEnabled: boolean;
  note?: string;
  rejectedAt?: string | null;
  processedAt?: string | null;
  failureReason?: string | null;
  processedBy?: string | null;
};

export type GetPayoutsParams = {
  status?: PayoutStatus;
  technicianId?: string;
  page?: number;
  pageSize?: number;
};

export type PaginationMeta = {
  total_pages: number;
  total_items: number;
  current_page: number;
  page_size: number;
};

export type PayoutsResponse = {
  items: AdminWalletPayout[];
  meta: PaginationMeta;
};

export type ApprovePayoutRequest = {
  purpose: string;
};

export type MarkPaidRequest = {
  proofImageUrl?: string;
  proofNote?: string;
  referenceNumber?: string;
};

export type RejectPayoutRequest = {
  reason: string;
};
