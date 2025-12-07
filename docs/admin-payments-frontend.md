# Admin Payments API (Frontend cheat sheet)

## Auth & Base
- Requires Admin role / bearer token.
- Base path: `/api/v1/admin/payments`.

## List payments `GET /api/v1/admin/payments`
- Filters (optional): `status` (`PENDING|PAYMENT_SUCCESS|FAILED|ESCROW|COMPLETE`), `appointmentId`, `customerId`, `technicianId`, `fromDate`, `toDate`, `minAmount`, `maxAmount`, `hasIssue` (true = only stale escrow), `page` (default 1), `pageSize` (default 20, max 100).
- Sorting: `TransactionDate` desc.
- Response `data.items[]` (key fields):
  - `paymentId`, `appointmentId`, `serviceRequestId`
  - `customerId`, `customerName`, `customerPhone`
  - `technicianId`, `technicianName`
  - `amount`, `originalAmount`, `discountAmount`, `grossAmount`, `netAmount`, `commissionAmount`
  - `paymentMethodName` (always PayOS), `isOnline`
  - `status`, `transactionDate`, `paymentSuccessAt`, `escrowReleasedAt`, `invoiceRequested`
  - `providerOrderCode`, `paymentLinkId`
  - `issueFlags` (see below)
- `data.pagination`: `currentPage`, `pageSize`, `totalItems`, `totalPages`.
- `data.summary`: `totalAmount`, `totalCommission`, `pendingEscrow`, `completedPayments`, `failedPayments`.
- Quick issue filter: set `hasIssue=true` to fetch only escrow stuck beyond threshold.
- Escrow badge: use `issueFlags` + `status=ESCROW` to show “stuck escrow” warnings.

## Payment detail `GET /api/v1/admin/payments/{id}`
- Adds: `checkoutUrl`, `expiresAt`, `confirmImageUrl`, `appliedVoucherCode`, `discountTypeSnapshot`, `buyerInfoJson`, `metadataJson`, `voucherMetadataJson`, `providerSignature`, `expectedReleaseDate`.
- Appointment: `appointmentId`, `serviceRequestId`, `serviceName`, `serviceAddress`, `scheduledDate`, `status`, `actualStartTime`, `actualEndTime`.
- Customer: `customerId`, `fullName`, `email`, `phone`.
- Technician: `technicianId`, `fullName`, `email`, `phone`, `walletAccountId` (if exists).
- PaymentMethod: `methodCode` (PayOS), `methodName`, `isOnline`, `isActive`.
- `walletTransactions[]`: `transactionId`, `walletAccountId`, `type`, `reason`, `amount`, `referenceType`, `referenceId`, `note`, `createdAt`.
- `voucherUsages[]`: `voucherUsageId`, `voucherCode`, `discountAmount`, `status`, `usedAt`, `expiresAt`.
- `activityLogs[]`: `logId`, `action`, `performedBy`, `performedAt`, `oldValue`, `newValue`.
- `issueFlags` same as list.
- Show “expected release” countdown for ESCROW; hide if COMPLETE/FAILED.
- Use `walletTransactions` to display credit/debit history tied to this payment (transparency for support tools).

## Issue flags logic
- `STUCK_ESCROW`: payment `ESCROW` and `paymentSuccessAt` (fallback `transactionDate`) older than `Payments:EscrowStaleHours` (default 48h).
- Other flags (refund/commission dispute) not emitted yet.
- Suggestion: highlight `STUCK_ESCROW` with warning color; offer “release escrow” admin action when available (future).

## UX hints
- Use `issueFlags` to show warning badges on list/detail.
- Prefer showing `expectedReleaseDate` for escrow countdown; fallback to `escrowReleasedAt` if already settled.
- When `status=COMPLETE`, wallet payout already booked; wallet transactions are returned for transparency.
- For CASH payments, expect `isOnline=false` and often no escrow; skip stuck-escrow warnings.
- Provide search/filter presets: e.g., “Escrow stuck”, “Failed payments”, “Completed last 7d”.
