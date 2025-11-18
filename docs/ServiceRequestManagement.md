# Admin - Quản lý Yêu cầu Dịch vụ (Service Requests)

## ✅ Status & Implementation Complete

### Implementation Status
| Endpoint | Priority | Assignee | Notes | Status |
|----------|----------|----------|-------|--------|
| `GET /admin/serviceRequests` | High | ✅ Completed | List all service requests | ✅ DONE |
| `GET /admin/serviceRequests/{id}` | High | ✅ Completed | Get request details | ✅ DONE |
| `PATCH /admin/serviceRequests/{id}/cancel` | High | ✅ Completed | Cancel request | ✅ DONE |
| `PATCH /admin/serviceRequests/{id}/status` | Medium | ✅ Completed | Override status | ✅ DONE |

### ✅ Completed Implementation
- ✅ Create Controller: `AdminServiceRequestController.cs` 
- ✅ Implement Service Layer: `AdminServiceRequestService.cs`
- ✅ Add Authorization Policy: `PolicyNames.Admin`
- ✅ Create DTOs: Request/Response models
- ✅ Add Validation: `[ValidateModel]` attributes
- ✅ Implement Activity Logging
- ✅ HTTP Test Suite: Available for testing
- ✅ Swagger documentation updated
- ✅ Entity relationship corrections applied

### Dependencies
- ✅ `ServiceRequest` entity
- ✅ `ServiceDeliveryOffer` entity
- ✅ `ActivityLog` entity
- ✅ `Users` entity (customer details)
- ✅ `Services` entity (service information)
- ✅ `Media` entity (attachments)
- ⚠️ Notification service (for alerts)

---

## �📱 Màn hình sử dụng

| Endpoint | Màn hình Admin | Chức năng |
|----------|----------------|-----------|
| `GET /api/v1/admin/serviceRequests` | **Danh sách tất cả yêu cầu dịch vụ** | Xem toàn bộ requests từ customers, lọc theo trạng thái/ngày/khách hàng |
| `GET /api/v1/admin/serviceRequests/{id}` | **Chi tiết yêu cầu dịch vụ** | Xem thông tin đầy đủ của một request, bao gồm offers và media |
| `PATCH /api/v1/admin/serviceRequests/{id}/cancel` | **Hủy yêu cầu dịch vụ** | Admin hủy request khi phát hiện spam/gian lận hoặc theo yêu cầu khách hàng |
| `PATCH /api/v1/admin/serviceRequests/{id}/status` | **Cập nhật trạng thái** | Chuyển trạng thái request thủ công trong các trường hợp đặc biệt |

---

## 📋 Tổng quan

Admin có toàn quyền giám sát và can thiệp vào **ServiceRequest** để:
- Theo dõi tất cả yêu cầu dịch vụ trong hệ thống
- Can thiệp khi có khiếu nại hoặc phát hiện gian lận
- Hỗ trợ khách hàng khi có vấn đề với technician
- Theo dõi chất lượng dịch vụ qua các request

---

## 🔍 GET /api/v1/admin/serviceRequests

### Mục đích
Lấy danh sách **tất cả yêu cầu dịch vụ** trong hệ thống với khả năng lọc, tìm kiếm và phân trang.

### Request
```http
GET /api/v1/admin/serviceRequests?status=PENDING&customerId={guid}&serviceId={guid}&fromDate=2025-11-01&toDate=2025-11-17&page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `status` | string | ❌ | Lọc theo trạng thái request | `PENDING`, `QUOTED`, `QUOTE_REJECTED`, `QUOTE_ACCEPTED`, `COMPLETED`, `CANCELLED` |
| `customerId` | Guid | ❌ | Lọc theo ID khách hàng | `3fa85f64-5717-4562-b3fc-2c963f66afa6` |
| `serviceId` | Guid | ❌ | Lọc theo loại dịch vụ | `1fa85f64-5717-4562-b3fc-2c963f66afa6` |
| `fromDate` | DateTime | ❌ | Lọc requests từ ngày (UTC) | `2025-11-01T00:00:00Z` |
| `toDate` | DateTime | ❌ | Lọc requests đến ngày (UTC) | `2025-11-17T23:59:59Z` |
| `searchKeyword` | string | ❌ | Tìm kiếm theo tên, SĐT, địa chỉ | `Nguyễn Văn A` |
| `page` | int | ❌ | Số trang (mặc định: 1) | `1` |
| `pageSize` | int | ❌ | Số items/trang (mặc định: 20, max: 100) | `20` |

### Authorization
- ✅ **Admin ONLY**
- ❌ Customer/Technician KHÔNG được truy cập
- Policy: `PolicyNames.Admin`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Service requests retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "items": [
      {
        "requestId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
        "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "customerName": "Nguyễn Văn A",
        "customerPhone": "0901234567",
        "serviceId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
        "serviceName": "Sửa điều hòa",
        "fullName": "Nguyễn Văn A",
        "phoneNumber": "0901234567",
        "requestAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
        "serviceDescription": "Điều hòa không lạnh, có tiếng kêu lạ",
        "addressNote": "Tầng 3, căn 301",
        "requestedDate": "2025-11-15T08:30:00Z",
        "expectedStartTime": "2025-11-16T09:00:00Z",
        "status": "QUOTED",
        "createdDate": "2025-11-15T08:30:00Z",
        "totalOffers": 3,
        "acceptedOfferId": null,
        "mediaCount": 2
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 150,
      "totalPages": 8
    }
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `requestId` | Guid | ID duy nhất của yêu cầu |
| `customerId` | Guid | ID khách hàng tạo request |
| `customerName` | string | Tên khách hàng (từ Users table) |
| `customerPhone` | string | SĐT khách hàng |
| `serviceId` | Guid | ID loại dịch vụ |
| `serviceName` | string | Tên dịch vụ |
| `fullName` | string | Họ tên người nhận dịch vụ |
| `phoneNumber` | string | SĐT liên hệ |
| `requestAddress` | string | Địa chỉ sửa chữa |
| `serviceDescription` | string | Mô tả vấn đề |
| `addressNote` | string? | Ghi chú địa chỉ (tầng, căn...) |
| `requestedDate` | DateTime | Ngày tạo yêu cầu |
| `expectedStartTime` | DateTime? | Thời gian mong muốn thợ đến |
| `status` | string | Trạng thái hiện tại |
| `createdDate` | DateTime | Ngày tạo record |
| `totalOffers` | int | Số lượng báo giá đã nhận |
| `acceptedOfferId` | Guid? | ID của offer đã chấp nhận (nếu có) |
| `mediaCount` | int | Số lượng ảnh/video đính kèm |

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Lấy danh sách thành công |
| **401 Unauthorized** | ❌ Không có token hoặc token hết hạn |
| **403 Forbidden** | ❌ Không phải Admin |
| **400 Bad Request** | ❌ Query parameters không hợp lệ (pageSize > 100) |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔍 GET /api/v1/admin/serviceRequests/{id}

### Mục đích
Lấy **thông tin chi tiết** của một ServiceRequest, bao gồm:
- Thông tin khách hàng đầy đủ
- Tất cả offers đã nhận (kể cả REJECTED/EXPIRED)
- Media đính kèm
- Activity logs
- Voucher đã sử dụng (nếu có)

### Request
```http
GET /api/v1/admin/serviceRequests/{id}
Authorization: Bearer <admin_token>
```

| Parameter | Type | Vị trí | Mô tả |
|-----------|------|--------|-------|
| `id` | Guid | URL Path | ID của service request |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Service request details retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "requestId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "customer": {
      "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "nguyenvana@email.com",
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "phone": "0901234567",
      "avatarLink": "https://cloudinary.com/avatar123.jpg",
      "isVerify": true
    },
    "serviceId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
    "service": {
      "serviceId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
      "serviceName": "Sửa điều hòa",
      "categoryName": "Điện lạnh"
    },
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0901234567",
    "requestAddress": "123 Nguyễn Huệ, Q.1, TP.HCM",
    "serviceDescription": "Điều hòa không lạnh, có tiếng kêu lạ khi chạy",
    "addressNote": "Tầng 3, căn 301, gọi trước 15 phút",
    "requestedDate": "2025-11-15T08:30:00Z",
    "expectedStartTime": "2025-11-16T09:00:00Z",
    "status": "QUOTED",
    "createdDate": "2025-11-15T08:30:00Z",
    
    "offers": [
      {
        "offerId": "4fa85f64-5717-4562-b3fc-2c963f66afa6",
        "technicianId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
        "technicianName": "Trần Văn B",
        "technicianPhone": "0912345678",
        "technicianRating": 4.5,
        "estimatedCost": 500000.00,
        "finalCost": 0.00,
        "submitDate": "2025-11-15T09:00:00Z",
        "status": "PENDING",
        "notes": "Có thể là thiếu gas hoặc lỗi dàn nóng"
      }
    ],
    
    "media": [
      {
        "mediaId": "7fa85f64-5717-4562-b3fc-2c963f66afa6",
        "url": "https://cloudinary.com/image123.jpg",
        "mediaType": "INITIAL",
        "uploadedDate": "2025-11-15T08:30:00Z"
      }
    ],
    
    "voucherUsages": [],
    
    "activityLogs": [
      {
        "logId": "8fa85f64-5717-4562-b3fc-2c963f66afa6",
        "action": "CREATED",
        "performedBy": "Nguyễn Văn A",
        "performedAt": "2025-11-15T08:30:00Z",
        "oldValue": null,
        "newValue": "PENDING"
      }
    ]
  }
}
```

### Response Fields Breakdown

#### Customer Object
| Field | Type | Mô tả |
|-------|------|-------|
| `userId` | Guid | ID user trong hệ thống |
| `email` | string | Email khách hàng |
| `firstName` | string | Tên |
| `lastName` | string | Họ |
| `phone` | string | Số điện thoại |
| `avatarLink` | string? | URL ảnh đại diện |
| `isVerify` | bool | Đã xác thực email chưa |

#### Service Object
| Field | Type | Mô tả |
|-------|------|-------|
| `serviceId` | Guid | ID dịch vụ |
| `serviceName` | string | Tên dịch vụ |
| `categoryName` | string | Danh mục dịch vụ |

#### Offers Array
Danh sách **tất cả** offers (kể cả đã reject/expired):
- `offerId`: ID báo giá
- `technicianId`: ID thợ
- `technicianName`: Tên thợ
- `technicianPhone`: SĐT thợ
- `technicianRating`: Đánh giá trung bình
- `estimatedCost`: Giá dự kiến
- `finalCost`: Giá cuối (nếu đã kiểm tra)
- `submitDate`: Ngày gửi báo giá
- `status`: `PENDING` | `ACCEPTED` | `REJECTED` | `EXPIRED`
- `notes`: Ghi chú của thợ

#### Media Array
- `mediaId`: ID media
- `url`: URL ảnh/video
- `mediaType`: `ISSUE` | `INITIAL` | `EXCEED` | `FINAL` | `PAYMENT` | `OTHER`
- `uploadedDate`: Ngày upload

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Lấy chi tiết thành công |
| **404 Not Found** | ❌ Không tìm thấy request với ID này |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔄 PATCH /api/v1/admin/serviceRequests/{id}/cancel

### Mục đích
Admin **hủy** một ServiceRequest trong các trường hợp:
- Phát hiện spam/gian lận
- Khách hàng yêu cầu hủy qua hotline
- Vi phạm điều khoản sử dụng
- Request không phù hợp

### Request
```http
PATCH /api/v1/admin/serviceRequests/{id}/cancel
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "reason": "Phát hiện request giả mạo, khách hàng không tồn tại",
  "notifyCustomer": true,
  "notifyTechnicians": true
}
```

### Request Body

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `reason` | string | ✅ | Lý do hủy (tối thiểu 10 ký tự) |
| `notifyCustomer` | bool | ❌ | Gửi thông báo cho khách (mặc định: true) |
| `notifyTechnicians` | bool | ❌ | Gửi thông báo cho các thợ đã báo giá (mặc định: true) |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Business Logic

1. **Kiểm tra trạng thái hiện tại**:
   - Chỉ cho phép hủy khi status = `PENDING`, `QUOTED`, `QUOTE_REJECTED`
   - ❌ Không cho hủy khi đã `QUOTE_ACCEPTED`, `COMPLETED`, `CANCELLED`

2. **Cập nhật trạng thái**:
   - Set `ServiceRequest.Status = CANCELLED`

3. **Xử lý offers liên quan**:
   - Tất cả offers `PENDING` → chuyển sang `EXPIRED`
   - Offers đã `ACCEPTED` → giữ nguyên (để audit trail)

4. **Ghi log**:
   - Tạo `ActivityLog` với action = `CANCELLED`
   - `PerformedBy` = Admin UserId
   - `Notes` = reason

5. **Thông báo**:
   - Nếu `notifyCustomer = true`: gửi email + push notification
   - Nếu `notifyTechnicians = true`: gửi cho tất cả thợ có offer PENDING

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Service request cancelled successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "requestId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "status": "CANCELLED",
    "cancelledBy": "Admin",
    "cancelledAt": "2025-11-17T10:30:00Z",
    "cancelReason": "Phát hiện request giả mạo, khách hàng không tồn tại",
    "expiredOffersCount": 2,
    "notificationsSent": {
      "customer": true,
      "technicians": 2
    }
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `requestId` | Guid | ID request đã hủy |
| `status` | string | Trạng thái mới: `CANCELLED` |
| `cancelledBy` | string | Người hủy (Admin) |
| `cancelledAt` | DateTime | Thời gian hủy |
| `cancelReason` | string | Lý do hủy |
| `expiredOffersCount` | int | Số offers đã set EXPIRED |
| `notificationsSent` | object | Tóm tắt thông báo đã gửi |

---

### Validation Rules

| Rule | Error Code | Message |
|------|-----------|---------|
| Request không tồn tại | `404` | `SERVICE_REQUEST_NOT_FOUND` |
| Đã CANCELLED trước đó | `400` | `REQUEST_ALREADY_CANCELLED` |
| Đã QUOTE_ACCEPTED | `400` | `CANNOT_CANCEL_ACCEPTED_REQUEST` |
| Đã COMPLETED | `400` | `CANNOT_CANCEL_COMPLETED_REQUEST` |
| Reason < 10 ký tự | `400` | `CANCEL_REASON_TOO_SHORT` |

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Hủy thành công |
| **400 Bad Request** | ❌ Trạng thái không cho phép hủy hoặc reason không hợp lệ |
| **404 Not Found** | ❌ Không tìm thấy request |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔄 PATCH /api/v1/admin/serviceRequests/{id}/status

### Mục đích
Admin **thủ công cập nhật trạng thái** ServiceRequest trong các trường hợp đặc biệt:
- Khôi phục request bị hủy nhầm
- Chuyển trạng thái khi có vấn đề kỹ thuật
- Xử lý các edge cases không cover bởi flow thông thường

### Request
```http
PATCH /api/v1/admin/serviceRequests/{id}/status
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "newStatus": "PENDING",
  "reason": "Khôi phục request bị hủy nhầm sau khi xác minh khách hàng",
  "notifyAffectedParties": true
}
```

### Request Body

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `newStatus` | string | ✅ | Trạng thái mới: `PENDING`, `QUOTED`, `QUOTE_REJECTED`, `QUOTE_ACCEPTED`, `COMPLETED`, `CANCELLED` |
| `reason` | string | ✅ | Lý do thay đổi (tối thiểu 10 ký tự) |
| `notifyAffectedParties` | bool | ❌ | Gửi thông báo cho customer/technicians (mặc định: false) |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Business Logic

1. **Validation**:
   - `newStatus` phải khác `currentStatus`
   - Reason phải >= 10 ký tự
   - Kiểm tra logic transition (không cho chuyển bừa)

2. **Allowed Transitions** (Admin có quyền cao hơn user thường):
   - Bất kỳ trạng thái → `CANCELLED` (hủy khẩn cấp)
   - `CANCELLED` → `PENDING` (khôi phục)
   - `QUOTED` → `PENDING` (reset để thợ báo giá lại)
   - `QUOTE_REJECTED` → `QUOTED` (khôi phục offer)

3. **Ghi log**:
   - Tạo `ActivityLog` với action = `ADMIN_STATUS_OVERRIDE`
   - Ghi `OldValue` và `NewValue`
   - Ghi `Reason`

4. **Side effects**:
   - Nếu `CANCELLED` → `PENDING`: reset lại offers về PENDING nếu chưa EXPIRED
   - Nếu `QUOTE_ACCEPTED` → `QUOTED`: cần xử lý appointment đã tạo (warning)

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Service request status updated successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "requestId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
    "oldStatus": "CANCELLED",
    "newStatus": "PENDING",
    "updatedBy": "Admin (admin@ezyfix.com)",
    "updatedAt": "2025-11-17T11:00:00Z",
    "reason": "Khôi phục request bị hủy nhầm sau khi xác minh khách hàng",
    "warnings": []
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `requestId` | Guid | ID request |
| `oldStatus` | string | Trạng thái cũ |
| `newStatus` | string | Trạng thái mới |
| `updatedBy` | string | Admin thực hiện |
| `updatedAt` | DateTime | Thời gian cập nhật |
| `reason` | string | Lý do |
| `warnings` | string[] | Cảnh báo nếu có side effects |

---

### Validation Rules

| Rule | Error Code | Message |
|------|-----------|---------|
| newStatus = currentStatus | `400` | `STATUS_UNCHANGED` |
| Reason < 10 ký tự | `400` | `REASON_TOO_SHORT` |
| Invalid status value | `400` | `INVALID_STATUS_VALUE` |
| Request không tồn tại | `404` | `SERVICE_REQUEST_NOT_FOUND` |

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Cập nhật thành công |
| **400 Bad Request** | ❌ Validation failed |
| **404 Not Found** | ❌ Request không tồn tại |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 📝 Notes quan trọng cho Frontend

### 1. Hiển thị trạng thái với màu sắc
```typescript
const statusColors = {
  PENDING: 'warning',      // Vàng
  QUOTED: 'info',          // Xanh dương
  QUOTE_ACCEPTED: 'success', // Xanh lá
  QUOTE_REJECTED: 'error',   // Đỏ
  COMPLETED: 'success',      // Xanh lá
  CANCELLED: 'default'       // Xám
}
```

### 2. Actions dựa theo trạng thái
- `PENDING` / `QUOTED`: Cho phép Cancel
- `QUOTE_REJECTED`: Cho phép manual override status
- `CANCELLED`: Cho phép khôi phục (restore)
- `QUOTE_ACCEPTED` / `COMPLETED`: Không cho phép cancel trực tiếp

### 3. Notification Center
Sau khi cancel/update status, admin nên xem log thông báo đã gửi:
- Email sent: ✅ / ❌
- Push notifications: số lượng đã gửi
- SMS (nếu critical): trạng thái

### 4. Audit Trail
Luôn hiển thị `ActivityLogs` ở màn hình chi tiết để admin biết:
- Ai đã thao tác gì
- Khi nào
- Lý do gì

---

## 🔐 Security & Permissions

- Tất cả endpoints yêu cầu **Admin role**
- Ghi log mọi thao tác (WHO, WHEN, WHAT, WHY)
- Rate limiting: max 100 requests/phút/admin
- Không cho phép bulk delete (phải cancel từng request)

---

## 📊 Use Cases thực tế

### Use Case 1: Phát hiện Spam
```
1. Admin vào màn "Danh sách requests"
2. Filter: createdDate = hôm nay, customerId = X
3. Thấy cùng 1 customer tạo 20 requests giống nhau
4. Click vào từng request → Cancel với reason "Spam"
5. Hệ thống gửi warning email cho customer
```

### Use Case 2: Khách hàng gọi hotline hủy
```
1. Customer gọi: "Em muốn hủy đơn vì đã tự sửa được"
2. Admin search theo SĐT hoặc requestId
3. Vào chi tiết request, kiểm tra trạng thái
4. Nếu chưa QUOTE_ACCEPTED → Cancel
5. Nếu đã QUOTE_ACCEPTED → Từ chối, hướng dẫn khách liên hệ thợ
```

### Use Case 3: Khôi phục request bị hủy nhầm
```
1. Technician báo: "Request vừa bị hủy nhầm"
2. Admin vào ActivityLogs kiểm tra
3. Xác nhận hủy nhầm
4. PATCH /status với newStatus = PENDING
5. Notify lại technicians
```

---

## 🎯 Summary

| Endpoint | Method | Dùng cho màn hình | Quyền |
|----------|--------|-------------------|-------|
| `/admin/serviceRequests` | GET | Danh sách tất cả requests | Admin |
| `/admin/serviceRequests/{id}` | GET | Chi tiết request | Admin |
| `/admin/serviceRequests/{id}/cancel` | PATCH | Hủy request | Admin |
| `/admin/serviceRequests/{id}/status` | PATCH | Cập nhật trạng thái thủ công | Admin |

Tất cả endpoints đều:
- Yêu cầu Bearer token
- Ghi ActivityLog
- Hỗ trợ notifications
- Có validation đầy đủ
