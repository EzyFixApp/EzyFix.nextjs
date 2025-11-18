# Admin - Xử lý Tranh chấp (Disputes)

## 📊 Status & TODO

### Implementation Status
| Endpoint | Priority | Assignee | Notes | Status |
|----------|----------|----------|-------|--------|
| `GET /admin/disputes` | High | ✅ | List all disputes with filtering | ✅ DONE |
| `GET /admin/disputes/{id}` | High | ✅ | Get dispute details with evidence | ✅ DONE |
| `PATCH /admin/disputes/{id}/review` | High | ✅ | Start reviewing (OPEN→IN_REVIEW) | ✅ DONE |
| `PATCH /admin/disputes/{id}/resolve` | Critical | ✅ | Resolve dispute with actions | ✅ DONE |
| `POST /admin/disputes/{id}/messages` | Medium | ✅ | Add admin message | ✅ DONE |

### TODO Checklist
- [x] Create Controller: `AdminDisputeController.cs`
- [x] Implement Service Layer: `AdminDisputeService.cs`
- [x] Add Authorization Policy: `PolicyNames.AdminOnly`
- [x] Create DTOs: Request/Response models in `AdminDisputeModels.cs`
- [x] Add Validation: DataAnnotations on request models
- [x] Implement Activity Logging (using ActivityLog entity with admin UserId from JWT)
- [x] Fix EF Core change tracking for Dispute entity updates
- [x] Test all endpoints with HTTP test file
- [ ] Implement Refund integration (payment gateway integration needed)
- [ ] Implement Commission adjustment logic (wallet service integration)
- [ ] Implement Technician penalty system (future enhancement)
- [ ] Add Unit Tests
- [ ] Add Integration Tests

### Dependencies
- ✅ `Dispute` entity (Status: OPEN, IN_REVIEW, RESOLVED)
- ✅ `ServiceAppointment` entity (nav: Appointment)
- ✅ `Payment` entity (for refunds - status update to Failed)
- ✅ `ActivityLog` entity (tracks all admin actions with UserId from JWT)
- ✅ `Media` entity (for evidence URLs)
- ✅ `IHttpContextAccessor` (extracts admin UserId from JWT claims)
- ✅ EF Core change tracking (uses `Context.Entry().State = Modified`)
- ⚠️ `WalletAccount` entity (for adjustments - TODO)
- ⚠️ Notification service (for alerts - TODO)

---

## �📱 Màn hình sử dụng

| Endpoint | Màn hình Admin | Chức năng |
|----------|----------------|-----------|
| `GET /api/admin/disputes` | **Danh sách tất cả tranh chấp** | Xem toàn bộ disputes, lọc theo trạng thái |
| `GET /api/admin/disputes/{id}` | **Chi tiết tranh chấp** | Xem thông tin đầy đủ: timeline, media, messages |
| `PATCH /api/admin/disputes/{id}/review` | **Chuyển sang xem xét** | Đưa dispute vào xử lý (OPEN → IN_REVIEW) |
| `PATCH /api/admin/disputes/{id}/resolve` | **Giải quyết tranh chấp** | Kết thúc dispute với phán quyết cụ thể |
| `POST /api/admin/disputes/{id}/messages` | **Gửi tin nhắn** | Thêm ghi chú/message vào dispute |

---

## 📋 Tổng quan

Admin xử lý **Dispute** để:
- Giải quyết mâu thuẫn giữa khách hàng và thợ
- Quyết định refund, partial refund, hoặc giữ nguyên
- Điều chỉnh commission khi cần thiết
- Ghi nhận vi phạm của technician
- Đảm bảo công bằng cho cả hai bên

---

## 🔍 GET /api/admin/disputes

### Request
```http
GET /api/admin/disputes?status=IN_REVIEW&page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `status` | string | Optional. Filter: `OPEN`, `IN_REVIEW`, `RESOLVED` |
| `page` | int | Default: 1 |
| `pageSize` | int | Default: 10 |

### Response
```json
{
  "statusCode": 200,
  "message": "Disputes retrieved successfully",
  "isSuccess": true,
  "data": {
    "items": [
      {
        "disputeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "appointmentId": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
        "customerName": "Nguyễn Văn A",
        "technicianName": "Trần Văn B",
        "reason": "Thợ không sửa được, yêu cầu hoàn tiền",
        "status": "IN_REVIEW",
        "amount": 650000.00,
        "createdDate": "2025-11-16T12:00:00Z",
        "daysOpen": 2,
        "raisedBy": "CUSTOMER"
      }
    ],
    "totalCount": 45,
    "pageNumber": 1,
    "pageSize": 20,
    "summary": {
      "totalDisputes": 45,
      "openDisputes": 12,
      "inReviewDisputes": 8,
      "resolvedDisputes": 25
    }
  }
}
```

---

## 🔍 GET /api/admin/disputes/{id}

### Request
```http
GET /api/admin/disputes/{disputeId}
Authorization: Bearer <admin_token>
```

### Response
```json
{
  "statusCode": 200,
  "message": "Dispute details retrieved successfully",
  "isSuccess": true,
  "data": {
    "disputeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "appointmentId": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
    "reason": "Thợ không sửa được, yêu cầu hoàn tiền",
    "description": "Chi tiết giải quyết sẽ được lưu vào ResolutionNotes",
    "status": "IN_REVIEW",
    "createdDate": "2025-11-16T12:00:00Z",
    "resolvedDate": null,
    
    "customerId": "5fa85f64-5717-4562-b3fc-2c963f66afa8",
    "customerName": "Nguyễn Văn A",
    "customerPhone": "0901234567",
    
    "technicianId": "6fa85f64-5717-4562-b3fc-2c963f66afa9",
    "technicianName": "Trần Văn B",
    "technicianPhone": "0909876543",
    
    "finalCost": 650000.00,
    "paymentStatus": "Completed",
    "scheduledDate": "2025-11-15",
    
    "customerEvidenceUrls": [
      "https://cloudinary.com/evidence1.jpg",
      "https://cloudinary.com/evidence2.jpg"
    ],
    "technicianEvidenceUrls": [
      "https://cloudinary.com/tech_photo1.jpg"
    ],
    
    "activityHistory": [
      {
        "timestamp": "2025-11-16T14:00:00Z",
        "action": "Updated",
        "performedBy": "Admin User",
        "details": "OPEN → IN_REVIEW"
      }
    ]
  }
}
```

---

## 🔄 PATCH /api/admin/disputes/{id}/review

### Request
```http
PATCH /api/admin/disputes/{disputeId}/review
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "adminNotes": "Tranh chấp giá trị cao, cần xử lý ngay",
  "status": "IN_REVIEW"
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `adminNotes` | string | No | Ghi chú của admin |
| `status` | string | Yes | Must be "IN_REVIEW" |

### Business Logic
1. Validation: Status phải là `OPEN`
2. Chuyển status từ `OPEN` → `IN_REVIEW`
3. Extract admin UserId from JWT token claims using `IHttpContextAccessor`
4. Mark dispute entity as modified using `Context.Entry(dispute).State = EntityState.Modified`
5. Log activity với ActivityLog entity (UserId, Action=Updated, OldValue="OPEN", NewValue="IN_REVIEW: {notes}")
6. Commit changes to database
7. Return success response

### Response
```json
{
  "statusCode": 200,
  "message": "Dispute reviewed successfully",
  "isSuccess": true,
  "data": true
}
```

### Error Responses
```json
{
  "statusCode": 404,
  "message": "Dispute {id} not found",
  "isSuccess": false
}
```

```json
{
  "statusCode": 400,
  "message": "Only OPEN disputes can be reviewed",
  "isSuccess": false
}
```

---

## ✅ PATCH /api/admin/disputes/{id}/resolve

### Request
```http
PATCH /api/admin/disputes/{disputeId}/resolve
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "resolution": "FAVOR_CUSTOMER",
  "resolutionNotes": "Xác nhận thợ không sửa được như khách hàng khiếu nại. Hoàn tiền toàn bộ.",
  "refundAmount": 650000.00,
  "adjustTechnicianCommission": true,
  "applyTechnicianPenalty": true
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `resolution` | string | Yes | `FAVOR_CUSTOMER`, `FAVOR_TECHNICIAN`, `PARTIAL_REFUND`, `NO_ACTION` |
| `resolutionNotes` | string | No | Ghi chú quyết định chi tiết |
| `refundAmount` | decimal | No | Số tiền hoàn (nếu có refund) |
| `adjustTechnicianCommission` | bool | No | Default: false |
| `applyTechnicianPenalty` | bool | No | Default: false |

### Business Logic

1. **Validation**: Status phải là `IN_REVIEW`
2. **Xử lý theo resolution**:
   - `FAVOR_CUSTOMER`: Có thể kèm refund
   - `FAVOR_TECHNICIAN`: Giữ nguyên payment
   - `PARTIAL_REFUND`: Refund một phần
   - `NO_ACTION`: Không xử lý gì
3. **Cập nhật Dispute**:
   - Status = `RESOLVED`
   - ResolvedDate = now
   - ResolutionNotes = combination of resolution + notes
4. **Mark entity as modified**: Use `Context.Entry(dispute).State = EntityState.Modified` to ensure EF Core tracks changes
5. **Xử lý Payment** (nếu refund):
   - Update payment status to `Failed` (marking as refunded)
   - TODO: Integrate with actual payment gateway
6. **Extract admin UserId** from JWT claims using `IHttpContextAccessor`
7. **Log activity** với ActivityLog entity (Action=Completed, OldValue="IN_REVIEW", NewValue=resolution)
8. **Commit changes** to database

### Response
```json
{
  "statusCode": 200,
  "message": "Dispute resolved successfully",
  "isSuccess": true,
  "data": true
}
```

### Error Responses
```json
{
  "statusCode": 404,
  "message": "Dispute {id} not found",
  "isSuccess": false
}
```

```json
{
  "statusCode": 400,
  "message": "Dispute already resolved",
  "isSuccess": false
}
```

---

## ✅ POST /api/admin/disputes/{id}/messages

### Request
```http
POST /api/admin/disputes/{disputeId}/messages
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "message": "Chúng tôi đã liên hệ với thợ và xác nhận tình trạng. Đang xử lý hoàn tiền."
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `message` | string | Yes | Admin message to dispute (max 500 chars) |

### Business Logic

1. **Validation**: Dispute must exist
2. **Extract admin UserId** from JWT claims using `IHttpContextAccessor`
3. **Create ActivityLog**: Records admin communication with Action = "Updated", NewValue = message content
4. **Store admin message** in ActivityLog table with proper admin UserId tracking
5. **Commit changes** to database

### Response
```json
{
  "statusCode": 201,
  "message": "Message added successfully",
  "isSuccess": true,
  "data": true
}
```

### Error Responses
```json
{
  "statusCode": 404,
  "message": "Dispute {id} not found",
  "isSuccess": false
}
```

---

## 📝 Notes cho Frontend

### Status Badge
```typescript
const statusColors = {
  OPEN: 'error',
  IN_REVIEW: 'warning',
  RESOLVED: 'success'
}
```

### Resolution Options
```typescript
// Stored in Dispute.Resolution field (string)
const resolutionOptions = {
  FAVOR_CUSTOMER: 'Ưu ái khách hàng (có thể kèm refund)',
  FAVOR_TECHNICIAN: 'Ưu ái thợ (giữ nguyên payment)',
  PARTIAL_REFUND: 'Hoàn tiền một phần',
  NO_ACTION: 'Không xử lý'
}
```

### Activity Log Display
```typescript
// ActivityLog.Action enum values
const activityTypes = {
  StatusChanged: 'Thay đổi trạng thái',
  AdminCommentAdded: 'Admin thêm ghi chú',
  ResolutionSet: 'Đặt kết luận',
  PaymentRefunded: 'Hoàn tiền'
}

// Use OldValue and NewValue to show changes
// LoggedAt for timestamp
```

### Implementation Notes
- ✅ **Payment refunds**: Currently update status to `PaymentStatus.Failed` (marking as refunded)
- ⚠️ **Payment gateway integration** (PayOS) is marked as TODO for actual refund processing
- ⚠️ **Commission adjustment** and penalty system not yet implemented
- ✅ **ActivityLog tracking**: All changes tracked with Action enum, OldValue/NewValue pairs, and admin UserId from JWT
- ✅ **Admin UserId extraction**: Uses `IHttpContextAccessor` to get UserId from JWT claims
- ✅ **EF Core change tracking**: Uses `Context.Entry(entity).State = EntityState.Modified` to ensure updates are persisted
- ✅ **Evidence URLs**: Stored in Media entities linked to appointment
- ✅ **Testing**: All endpoints tested and verified working with HTTP test file (`tests/AdminDisputeManagement.http`)

### Known Issues Fixed
- ✅ EF Core not tracking entity changes → Fixed by explicitly marking entities as modified
- ✅ ActivityLog UserId FK constraint violation → Fixed by extracting admin UserId from JWT claims
- ✅ Dispute status not updating → Fixed by using `Context.Entry().State = Modified`

---

## 🎯 Summary

| Endpoint | Method | Chức năng | Quyền | Status |
|----------|--------|-----------|-------|--------|
| `/api/admin/disputes` | GET | Danh sách disputes | Admin | ✅ DONE |
| `/api/admin/disputes/{id}` | GET | Chi tiết dispute | Admin | ✅ DONE |
| `/api/admin/disputes/{id}/review` | PATCH | Bắt đầu xử lý | Admin | ✅ DONE |
| `/api/admin/disputes/{id}/resolve` | PATCH | Giải quyết | Admin | ✅ DONE |
| `/api/admin/disputes/{id}/messages` | POST | Thêm ghi chú admin | Admin | ✅ DONE |

**File Locations:**
- DTOs: `EzyFix.Service/Models/Admin/AdminDisputeModels.cs`
- Interface: `EzyFix.Service/Services/Interfaces/IAdminDisputeService.cs`
- Service: `EzyFix.Service/Services/Implements/AdminDisputeService.cs`
- Controller: `EzyFix.API/Controllers/AdminDisputeController.cs`
- HTTP Tests: `tests/AdminDisputeManagement.http`

**Build Status:** ✅ All endpoints compile successfully with 0 errors

**Test Status:** ✅ All endpoints tested and working:
- ✅ GET `/disputes` - List with filtering by status
- ✅ GET `/disputes/{id}` - Dispute details with full navigation properties
- ✅ PATCH `/disputes/{id}/review` - Status change OPEN → IN_REVIEW with ActivityLog
- ✅ PATCH `/disputes/{id}/resolve` - Status change IN_REVIEW → RESOLVED with resolution tracking
- ✅ POST `/disputes/{id}/messages` - Admin messages logged to ActivityLog
