/**
 * Voucher Types
 * All TypeScript definitions for Voucher Management APIs
 */

/**
 * Discount Type Enum
 */
export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_CHECKING';

/**
 * Voucher (List Item)
 * Returned in GET /api/v1/admin/vouchers
 */
export type Voucher = {
  voucherId: string;
  voucherCode: string;
  voucherDescription: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderAmount: number;
  validFrom: string; // ISO DateTime
  validTo: string; // ISO DateTime
  isActive: boolean;
  maxUsageCount: number;
  maxUsagePerUserCount: number;
  pendingReservations: number;
  confirmedUsages: number;
  releasedReservations: number;
  remainingGlobalCount: number;
  categoryNames: string[];
  serviceNames: string[];
  paymentMethodCodes: string[];
};

/**
 * Voucher Details
 * Returned in GET /api/v1/admin/vouchers/{id}
 * Also used in POST, PUT responses
 */
export type VoucherDetails = {
  voucherId: string;
  voucherCode: string;
  voucherDescription: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderAmount: number;
  validFrom: string; // ISO DateTime
  validTo: string; // ISO DateTime
  isActive: boolean;
  maxUsageCount: number;
  maxUsagePerUserCount: number;
  createdDate: string; // ISO DateTime
  categoryIds: string[];
  serviceIds: string[];
  paymentMethodIds: string[];
  categoryNames: string[];
  serviceNames: string[];
  paymentMethodNames: string[];
  usageSummary: VoucherUsageSummary;
};

/**
 * Voucher Usage Summary (nested in VoucherDetails)
 */
export type VoucherUsageSummary = {
  pending: number;
  confirmed: number;
  released: number;
  expired: number;
  totalDiscountGranted: number;
  totalOriginalAmount: number;
};

/**
 * Voucher Usage Report
 * Returned in GET /api/v1/admin/vouchers/{id}/usage
 */
export type VoucherUsageReport = {
  voucherId: string;
  voucherCode: string;
  pendingReservations: number;
  confirmedCount: number;
  releasedCount: number;
  expiredCount: number;
  totalDiscountGranted: number;
  totalOriginalAmount: number;
  generatedAtUtc: string; // ISO DateTime
};

/**
 * Pagination
 */
export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

/**
 * GET /api/v1/admin/vouchers - List Response
 */
export type GetVouchersResponse = {
  items: Voucher[];
  pagination: Pagination;
};

/**
 * GET /api/v1/admin/vouchers - Query Parameters
 */
export type GetVouchersParams = {
  keyword?: string;
  isActive?: boolean;
  includeExpired?: boolean;
  categoryId?: string;
  serviceId?: string;
  paymentMethodId?: string;
  page?: number;
  pageSize?: number;
};

/**
 * POST /api/v1/admin/vouchers - Create Request
 */
export type CreateVoucherRequest = {
  voucherCode: string;
  voucherDescription: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderAmount: number;
  validFrom: string; // ISO DateTime
  validTo: string; // ISO DateTime
  isActive: boolean;
  maxUsageCount: number;
  maxUsagePerUserCount: number;
  categoryIds: string[];
  serviceIds: string[];
  paymentMethodIds: string[];
};

/**
 * POST /api/v1/admin/vouchers - Create Response
 */
export type CreateVoucherResponse = {} & VoucherDetails;

/**
 * GET /api/v1/admin/vouchers/{id} - Get Details Response
 */
export type GetVoucherDetailsResponse = {} & VoucherDetails;

/**
 * PUT /api/v1/admin/vouchers/{id} - Update Request
 */
export type UpdateVoucherRequest = {
  voucherCode: string;
  voucherDescription: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  minimumOrderAmount: number;
  validFrom: string; // ISO DateTime
  validTo: string; // ISO DateTime
  isActive: boolean;
  maxUsageCount: number;
  maxUsagePerUserCount: number;
  categoryIds: string[];
  serviceIds: string[];
  paymentMethodIds: string[];
};

/**
 * PUT /api/v1/admin/vouchers/{id} - Update Response
 */
export type UpdateVoucherResponse = {} & VoucherDetails;

/**
 * POST /api/v1/admin/vouchers/{id}/status - Toggle Status Request
 */
export type ToggleVoucherStatusRequest = {
  isActive: boolean;
};

/**
 * POST /api/v1/admin/vouchers/{id}/status - Toggle Status Response
 */
export type ToggleVoucherStatusResponse = {} & VoucherDetails;

/**
 * GET /api/v1/admin/vouchers/{id}/usage - Usage Report Response
 */
export type GetVoucherUsageResponse = {} & VoucherUsageReport;
