# Admin - Quản lý Người dùng (User Management)

## 📊 Status & TODO

### Implementation Status
| Endpoint | Priority | Assignee | Notes | Status |
|----------|----------|----------|-------|--------|
| `GET /admin/users` | High | ✅ Completed | List all users with filtering | 🟢 DONE |
| `GET /admin/users/{id}` | High | ✅ Completed | Get user details | 🟢 DONE |
| `PATCH /admin/users/{id}/status` | Critical | ✅ Completed | Activate/Deactivate user | 🟢 DONE |
| `PATCH /admin/users/{id}/verify` | High | ✅ Completed | Verify user email | 🟢 DONE |
| `PATCH /admin/users/{id}/role` | Medium | ✅ Completed | Change user role | 🟢 DONE |
| `DELETE /admin/users/{id}` | High | ✅ Completed | Soft delete user | 🟢 DONE |
| `PATCH /admin/users/{id}/reset-password` | Medium | ✅ Completed | Force password reset | 🟢 DONE |

### TODO Checklist
- [x] Create Controller: `AdminUserController.cs`
- [x] Implement Service Layer: `AdminUserService.cs`
- [x] Add Authorization Policy: `PolicyNames.AdminOnly`
- [x] Create DTOs: Request/Response models in `AdminUserModels.cs`
- [x] Add Validation: DataAnnotations on request models
- [x] Implement Activity Logging
- [x] Implement Password Reset logic
- [x] Add Role transition validation
- [ ] Add Unit Tests
- [ ] Add Integration Tests
- [x] Update Swagger documentation
- [x] Test with HTTP test file

### Dependencies
- ✅ `Users` entity (UserId, Email, FirstName, LastName, Phone, Role, IsActive, IsVerify)
- ✅ `Roles` entity (RoleId, RoleName)
- ✅ `Customer` entity (CustomerId, LoyaltyPoints, PreferredContactMethod)
- ✅ `Technician` entity (TechnicianId, Certification, YearsOfExperience, AvailabilityStatus, HourlyRate)
- ✅ `Address` entity (for user addresses)
- ✅ `EmergencyContact` entity (for customer contacts)
- ✅ `ActivityLog` entity (tracks all admin actions)
- ✅ Notification service (for alerts)
- ✅ Password reset token service

**✅ Implementation Status: COMPLETED (Nov 20, 2025)**
- All 7 endpoints implemented in `AdminUserController.cs`
- Service layer completed in `AdminUserService.cs`
- DTOs created in `AdminUserModels.cs`
- RoleConstants refactored to use constants instead of hardcoded strings
- Test scenarios ready in `tests/AdminUserManagement.http`

---

## 📱 Màn hình sử dụng

| Endpoint | Màn hình Admin | Chức năng |
|----------|----------------|-----------|
| `GET /api/admin/users` | **Danh sách người dùng** | Xem tất cả users, lọc theo role/status/verification |
| `GET /api/admin/users/{id}` | **Chi tiết người dùng** | Xem profile đầy đủ, activity logs, related data |
| `PATCH /api/admin/users/{id}/status` | **Kích hoạt/Vô hiệu hóa** | Active/Deactive tài khoản user |
| `PATCH /api/admin/users/{id}/verify` | **Xác thực email** | Verify email thủ công cho user |
| `PATCH /api/admin/users/{id}/role` | **Đổi role** | Chuyển role (Customer ↔ Technician, promote to Admin) |
| `DELETE /admin/users/{id}` | **Xóa người dùng** | Soft delete tài khoản (set IsActive = false) |
| `PATCH /admin/users/{id}/reset-password` | **Reset mật khẩu** | Buộc user đổi password lần đăng nhập sau |

---

## 📋 Tổng quan

Admin quản lý **Users** để:
- Giám sát tất cả người dùng trong hệ thống
- Xử lý yêu cầu xác thực tài khoản
- Khóa/Mở khóa tài khoản vi phạm
- Hỗ trợ người dùng quên mật khẩu
- Quản lý phân quyền và role transitions
- Theo dõi hoạt động đáng ngờ

---

## 🔍 GET /api/admin/users

### Mục đích
Lấy danh sách **tất cả người dùng** trong hệ thống với khả năng lọc, tìm kiếm và phân trang.

### Request
```http
GET /api/admin/users?role=Customer&isActive=true&isVerified=false&searchKeyword=nguyen&page=1&pageSize=20
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `role` | string | ❌ | Lọc theo role | `Admin`, `Customer`, `Technician`, `Supporter` |
| `isActive` | bool | ❌ | Lọc theo trạng thái active | `true`, `false` |
| `isVerified` | bool | ❌ | Lọc theo trạng thái verify email | `true`, `false` |
| `searchKeyword` | string | ❌ | Tìm kiếm theo tên, email, phone | `nguyen` |
| `fromDate` | DateTime | ❌ | Lọc từ ngày tạo (UTC) | `2025-11-01T00:00:00Z` |
| `toDate` | DateTime | ❌ | Lọc đến ngày tạo (UTC) | `2025-11-17T23:59:59Z` |
| `sortBy` | string | ❌ | Sắp xếp theo field | `CreatedDate`, `Email`, `LastName` |
| `sortOrder` | string | ❌ | Thứ tự sắp xếp | `asc`, `desc` |
| `page` | int | ❌ | Số trang (mặc định: 1) | `1` |
| `pageSize` | int | ❌ | Số items/trang (mặc định: 20, max: 100) | `20` |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.AdminOnly`

---

### Response Structure

```json
{
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "isSuccess": true,
  "data": {
    "items": [
      {
        "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "email": "nguyenvana@email.com",
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "fullName": "Nguyễn Văn A",
        "phone": "0901234567",
        "avatarLink": "https://cloudinary.com/avatar.jpg",
        "role": "Customer",
        "roleId": "11111111-1111-1111-1111-111111111111",
        "isActive": true,
        "isVerify": true,
        "createdDate": "2025-11-10T08:30:00Z",
        "lastChangePassword": "2025-11-15T10:00:00Z",
        "preferredLanguage": "VI",
        "profileCompletion": 85,
        "flags": ["VERIFIED", "ACTIVE"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalItems": 350,
      "totalPages": 18
    },
    "summary": {
      "totalUsers": 350,
      "activeUsers": 320,
      "inactiveUsers": 30,
      "verifiedUsers": 280,
      "unverifiedUsers": 70,
      "roleBreakdown": {
        "Customer": 200,
        "Technician": 130,
        "Admin": 15,
        "Supporter": 5
      }
    }
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `userId` | Guid | ID người dùng |
| `email` | string | Email đăng nhập |
| `firstName` | string | Tên |
| `lastName` | string | Họ |
| `fullName` | string | Họ tên đầy đủ |
| `phone` | string? | Số điện thoại |
| `avatarLink` | string? | URL ảnh đại diện |
| `role` | string | Tên role (`Admin`, `Customer`, `Technician`, `Supporter`) |
| `roleId` | Guid | ID của role |
| `isActive` | bool | Trạng thái hoạt động (`Active` = true, `Inactive` = false) |
| `isVerify` | bool | Đã xác thực email |
| `createdDate` | DateTime | Ngày tạo tài khoản |
| `lastChangePassword` | DateTime? | Lần đổi password gần nhất |
| `preferredLanguage` | string? | Ngôn ngữ ưa thích (`EN`, `VI`) |
| `profileCompletion` | int | % hoàn thiện profile (0-100) |
| `flags` | string[] | Cảnh báo: `VERIFIED`, `ACTIVE`, `PASSWORD_EXPIRED`, `SUSPICIOUS_ACTIVITY` |

#### Summary Object
- `totalUsers`: Tổng số users
- `activeUsers`: Số users đang active
- `inactiveUsers`: Số users bị deactivate
- `verifiedUsers`: Số users đã verify email
- `unverifiedUsers`: Số users chưa verify
- `roleBreakdown`: Phân bổ theo role

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

## 🔍 GET /api/admin/users/{id}

### Mục đích
Lấy **thông tin chi tiết đầy đủ** của một User, bao gồm:
- Thông tin cá nhân đầy đủ
- Role-specific data (Customer/Technician profile)
- Addresses
- Emergency contacts (nếu là Customer)
- Activity logs
- Related entities (appointments, payments, disputes)
- Statistics

### Request
```http
GET /api/admin/users/{id}
Authorization: Bearer <admin_token>
```

| Parameter | Type | Vị trí | Mô tả |
|-----------|------|--------|-------|
| `id` | Guid | URL Path | ID của user |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.AdminOnly`

---

### Response Structure

```json
{
  "statusCode": 200,
  "message": "User details retrieved successfully",
  "isSuccess": true,
  "data": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "nguyenvana@email.com",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "avatarLink": "https://cloudinary.com/avatar.jpg",
    
    "role": {
      "roleId": "11111111-1111-1111-1111-111111111111",
      "roleName": "Customer"
    },
    
    "accountStatus": {
      "isActive": true,
      "isVerify": true,
      "createdDate": "2025-11-10T08:30:00Z",
      "lastChangePassword": "2025-11-15T10:00:00Z",
      "preferredLanguage": "VI"
    },
    
    "customerProfile": {
      "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "loyaltyPoints": 250,
      "preferredContactMethod": "EMAIL",
      "totalServiceRequests": 15,
      "completedAppointments": 12,
      "cancelledAppointments": 2,
      "activeDisputes": 0,
      "totalSpent": 8500000.00,
      "averageRating": 4.8
    },
    
    "technicianProfile": null,
    
    "addresses": [
      {
        "addressId": "4fa85f64-5717-4562-b3fc-2c963f66afa6",
        "street": "123 Nguyễn Huệ",
        "city": "TP.HCM",
        "province": "TP.HCM",
        "postalCode": "700000",
        "latitude": 10.776889,
        "longitude": 106.700806,
        "isPrimary": true
      }
    ],
    
    "emergencyContacts": [
      {
        "contactId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
        "contactName": "Nguyễn Văn B",
        "phone": "0912345678",
        "relationship": "Anh/Em"
      }
    ],
    
    "statistics": {
      "totalAppointments": 15,
      "completedAppointments": 12,
      "cancelledAppointments": 2,
      "activeDisputes": 0,
      "totalPayments": 12,
      "totalReviews": 10,
      "averageReviewRating": 4.8
    },
    
    "recentActivity": [
      {
        "logId": "6fa85f64-5717-4562-b3fc-2c963f66afa6",
        "action": "LOGIN",
        "timestamp": "2025-11-18T14:30:00Z",
        "details": "Logged in from 14.248.123.45",
        "ipAddress": "14.248.123.45"
      },
      {
        "logId": "7fa85f64-5717-4562-b3fc-2c963f66afa6",
        "action": "CREATED",
        "timestamp": "2025-11-18T10:00:00Z",
        "details": "Created service request for Sửa điều hòa"
      }
    ],
    
    "securityInfo": {
      "lastLogin": "2025-11-18T14:30:00Z",
      "passwordAge": 3,
      "failedLoginAttempts": 0,
      "accountLocked": false,
      "twoFactorEnabled": false
    }
  }
}
```

### Response Fields Breakdown

#### Customer Profile (nếu role = Customer)
| Field | Type | Mô tả |
|-------|------|-------|
| `customerId` | Guid | ID customer profile |
| `loyaltyPoints` | int | Điểm tích lũy |
| `preferredContactMethod` | string | Phương thức liên hệ ưa thích |
| `totalServiceRequests` | int | Tổng số yêu cầu dịch vụ |
| `completedAppointments` | int | Số lịch hẹn hoàn thành |
| `cancelledAppointments` | int | Số lịch hẹn đã hủy |
| `activeDisputes` | int | Số tranh chấp đang mở |
| `totalSpent` | decimal | Tổng chi tiêu |
| `averageRating` | decimal | Đánh giá trung bình cho thợ |

#### Technician Profile (nếu role = Technician)
| Field | Type | Mô tả |
|-------|------|-------|
| `technicianId` | Guid | ID technician profile |
| `certification` | string? | Chứng chỉ |
| `yearsOfExperience` | int | Số năm kinh nghiệm |
| `availabilityStatus` | string | Trạng thái (`AVAILABLE`, `BUSY`, `ON_LEAVE`, `OFFLINE`) |
| `hourlyRate` | decimal | Giá theo giờ |
| `totalJobs` | int | Tổng số công việc |
| `completedJobs` | int | Số công việc hoàn thành |
| `cancelledJobs` | int | Số công việc bị hủy |
| `totalEarnings` | decimal | Tổng thu nhập |
| `walletBalance` | decimal | Số dư ví |
| `averageRating` | decimal | Đánh giá trung bình |
| `totalReviews` | int | Số lượt đánh giá |
| `skills` | array | Danh sách kỹ năng |

#### Addresses Array
- `addressId`: ID địa chỉ
- `street`: Đường
- `city`: Thành phố
- `province`: Tỉnh/Thành
- `postalCode`: Mã bưu điện
- `latitude`: Vĩ độ
- `longitude`: Kinh độ
- `isPrimary`: Địa chỉ chính

#### Emergency Contacts Array
- `contactId`: ID liên hệ
- `contactName`: Tên người liên hệ
- `phone`: SĐT
- `relationship`: Mối quan hệ

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Lấy thông tin thành công |
| **401 Unauthorized** | ❌ Không có token |
| **403 Forbidden** | ❌ Không phải Admin |
| **404 Not Found** | ❌ User không tồn tại |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 🔄 PATCH /api/admin/users/{id}/status

### Mục đích
Kích hoạt hoặc vô hiệu hóa tài khoản user.

### Request
```http
PATCH /api/admin/users/{id}/status
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "isActive": false,
  "reason": "Vi phạm điều khoản sử dụng - spam requests",
  "notifyUser": true
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `isActive` | bool | Yes | `true` = activate, `false` = deactivate |
| `reason` | string | Yes | Lý do thay đổi trạng thái |
| `notifyUser` | bool | No | Gửi email thông báo (default: true) |

### Business Logic
1. Validation: User phải tồn tại
2. Kiểm tra: Không thể deactivate chính mình
3. Kiểm tra: Không thể deactivate Admin khác (trừ Super Admin)
4. Cập nhật `Users.IsActive`
5. Nếu deactivate Customer:
   - Cancel tất cả pending service requests
   - Cancel tất cả scheduled appointments
6. Nếu deactivate Technician:
   - Cancel tất cả pending offers
   - Set AvailabilityStatus = OFFLINE
   - Notify customers có scheduled appointments
7. Log activity với ActivityLog
8. Gửi email notification (nếu notifyUser = true)

### Response
```json
{
  "statusCode": 200,
  "message": "User status updated successfully",
  "isSuccess": true,
  "data": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "isActive": false,
    "updatedAt": "2025-11-18T15:00:00Z",
    "affectedEntities": {
      "cancelledRequests": 2,
      "cancelledAppointments": 1,
      "notifiedUsers": 1
    }
  }
}
```

### Error Responses
```json
{
  "statusCode": 404,
  "message": "User {id} not found",
  "isSuccess": false
}
```

```json
{
  "statusCode": 400,
  "message": "Cannot deactivate your own account",
  "isSuccess": false
}
```

```json
{
  "statusCode": 403,
  "message": "Cannot deactivate another admin account",
  "isSuccess": false
}
```

---

## ✅ PATCH /api/admin/users/{id}/verify

### Mục đích
Xác thực email cho user thủ công (bypass OTP verification).

### Request
```http
PATCH /api/admin/users/{id}/verify
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "isVerify": true,
  "notes": "Verified manually after phone verification"
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `isVerify` | bool | Yes | `true` = verify, `false` = unverify |
| `notes` | string | No | Ghi chú lý do verify thủ công |

### Business Logic
1. Validation: User phải tồn tại
2. Cập nhật `Users.IsVerify`
3. Log activity với ActivityLog
4. Gửi welcome email (nếu verify = true và chưa từng verify)

### Response
```json
{
  "statusCode": 200,
  "message": "User verification status updated successfully",
  "isSuccess": true,
  "data": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "isVerify": true,
    "verifiedAt": "2025-11-18T15:00:00Z"
  }
}
```

---

## 🔀 PATCH /api/admin/users/{id}/role

### Mục đích
Thay đổi role của user (promote/demote hoặc chuyển đổi giữa Customer ↔ Technician).

### Request
```http
PATCH /api/admin/users/{id}/role
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "newRole": "Technician",
  "reason": "User request to become technician - verified certification",
  "preserveData": true
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `newRole` | string | Yes | Role mới (`Customer`, `Technician`, `Admin`, `Supporter`) |
| `reason` | string | Yes | Lý do thay đổi role |
| `preserveData` | bool | No | Giữ lại data cũ khi chuyển role (default: true) |

### Business Logic
1. Validation: User và role mới phải tồn tại
2. Kiểm tra role transitions hợp lệ:
   - Customer → Technician: OK (cần tạo Technician profile)
   - Technician → Customer: OK (deactivate Technician profile)
   - Customer/Technician → Admin/Supporter: OK (cần approval cao hơn)
   - Admin → Customer/Technician: Cảnh báo (demote admin)
3. Cập nhật `Users.RoleId`
4. Tạo hoặc deactivate profile tương ứng:
   - Customer → Technician: Tạo `Technician` record
   - Technician → Customer: Tạo `Customer` record (nếu chưa có)
5. Log activity với ActivityLog
6. Gửi notification

### Response
```json
{
  "statusCode": 200,
  "message": "User role updated successfully",
  "isSuccess": true,
  "data": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "oldRole": "Customer",
    "newRole": "Technician",
    "updatedAt": "2025-11-18T15:00:00Z",
    "profilesCreated": ["Technician"]
  }
}
```

### Error Responses
```json
{
  "statusCode": 400,
  "message": "Invalid role transition: Cannot change from Admin to Customer without proper authorization",
  "isSuccess": false
}
```

---

## 🗑️ DELETE /api/admin/users/{id}

### Mục đích
Xóa user khỏi hệ thống (soft delete - set IsActive = false).

### Request
```http
DELETE /api/admin/users/{id}?hardDelete=false
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "reason": "User request account deletion - GDPR compliance",
  "deleteRelatedData": false
}
```

### Query Parameters

| Parameter | Type | Mô tả |
|-----------|------|-------|
| `hardDelete` | bool | `true` = xóa vĩnh viễn, `false` = soft delete (default) |

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `reason` | string | Yes | Lý do xóa tài khoản |
| `deleteRelatedData` | bool | No | Xóa luôn data liên quan (default: false) |

### Business Logic
1. Validation: User phải tồn tại
2. Kiểm tra: Không thể xóa chính mình
3. Kiểm tra: Không thể xóa Admin khác (trừ Super Admin)
4. **Soft Delete** (hardDelete = false):
   - Set `Users.IsActive = false`
   - Cancel tất cả pending requests/appointments
   - Giữ nguyên historical data
5. **Hard Delete** (hardDelete = true):
   - Kiểm tra constraints (payments, appointments completed)
   - Xóa hoặc anonymize related data
   - Xóa record khỏi database
6. Log activity
7. Gửi confirmation email

### Response
```json
{
  "statusCode": 200,
  "message": "User deleted successfully",
  "isSuccess": true,
  "data": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "deletedAt": "2025-11-18T15:00:00Z",
    "deleteType": "soft",
    "dataRetention": {
      "keptAppointments": 15,
      "keptPayments": 12,
      "keptReviews": 10
    }
  }
}
```

### Error Responses
```json
{
  "statusCode": 400,
  "message": "Cannot delete user with active appointments",
  "isSuccess": false,
  "data": {
    "activeAppointments": 2,
    "pendingDisputes": 1
  }
}
```

---

## 🔑 PATCH /api/admin/users/{id}/reset-password

### Mục đích
Buộc user phải đổi password lần đăng nhập tiếp theo.

### Request
```http
PATCH /api/admin/users/{id}/reset-password
Authorization: Bearer <admin_token>
Content-Type: application/json
```

```json
{
  "generateTemporaryPassword": true,
  "sendEmail": true,
  "reason": "Suspicious login activity detected"
}
```

### Request Body

| Field | Type | Required | Mô tả |
|-------|------|----------|-------|
| `generateTemporaryPassword` | bool | No | Tạo password tạm (default: true) |
| `sendEmail` | bool | No | Gửi email với password mới (default: true) |
| `reason` | string | No | Lý do reset password |

### Business Logic
1. Validation: User phải tồn tại
2. Nếu `generateTemporaryPassword = true`:
   - Tạo temporary password (random 12 ký tự)
   - Hash và update `Users.PasswordHash`
3. Set `Users.LastChangePassword = null` (để force password change)
4. Tạo password reset token (valid 24h)
5. Log activity
6. Gửi email với temporary password hoặc reset link

### Response
```json
{
  "statusCode": 200,
  "message": "Password reset successfully",
  "isSuccess": true,
  "data": {
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "temporaryPassword": "Abc123!@#Xyz",
    "resetToken": "eyJhbGc...",
    "expiresAt": "2025-11-19T15:00:00Z",
    "emailSent": true
  }
}
```

**⚠️ Security Note**: `temporaryPassword` chỉ trả về trong response nếu `sendEmail = false` (để admin có thể gửi thủ công).

---

## 📊 Additional Endpoints (Nice to Have)

### GET /api/admin/users/{id}/activity-logs
Lấy chi tiết activity logs của user.

### GET /api/admin/users/{id}/appointments
Lấy danh sách appointments của user.

### GET /api/admin/users/{id}/payments
Lấy lịch sử thanh toán của user.

### GET /api/admin/users/{id}/reviews
Lấy reviews của/cho user.

### PATCH /api/admin/users/{id}/loyalty-points
Điều chỉnh loyalty points (cho Customer).

### GET /api/admin/users/statistics
Lấy thống kê tổng quan về users.

---

## 🔒 Security & Compliance

### GDPR Compliance
- User có quyền yêu cầu xóa data
- Soft delete giữ data cho audit trail
- Hard delete phải anonymize historical data
- Export user data (right to data portability)

### Audit Trail
- Log tất cả admin actions
- Track IP address và timestamp
- Lưu old/new values cho mọi thay đổi

### Role-Based Access Control
- Chỉ Admin mới có quyền truy cập
- Không thể tự thay đổi role/status của mình
- Super Admin có quyền cao nhất

---

## 📝 Notes for Implementation

### Database Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_active ON users(role_id, is_active);
CREATE INDEX idx_users_created_date ON users(created_date);
CREATE INDEX idx_users_is_verify ON users(is_verify);
```

### Validation Rules
- Email: Valid format, unique
- Phone: Optional, valid format (VN phone number)
- FirstName/LastName: Max 100 characters
- Password: Min 8 characters, must contain uppercase, lowercase, number, special char

### Business Rules
- Cannot deactivate last active Admin
- Cannot change role if user has active appointments
- Must resolve disputes before deleting Technician
- Email must be unique across all users
- Phone can be null but if provided must be unique

---

## 🧪 Test Scenarios

### List Users
- [ ] Filter by role
- [ ] Filter by active status
- [ ] Filter by verification status
- [ ] Search by keyword
- [ ] Pagination works correctly
- [ ] Sort by different fields

### Get User Details
- [ ] Returns full Customer profile
- [ ] Returns full Technician profile
- [ ] Returns addresses and contacts
- [ ] Returns activity logs
- [ ] Returns statistics

### Update Status
- [ ] Activate user successfully
- [ ] Deactivate user successfully
- [ ] Cannot deactivate self
- [ ] Cannot deactivate another admin
- [ ] Cancels related entities when deactivate

### Verify Email
- [ ] Verify successfully
- [ ] Unverify successfully
- [ ] Sends welcome email on first verify

### Change Role
- [ ] Customer → Technician
- [ ] Technician → Customer
- [ ] Promote to Admin (restricted)
- [ ] Invalid transitions blocked
- [ ] Creates necessary profiles

### Delete User
- [ ] Soft delete works
- [ ] Hard delete works (when allowed)
- [ ] Cannot delete with active appointments
- [ ] Cannot delete self
- [ ] Data retention policies applied

### Reset Password
- [ ] Generates temporary password
- [ ] Sends email successfully
- [ ] Forces password change on next login
- [ ] Reset token expires correctly
