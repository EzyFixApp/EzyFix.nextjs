# Admin - Quản lý Lịch Hẹn (Service Appointments)

## ✅ Status & Implementation Complete

### Implementation Status
| Endpoint | Priority | Assignee | Notes | Status |
|----------|----------|----------|-------|--------|
| `GET /admin/appointments` | High | ✅ Completed | List all appointments | ✅ DONE |
| `GET /admin/appointments/{id}` | High | ✅ Completed | Get appointment details | ✅ DONE |
| `PATCH /admin/appointments/{id}/cancel` | High | ✅ Completed | Cancel appointment | ✅ DONE |
| `PATCH /admin/appointments/{id}/reassign` | Medium | ✅ Completed | Reassign technician | ✅ DONE |
| `PATCH /admin/appointments/{id}/status` | Low | ✅ Completed | Override status | ✅ DONE |

### ✅ Completed Implementation
- ✅ Create Controller: `AdminAppointmentController.cs`
- ✅ Implement Service Layer: `AdminAppointmentService.cs`
- ✅ Add Authorization Policy: `PolicyNames.Admin`
- ✅ Create DTOs: Request/Response models
- ✅ Add Validation: `[ValidateModel]` attributes
- ✅ Implement GPS tracking integration
- ✅ Implement Activity Logging
- ✅ Add Refund logic integration
- ✅ HTTP Test Suite: `AdminAppointmentManagement.http`
- ✅ Swagger documentation updated
- ✅ Entity field corrections applied

### Dependencies
- ✅ `ServiceAppointment` entity
- ✅ `ServiceDeliveryOffer` entity
- ✅ `SystemLog` entity (GPS tracking)
- ✅ `Payment` entity (for refunds)
- ✅ `ActivityLog` entity (audit trail)
- ✅ `WalletTransaction` entity (refunds)
- ✅ Issue flags logic (OVERDUE, GPS_MISSING)
- ⚠️ Notification service (for alerts)

---

## �📱 Màn hình sử dụng

| Endpoint | Màn hình Admin | Chức năng |
|----------|----------------|-----------|
| `GET /api/v1/admin/appointments` | **Danh sách tất cả lịch hẹn** | Xem toàn bộ appointments, lọc theo trạng thái/thợ/ngày |
| `GET /api/v1/admin/appointments/{id}` | **Chi tiết lịch hẹn** | Xem thông tin đầy đủ: timeline, GPS logs, media, notes |
| `PATCH /api/v1/admin/appointments/{id}/cancel` | **Hủy lịch hẹn** | Admin hủy appointment khi có sự cố hoặc khiếu nại |
| `PATCH /api/v1/admin/appointments/{id}/reassign` | **Chỉ định thợ khác** | Đổi thợ khi thợ cũ không khả dụng |
| `PATCH /api/v1/admin/appointments/{id}/status` | **Cập nhật trạng thái** | Override trạng thái trong trường hợp đặc biệt |

---

## 📋 Tổng quan

Admin giám sát và can thiệp vào **ServiceAppointment** để:
- Theo dõi tiến trình sửa chữa real-time
- Can thiệp khi khách hàng khiếu nại
- Xử lý khi thợ không khả dụng (reassign)
- Theo dõi GPS tracking để phát hiện gian lận
- Quản lý các appointment có vấn đề (DISPUTE, ABSENT)

---

## 🔍 GET /api/v1/admin/appointments

### Mục đích
Lấy danh sách **tất cả lịch hẹn** trong hệ thống với khả năng lọc, tìm kiếm và phân trang.

### Request
```http
GET /api/v1/admin/appointments?status=EN_ROUTE&technicianId={guid}&customerId={guid}&fromDate=2025-11-01&toDate=2025-11-17&page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `status` | string | ❌ | Lọc theo trạng thái | `SCHEDULED`, `EN_ROUTE`, `ARRIVED`, `CHECKING`, `PRICE_REVIEW`, `REPAIRING`, `REPAIRED`, `CANCELLED`, `ABSENT`, `DISPUTE` |
| `technicianId` | Guid | ❌ | Lọc theo ID thợ | `3fa85f64-5717-4562-b3fc-2c963f66afa6` |
| `customerId` | Guid | ❌ | Lọc theo ID khách hàng | `1fa85f64-5717-4562-b3fc-2c963f66afa6` |
| `fromDate` | DateTime | ❌ | Lọc từ ngày (UTC) | `2025-11-01T00:00:00Z` |
| `toDate` | DateTime | ❌ | Lọc đến ngày (UTC) | `2025-11-17T23:59:59Z` |
| `searchKeyword` | string | ❌ | Tìm kiếm theo địa chỉ, tên | `Nguyễn Huệ` |
| `hasIssues` | bool | ❌ | Chỉ xem appointments có vấn đề (DISPUTE, ABSENT, quá hạn) | `true` |
| `page` | int | ❌ | Số trang (mặc định: 1) | `1` |
| `pageSize` | int | ❌ | Số items/trang (mặc định: 20, max: 100) | `20` |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Appointments retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "items": [
      {
        "appointmentId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
        "offerId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
        "serviceRequestId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "customerId": "4fa85f64-5717-4562-b3fc-2c963f66afa6",
        "customerName": "Nguyễn Văn A",
        "customerPhone": "0901234567",
        "technicianId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
        "technicianName": "Trần Văn B",
        "technicianPhone": "0912345678",
        "serviceAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
        "scheduledDate": "2025-11-16",
        "actualStartTime": "2025-11-16T09:15:00Z",
        "actualEndTime": null,
        "status": "REPAIRING",
        "createdDate": "2025-11-15T10:00:00Z",
        "estimatedCost": 500000.00,
        "finalCost": 650000.00,
        "hasPayment": false,
        "paymentStatus": null,
        "hasDispute": false,
        "lastGpsUpdate": "2025-11-16T09:10:00Z",
        "issueFlags": []
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 85,
      "totalPages": 5
    }
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `appointmentId` | Guid | ID lịch hẹn |
| `offerId` | Guid | ID báo giá đã chấp nhận |
| `serviceRequestId` | Guid | ID yêu cầu dịch vụ gốc |
| `customerId` | Guid | ID khách hàng |
| `customerName` | string | Tên khách hàng |
| `customerPhone` | string | SĐT khách |
| `technicianId` | Guid | ID thợ |
| `technicianName` | string | Tên thợ |
| `technicianPhone` | string | SĐT thợ |
| `serviceAddress` | string | Địa chỉ sửa chữa |
| `scheduledDate` | DateOnly | Ngày hẹn |
| `actualStartTime` | DateTime? | Thời gian bắt đầu thực tế (khi ARRIVED) |
| `actualEndTime` | DateTime? | Thời gian kết thúc (khi REPAIRED) |
| `status` | string | Trạng thái hiện tại |
| `createdDate` | DateTime | Ngày tạo appointment |
| `estimatedCost` | decimal | Giá dự kiến |
| `finalCost` | decimal | Giá cuối cùng |
| `hasPayment` | bool | Đã tạo payment chưa |
| `paymentStatus` | string? | Trạng thái thanh toán (nếu có) |
| `hasDispute` | bool | Có tranh chấp không |
| `lastGpsUpdate` | DateTime? | Lần cập nhật GPS gần nhất |
| `issueFlags` | string[] | Cảnh báo: `OVERDUE`, `GPS_MISSING`, `NO_MEDIA` |

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Lấy danh sách thành công |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **400 Bad Request** | ❌ Query parameters không hợp lệ |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔍 GET /api/v1/admin/appointments/{id}

### Mục đích
Lấy **thông tin chi tiết đầy đủ** của một Appointment, bao gồm:
- Timeline đầy đủ từ SCHEDULED → hiện tại
- GPS tracking logs
- Media ở mỗi checkpoint
- Notes từ technician
- Payment details (nếu có)
- Dispute details (nếu có)
- Activity logs

### Request
```http
GET /api/v1/admin/appointments/{id}
Authorization: Bearer <admin_token>
```

| Parameter | Type | Vị trí | Mô tả |
|-----------|------|--------|-------|
| `id` | Guid | URL Path | ID của appointment |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Appointment details retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "appointmentId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "offerId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
    
    "serviceRequest": {
      "requestId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "serviceName": "Sửa điều hòa",
      "serviceDescription": "Điều hòa không lạnh",
      "requestAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
      "addressNote": "Tầng 3, căn 301"
    },
    
    "customer": {
      "customerId": "4fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@email.com",
      "phone": "0901234567",
      "avatarLink": "https://cloudinary.com/avatar.jpg"
    },
    
    "technician": {
      "technicianId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "Trần Văn B",
      "email": "tranvanb@email.com",
      "phone": "0912345678",
      "rating": 4.5,
      "totalJobs": 120,
      "avatarLink": "https://cloudinary.com/tech-avatar.jpg"
    },
    
    "scheduledDate": "2025-11-16",
    "actualStartTime": "2025-11-16T09:15:00Z",
    "actualEndTime": "2025-11-16T11:30:00Z",
    "status": "REPAIRED",
    "createdDate": "2025-11-15T10:00:00Z",
    
    "pricing": {
      "estimatedCost": 500000.00,
      "finalCost": 650000.00,
      "priceAdjustmentReason": "Cần thay thêm dàn nóng"
    },
    
    "timeline": [
      {
        "status": "SCHEDULED",
        "timestamp": "2025-11-15T10:00:00Z",
        "note": null
      },
      {
        "status": "EN_ROUTE",
        "timestamp": "2025-11-16T08:50:00Z",
        "note": null,
        "gpsLat": 10.7769,
        "gpsLng": 106.7009
      },
      {
        "status": "ARRIVED",
        "timestamp": "2025-11-16T09:15:00Z",
        "note": null,
        "gpsLat": 10.7769,
        "gpsLng": 106.7009
      },
      {
        "status": "CHECKING",
        "timestamp": "2025-11-16T09:20:00Z",
        "note": "Kiểm tra dàn nóng và dàn lạnh"
      },
      {
        "status": "PRICE_REVIEW",
        "timestamp": "2025-11-16T09:40:00Z",
        "note": "Cần thay dàn nóng, giá tăng lên 650k"
      },
      {
        "status": "REPAIRING",
        "timestamp": "2025-11-16T10:00:00Z",
        "note": "Bắt đầu thay thế dàn nóng"
      },
      {
        "status": "REPAIRED",
        "timestamp": "2025-11-16T11:30:00Z",
        "note": "Hoàn thành, điều hòa chạy tốt"
      }
    ],
    
    "media": [
      {
        "mediaId": "6fa85f64-5717-4562-b3fc-2c963f66afa6",
        "url": "https://cloudinary.com/before1.jpg",
        "mediaType": "INITIAL",
        "uploadedDate": "2025-11-16T09:20:00Z",
        "uploadedBy": "Trần Văn B"
      },
      {
        "mediaId": "7fa85f64-5717-4562-b3fc-2c963f66afa6",
        "url": "https://cloudinary.com/after1.jpg",
        "mediaType": "FINAL",
        "uploadedDate": "2025-11-16T11:30:00Z",
        "uploadedBy": "Trần Văn B"
      }
    ],
    
    "notes": [
      {
        "noteId": "8fa85f64-5717-4562-b3fc-2c963f66afa6",
        "status": "PRICE_REVIEW",
        "noteText": "Cần thay dàn nóng, giá tăng lên 650k. Khách đã đồng ý.",
        "createdBy": "Trần Văn B",
        "createdAt": "2025-11-16T09:40:00Z"
      }
    ],
    
    "gpsLogs": [
      {
        "logId": "9fa85f64-5717-4562-b3fc-2c963f66afa6",
        "latitude": 10.776900,
        "longitude": 106.700900,
        "loggedAt": "2025-11-16T08:50:00Z",
        "status": "EN_ROUTE"
      },
      {
        "logId": "afa85f64-5717-4562-b3fc-2c963f66afa6",
        "latitude": 10.776900,
        "longitude": 106.700900,
        "loggedAt": "2025-11-16T09:15:00Z",
        "status": "ARRIVED"
      }
    ],
    
    "payment": {
      "paymentId": "bfa85f64-5717-4562-b3fc-2c963f66afa6",
      "amount": 650000.00,
      "paymentMethod": "MOMO",
      "status": "ESCROW",
      "transactionDate": "2025-11-16T11:35:00Z",
      "invoiceRequested": false
    },
    
    "disputes": [],
    
    "activityLogs": [
      {
        "logId": "cfa85f64-5717-4562-b3fc-2c963f66afa6",
        "action": "CREATED",
        "performedBy": "System",
        "performedAt": "2025-11-15T10:00:00Z",
        "oldValue": null,
        "newValue": "SCHEDULED"
      }
    ],
    
    "walletTransactions": []
  }
}
```

### Response Fields Breakdown

#### Pricing Object
| Field | Type | Mô tả |
|-------|------|-------|
| `estimatedCost` | decimal | Giá dự kiến ban đầu |
| `finalCost` | decimal | Giá cuối cùng |
| `priceAdjustmentReason` | string? | Lý do thay đổi giá |

#### Timeline Array
Danh sách **tất cả** status transitions theo thứ tự thời gian:
- `status`: Trạng thái
- `timestamp`: Thời gian chuyển
- `note`: Ghi chú (nếu có)
- `gpsLat` / `gpsLng`: GPS (nếu có)

#### GPS Logs Array
Lịch sử **toàn bộ** GPS tracking:
- `latitude` / `longitude`: Tọa độ (6 decimals)
- `loggedAt`: Thời gian log
- `status`: Trạng thái khi log GPS

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Lấy chi tiết thành công |
| **404 Not Found** | ❌ Không tìm thấy appointment |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔄 PATCH /api/v1/admin/appointments/{id}/cancel

### Mục đích
Admin **hủy** một Appointment trong các trường hợp:
- Khách hàng khiếu nại thợ không đến
- Thợ báo không thể thực hiện
- Phát hiện gian lận
- Yêu cầu hủy khẩn cấp

### Request
```http
PATCH /api/v1/admin/appointments/{id}/cancel
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "reason": "Thợ không khả dụng, khách hàng yêu cầu hủy",
  "refundAmount": 0,
  "notifyCustomer": true,
  "notifyTechnician": true,
  "penalizeTechnician": false
}
```

### Request Body

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `reason` | string | ✅ | Lý do hủy (tối thiểu 10 ký tự) |
| `refundAmount` | decimal | ❌ | Số tiền hoàn lại khách (nếu đã thanh toán) |
| `notifyCustomer` | bool | ❌ | Gửi thông báo cho khách (mặc định: true) |
| `notifyTechnician` | bool | ❌ | Gửi thông báo cho thợ (mặc định: true) |
| `penalizeTechnician` | bool | ❌ | Phạt thợ (giảm rating, ghi nhận vi phạm) |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Business Logic

1. **Kiểm tra trạng thái hiện tại**:
   - Cho phép hủy: `SCHEDULED`, `EN_ROUTE`, `ARRIVED`, `CHECKING`, `PRICE_REVIEW`, `REPAIRING`
   - ❌ Không cho hủy: `REPAIRED` (phải dùng dispute), `CANCELLED`, `ABSENT`, `DISPUTE`

2. **Cập nhật trạng thái**:
   - Set `ServiceAppointment.Status = CANCELLED`

3. **Xử lý payment**:
   - Nếu có Payment với status = `PAYMENT_SUCCESS` hoặc `ESCROW`:
     - Tạo refund transaction nếu `refundAmount > 0`
     - Set Payment.Status = `FAILED` hoặc tạo record mới cho refund

4. **Xử lý wallet thợ**:
   - Nếu `penalizeTechnician = true`:
     - Ghi nhận vi phạm vào TechnicianProfile
     - Có thể trừ điểm hoặc tạm khóa tài khoản (tùy policy)

5. **Cập nhật ServiceRequest**:
   - Nếu chưa có offer khác được accept → set `ServiceRequest.Status = CANCELLED`

6. **Ghi log**:
   - Tạo `ActivityLog` với action = `ADMIN_CANCELLED`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Appointment cancelled successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "appointmentId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": "CANCELLED",
    "cancelledBy": "Admin (admin@ezyfix.com)",
    "cancelledAt": "2025-11-17T12:00:00Z",
    "cancelReason": "Thợ không khả dụng, khách hàng yêu cầu hủy",
    "refund": {
      "refunded": false,
      "amount": 0,
      "refundStatus": null
    },
    "penalty": {
      "applied": false,
      "technicianId": null,
      "penaltyType": null
    },
    "notifications": {
      "customerNotified": true,
      "technicianNotified": true
    }
  }
}
```

---

### Validation Rules

| Rule | Error Code | Message |
|------|-----------|---------|
| Appointment không tồn tại | `404` | `APPOINTMENT_NOT_FOUND` |
| Đã CANCELLED | `400` | `ALREADY_CANCELLED` |
| Status = REPAIRED | `400` | `CANNOT_CANCEL_COMPLETED_WORK` |
| Reason < 10 ký tự | `400` | `CANCEL_REASON_TOO_SHORT` |
| refundAmount > Payment.Amount | `400` | `REFUND_EXCEEDS_PAYMENT` |

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Hủy thành công |
| **400 Bad Request** | ❌ Validation failed |
| **404 Not Found** | ❌ Appointment không tồn tại |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔄 PATCH /api/v1/admin/appointments/{id}/reassign

### Mục đích
Admin **chỉ định thợ khác** cho appointment khi:
- Thợ hiện tại không khả dụng (ốm, tai nạn...)
- Khách hàng khiếu nại thợ
- Thợ bị phát hiện gian lận
- Yêu cầu đổi thợ có kỹ năng cao hơn

### Request
```http
PATCH /api/v1/admin/appointments/{id}/reassign
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "newTechnicianId": "6fa85f64-5717-4562-b3fc-2c963f66afa6",
  "reason": "Thợ cũ không khả dụng do ốm đột ngột",
  "notifyOldTechnician": true,
  "notifyNewTechnician": true,
  "notifyCustomer": true,
  "adjustPrice": false,
  "newEstimatedCost": null
}
```

### Request Body

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `newTechnicianId` | Guid | ✅ | ID thợ mới |
| `reason` | string | ✅ | Lý do đổi thợ |
| `notifyOldTechnician` | bool | ❌ | Thông báo cho thợ cũ (mặc định: true) |
| `notifyNewTechnician` | bool | ❌ | Thông báo cho thợ mới (mặc định: true) |
| `notifyCustomer` | bool | ❌ | Thông báo cho khách (mặc định: true) |
| `adjustPrice` | bool | ❌ | Có điều chỉnh giá không |
| `newEstimatedCost` | decimal? | ❌ | Giá mới (nếu adjustPrice = true) |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Business Logic

1. **Validation**:
   - Thợ mới phải tồn tại và có status = ACTIVE
   - Thợ mới có skill phù hợp với Service
   - Thợ mới không được trùng với thợ cũ
   - Chỉ cho phép reassign khi status = `SCHEDULED`, `EN_ROUTE`, `ARRIVED`

2. **Tạo Offer mới**:
   - Tạo `ServiceDeliveryOffer` mới với:
     - `TechnicianId` = newTechnicianId
     - `Status` = ACCEPTED
     - `EstimatedCost` = newEstimatedCost hoặc giữ nguyên
     - `Notes` = "Admin reassigned from technician [old name]"

3. **Cập nhật Appointment**:
   - Set `Appointment.OfferId` = ID của offer mới
   - Giữ nguyên các thông tin khác

4. **Xử lý Offer cũ**:
   - Giữ nguyên (để audit trail)
   - Có thể đánh dấu `IsReassigned = true` (nếu có field)

5. **Ghi log**:
   - Tạo `ActivityLog` với action = `REASSIGNED`
   - Ghi `OldValue` = old technician ID
   - Ghi `NewValue` = new technician ID

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Appointment reassigned successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "appointmentId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "oldTechnician": {
      "technicianId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "Trần Văn B",
      "phone": "0912345678"
    },
    "newTechnician": {
      "technicianId": "6fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fullName": "Lê Văn C",
      "phone": "0923456789",
      "rating": 4.8
    },
    "newOfferId": "7fa85f64-5717-4562-b3fc-2c963f66afa6",
    "priceAdjusted": false,
    "newEstimatedCost": 500000.00,
    "reassignedBy": "Admin (admin@ezyfix.com)",
    "reassignedAt": "2025-11-17T13:00:00Z",
    "reason": "Thợ cũ không khả dụng do ốm đột ngột",
    "notifications": {
      "oldTechnicianNotified": true,
      "newTechnicianNotified": true,
      "customerNotified": true
    }
  }
}
```

---

### Validation Rules

| Rule | Error Code | Message |
|------|-----------|---------|
| Thợ mới không tồn tại | `404` | `TECHNICIAN_NOT_FOUND` |
| Thợ mới = thợ cũ | `400` | `SAME_TECHNICIAN` |
| Thợ mới không có skill | `400` | `TECHNICIAN_SKILL_MISMATCH` |
| Status không cho phép | `400` | `CANNOT_REASSIGN_AT_THIS_STATUS` |
| Reason < 10 ký tự | `400` | `REASON_TOO_SHORT` |

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Reassign thành công |
| **400 Bad Request** | ❌ Validation failed |
| **404 Not Found** | ❌ Appointment hoặc thợ không tồn tại |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔄 PATCH /api/v1/admin/appointments/{id}/status

### Mục đích
Admin **override trạng thái** appointment trong các trường hợp đặc biệt:
- Sửa lỗi kỹ thuật
- Khôi phục dữ liệu
- Xử lý edge cases

### Request
```http
PATCH /api/v1/admin/appointments/{id}/status
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "newStatus": "SCHEDULED",
  "reason": "Khôi phục appointment bị hủy nhầm",
  "skipValidation": false
}
```

### Request Body

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `newStatus` | string | ✅ | Trạng thái mới |
| `reason` | string | ✅ | Lý do thay đổi |
| `skipValidation` | bool | ❌ | Bỏ qua validation workflow (cẩn thận!) |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Appointment status updated successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "appointmentId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "oldStatus": "CANCELLED",
    "newStatus": "SCHEDULED",
    "updatedBy": "Admin",
    "updatedAt": "2025-11-17T14:00:00Z",
    "reason": "Khôi phục appointment bị hủy nhầm",
    "warnings": [
      "Status changed without workflow validation"
    ]
  }
}
```

---

## 📝 Notes quan trọng cho Frontend

### 1. Hiển thị trạng thái với màu sắc
```typescript
const statusColors = {
  SCHEDULED: 'info',       // Xanh dương
  EN_ROUTE: 'warning',     // Vàng
  ARRIVED: 'info',         // Xanh dương đậm
  CHECKING: 'info',        // Xanh dương
  PRICE_REVIEW: 'warning', // Vàng cam
  REPAIRING: 'primary',    // Xanh lá nhạt
  REPAIRED: 'success',     // Xanh lá
  CANCELLED: 'default',    // Xám
  ABSENT: 'error',         // Đỏ
  DISPUTE: 'error'         // Đỏ đậm
}
```

### 2. Real-time GPS Tracking
Khi appointment có status = `EN_ROUTE` hoặc `ARRIVED`:
- Hiển thị bản đồ với vị trí thợ
- Cập nhật GPS mỗi 30 giây
- Tính khoảng cách đến địa chỉ khách

### 3. Issue Flags
Hiển thị badges cảnh báo:
- 🚨 `OVERDUE`: Appointment quá hạn so với scheduledDate
- 📍 `GPS_MISSING`: Không có GPS log trong 30 phút
- 📷 `NO_MEDIA`: Thiếu media bắt buộc (INITIAL, FINAL)
- 💰 `PRICE_MISMATCH`: Giá vượt ngưỡng AI > 20%

### 4. Timeline Visualization
Hiển thị timeline dạng vertical stepper:
```
✅ SCHEDULED - 15/11 10:00
✅ EN_ROUTE - 16/11 08:50 📍
✅ ARRIVED - 16/11 09:15 📍
✅ CHECKING - 16/11 09:20
⏳ REPAIRING - 16/11 10:00 (đang ở đây)
⏸️ REPAIRED
```

---

## 🔐 Security & Permissions

- Tất cả endpoints yêu cầu **Admin role**
- Reassign phải log đầy đủ (old tech, new tech, reason)
- Cancel có refund phải có approval workflow (nếu > threshold)
- GPS logs không được xóa (immutable)

---

## 📊 Use Cases thực tế

### Use Case 1: Khách hàng khiếu nại thợ không đến
```
1. Khách gọi hotline: "Thợ không đến sau 1 tiếng"
2. Admin vào chi tiết appointment
3. Kiểm tra GPS logs: thấy thợ vẫn ở nhà
4. PATCH /cancel với penalizeTechnician = true
5. PATCH /reassign để chỉ định thợ khác
```

### Use Case 2: Theo dõi real-time
```
1. Admin vào màn "Appointments đang active"
2. Filter: status = EN_ROUTE hoặc ARRIVED
3. Xem GPS tracking trên bản đồ
4. Phát hiện thợ đang đi sai hướng → gọi điện nhắc
```

### Use Case 3: Xử lý appointment quá hạn
```
1. Hệ thống cảnh báo: "10 appointments quá hạn > 2 giờ"
2. Admin vào từng appointment kiểm tra
3. Nếu thợ không phản hồi → Cancel + Reassign
4. Nếu khách không phản hồi → Mark ABSENT
```

---

## 🎯 Summary

| Endpoint | Method | Dùng cho màn hình | Quyền |
|----------|--------|-------------------|-------|
| `/admin/appointments` | GET | Danh sách appointments | Admin |
| `/admin/appointments/{id}` | GET | Chi tiết appointment | Admin |
| `/admin/appointments/{id}/cancel` | PATCH | Hủy appointment | Admin |
| `/admin/appointments/{id}/reassign` | PATCH | Đổi thợ | Admin |
| `/admin/appointments/{id}/status` | PATCH | Override status | Admin |

Tất cả endpoints:
- Yêu cầu Bearer token
- Ghi ActivityLog
- Hỗ trợ notifications
- Có validation đầy đủ
