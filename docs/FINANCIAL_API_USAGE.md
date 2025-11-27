 # Admin Financial Management - API Usage Guide

## 📡 Available APIs

### 1. **GET /api/v1/admin/payouts** - List Payouts
Lấy danh sách tất cả yêu cầu rút tiền với filter và pagination.

**Service Method:**
```typescript
WalletService.getAllPayouts(params)
```

**Parameters:**
```typescript
{
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED',
  technicianId?: string,
  page?: number,        // default: 1
  pageSize?: number     // default: 20
}
```

**Response:**
```typescript
{
  items: AdminWalletPayout[],
  meta: {
    total_pages: number,
    total_items: number,
    current_page: number,
    page_size: number
  }
}
```

**Usage in Component:**
```typescript
const response = await WalletService.getAllPayouts({
  page: 1,
  pageSize: 20,
  status: 'PENDING'
});
setPayouts(response.items);
```

---

### 2. **POST /api/v1/admin/payouts/{id}/approve** - Approve Payout
Duyệt yêu cầu rút tiền, tạo VietQR code.

**Service Method:**
```typescript
WalletService.approvePayout(payoutId, request)
```

**Request Body:**
```typescript
{
  purpose: string  // required, ví dụ: "Rút ví EZYFIX"
}
```

**Response:**
```typescript
AdminWalletPayout {
  ...
  status: 'APPROVED',
  vietQrPayload: string,        // VietQR string
  vietQrImageBase64: string,    // Base64 QR image
  approvedAt: string
}
```

**Usage:**
```typescript
await WalletService.approvePayout(payout.payoutRequestId, {
  purpose: 'Rút ví EZYFIX'
});
// → Status chuyển từ PENDING → APPROVED
// → QR code được tạo để chuyển khoản
```

---

### 3. **POST /api/v1/admin/payouts/{id}/mark-paid** - Mark as Paid
Xác nhận đã chuyển tiền cho thợ.

**Service Method:**
```typescript
WalletService.markPaid(payoutId, request)
```

**Request Body (Optional):**
```typescript
{
  proofNote?: string,        // Ghi chú xác nhận
  referenceNumber?: string   // Mã tham chiếu giao dịch
}
```

**Response:**
```typescript
AdminWalletPayout {
  ...
  status: 'PAID',
  paidAt: string,
  holdAmount: 0  // Hold đã được giải phóng
}
```

**Usage:**
```typescript
await WalletService.markPaid(payout.payoutRequestId, {
  proofNote: 'Đã chuyển lúc 10:30',
  referenceNumber: 'FT123456'
});
// → Status chuyển từ APPROVED → PAID
// → Tiền trừ khỏi ví thợ, hold được giải phóng
```

---

### 4. **POST /api/v1/admin/payouts/{id}/reject** - Reject Payout
Từ chối yêu cầu rút tiền.

**Service Method:**
```typescript
WalletService.rejectPayout(payoutId, request)
```

**Request Body:**
```typescript
{
  reason: string  // required, lý do từ chối
}
```

**Response:**
```typescript
AdminWalletPayout {
  ...
  status: 'REJECTED',
  rejectedAt: string,
  holdAmount: 0  // Hold đã được giải phóng
}
```

**Usage:**
```typescript
await WalletService.rejectPayout(payout.payoutRequestId, {
  reason: 'Thông tin tài khoản không hợp lệ'
});
// → Status chuyển sang REJECTED
// → Hold được giải phóng, thợ có thể tạo request mới
```

---

## 🔄 Workflow

```
1. Thợ tạo request → Status: PENDING

2. Admin duyệt (Approve)
   → Status: APPROVED
   → VietQR code được tạo

3a. Admin chuyển khoản → Mark Paid
    → Status: PAID
    → Tiền trừ khỏi ví

3b. Hoặc Admin từ chối (Reject)
    → Status: REJECTED
    → Hold được giải phóng
```

---

## 📝 Important Fields

### AdminWalletPayout Type:
```typescript
{
  payoutRequestId: string,
  technicianId: string,
  technicianName: string,
  technicianEmail: string,
  
  amount: number,              // Số tiền rút
  holdAmount: number,          // Số tiền đang giữ
  
  receiverName: string,        // Tên tài khoản
  receiverAccount: string,     // Số tài khoản
  bankCode: string,            // Mã ngân hàng
  
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED',
  
  requestedAt: string,
  approvedAt: string | null,
  paidAt: string | null,
  rejectedAt: string | null,
  
  vietQrPayload: string | null,      // QR payload string
  vietQrImageBase64: string | null,  // Base64 image
  
  note?: string
}
```

---

## 🎯 Common Use Cases

### Load payouts với filter:
```typescript
const response = await WalletService.getAllPayouts({
  status: 'PENDING',
  page: 1,
  pageSize: 20
});
```

### Approve và hiển thị QR:
```typescript
const result = await WalletService.approvePayout(id, {
  purpose: 'Rút ví EZYFIX'
});

// Display QR image
<img src={`data:image/png;base64,${result.vietQrImageBase64}`} />
```

### Mark as paid với note:
```typescript
await WalletService.markPaid(id, {
  proofNote: 'Đã chuyển khoản thành công',
  referenceNumber: 'FT123456'
});
```

### Reject với lý do:
```typescript
await WalletService.rejectPayout(id, {
  reason: 'Thông tin ngân hàng không chính xác'
});
```

---

## ⚠️ Error Handling

Tất cả API calls đều wrap trong try-catch:

```typescript
try {
  const result = await WalletService.approvePayout(id, { purpose });
  toast.success('Đã duyệt yêu cầu thành công');
  fetchPayouts(); // Refresh list
} catch (error: any) {
  toast.error(error.message || 'Có lỗi xảy ra');
}
```

---

**Last Updated:** November 27, 2025
