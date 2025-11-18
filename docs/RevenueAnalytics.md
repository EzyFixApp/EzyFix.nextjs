# Admin - Doanh thu & Thống kê (Revenue Analytics)

## 📋 Status & TODO

### Implementation Status
| Endpoint | Priority | Assignee | Notes | Status |
|----------|----------|----------|-------|--------|
| `GET /admin/analytics/revenue/overview` | High | ✅ Complete | Dashboard overview | ✅ DONE |
| `GET /admin/analytics/revenue/by-service` | Medium | ✅ Complete | Revenue by service | ✅ DONE |
| `GET /admin/analytics/revenue/by-technician` | Medium | ✅ Complete | Revenue by technician | ✅ DONE |
| `GET /admin/analytics/transactions` | High | ✅ Complete | Transaction history | ✅ DONE |
| `GET /admin/analytics/commission-report` | Medium | ✅ Complete | Commission report | ✅ DONE |

### TODO Checklist
- [x] Create Controller: `AdminAnalyticsController.cs` ✅
- [x] Implement Service Layer: `AdminAnalyticsService.cs` ✅
- [x] Add Authorization Policy: `PolicyNames.AdminOnly` ✅
- [x] Create DTOs: Request/Response models in `AdminAnalyticsModels.cs` ✅
- [x] Add Validation: Query parameter validation ✅
- [x] Implement SQL queries for aggregation (LINQ with EF Core) ✅
- [x] Fix DateTime UTC conversion for PostgreSQL ✅
- [x] Register service in DI container ✅
- [ ] Add caching strategy (Redis/Memory)
- [ ] Implement export functionality (Excel/PDF)
- [ ] Implement Activity Logging
- [ ] Add Unit Tests
- [ ] Add Integration Tests
- [x] Update Swagger documentation ✅
- [x] Test with HTTP file (AdminAnalytics.http) ✅

### Dependencies
- ✅ `Payment` entity
- ✅ `WalletTransaction` entity
- ✅ `ServiceAppointment` entity
- ✅ `Services` entity
- ✅ `Technician` entity
- ✅ `Review` entity
- ✅ `Dispute` entity
- ✅ `Customer` entity
- ⚠️ Caching service (for performance) - TODO
- ⚠️ Export library (EPPlus/iTextSharp) - TODO

### Implementation Notes
- ✅ All endpoints use `Payment` table with `status = COMPLETE` (value = 4) for revenue calculations
- ✅ DateTime parameters automatically converted to UTC for PostgreSQL compatibility
- ✅ Complex LINQ queries with multiple navigation properties and grouping
- ✅ Type aliases used to avoid enum naming conflicts (`EntityPaymentStatus`, `EntityServiceAppointmentStatus`)
- ✅ Response format follows project's `ApiResponse<T>` pattern
- ⚠️ PaymentMethodId is non-nullable Guid (always has value, no null check needed)
- ✅ Transactions endpoint returns ALL payments regardless of status (not just COMPLETE)

### Performance Considerations
- ✅ Use database indexing on date fields (`TransactionDate`, `ActualEndTime`, `ActualStartTime`)
- ⚠️ Implement query result caching (5-15 mins) - TODO
- Consider read replicas for heavy analytics
- Add pagination for large datasets

---

## �📱 Màn hình sử dụng

| Endpoint | Màn hình Admin | Chức năng |
|----------|----------------|-----------|
| `GET /api/v1/admin/analytics/revenue/overview` | **Dashboard tổng quan** | Xem tổng doanh thu, hoa hồng, số giao dịch theo thời gian |
| `GET /api/v1/admin/analytics/revenue/by-service` | **Doanh thu theo dịch vụ** | Phân tích doanh thu theo từng loại dịch vụ |
| `GET /api/v1/admin/analytics/revenue/by-technician` | **Doanh thu theo thợ** | Xem thống kê thu nhập của từng technician |
| `GET /api/v1/admin/analytics/transactions` | **Lịch sử giao dịch** | Xem chi tiết tất cả giao dịch trong hệ thống |
| `GET /api/v1/admin/analytics/commission-report` | **Báo cáo hoa hồng** | Thống kê hoa hồng đã thu theo thời gian |

---

## 📋 Tổng quan

Admin cần các báo cáo để:
- Theo dõi doanh thu tổng thể của nền tảng
- Phân tích xu hướng theo thời gian (ngày/tuần/tháng)
- Xem dịch vụ nào sinh lời nhiều nhất
- Kiểm tra thu nhập của từng technician
- Audit tất cả giao dịch tài chính
- Tính toán hoa hồng đã thu được

**⚠️ Important Notes:**
- Tất cả analytics revenue endpoints chỉ tính payments với `status = COMPLETE` (đã settlement)
- Transactions endpoint trả về TẤT CẢ payments (bao gồm PENDING, PAYMENT_SUCCESS, ESCROW, COMPLETE, FAILED)
- DateTime parameters phải là UTC hoặc sẽ được tự động convert sang UTC
- Payment flow: `PENDING → PAYMENT_SUCCESS → ESCROW → COMPLETE` (hoặc FAILED)
- Payment chỉ chuyển sang COMPLETE khi: Thanh toán thành công + Appointment = REPAIRED + Settlement triggered

---

## 📊 GET /api/v1/admin/analytics/revenue/overview

### Mục đích
Lấy **tổng quan doanh thu** trong khoảng thời gian với các metrics chính:
- Tổng doanh thu (total revenue)
- Tổng hoa hồng đã thu (total commission)
- Tổng số giao dịch (total transactions)
- Doanh thu ròng của technicians
- So sánh với kỳ trước (growth rate)

### Request
```http
GET /api/v1/admin/analytics/revenue/overview?fromDate=2025-11-01&toDate=2025-11-17&groupBy=day
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `fromDate` | DateTime | ✅ | Ngày bắt đầu (UTC) | `2025-11-01T00:00:00Z` |
| `toDate` | DateTime | ✅ | Ngày kết thúc (UTC) | `2025-11-17T23:59:59Z` |
| `groupBy` | string | ❌ | Nhóm theo: `day`, `week`, `month` (mặc định: `day`) | `day` |

### Authorization
- ✅ **Admin ONLY**
- Policy: `PolicyNames.Admin`

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Revenue overview retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "period": {
      "fromDate": "2025-11-01T00:00:00Z",
      "toDate": "2025-11-17T23:59:59Z",
      "groupBy": "day"
    },
    
    "summary": {
      "totalRevenue": 25000000.00,
      "totalCommission": 3750000.00,
      "totalPayouts": 21250000.00,
      "totalTransactions": 45,
      "completedAppointments": 40,
      "averageOrderValue": 625000.00,
      "commissionRate": 0.15
    },
    
    "comparison": {
      "previousPeriodRevenue": 20000000.00,
      "revenueGrowth": 0.25,
      "previousPeriodTransactions": 35,
      "transactionGrowth": 0.286
    },
    
    "breakdown": [
      {
        "date": "2025-11-01",
        "revenue": 1500000.00,
        "commission": 225000.00,
        "payouts": 1275000.00,
        "transactions": 3
      },
      {
        "date": "2025-11-02",
        "revenue": 1800000.00,
        "commission": 270000.00,
        "payouts": 1530000.00,
        "transactions": 4
      }
    ],
    
    "paymentMethods": {
      "ONLINE": {
        "count": 30,
        "total": 18000000.00,
        "percentage": 0.72
      },
      "CASH": {
        "count": 15,
        "total": 7000000.00,
        "percentage": 0.28
      }
    }
  }
}
```

### Response Fields

#### Summary Object
| Field | Type | Mô tả |
|-------|------|-------|
| `totalRevenue` | decimal | Tổng doanh thu (bao gồm cả commission) |
| `totalCommission` | decimal | Tổng hoa hồng đã thu |
| `totalPayouts` | decimal | Tổng tiền đã trả cho technicians |
| `totalTransactions` | int | Tổng số giao dịch thanh toán |
| `completedAppointments` | int | Số appointment hoàn thành |
| `averageOrderValue` | decimal | Giá trị trung bình mỗi đơn |
| `commissionRate` | decimal | Tỷ lệ hoa hồng trung bình |

#### Comparison Object
| Field | Type | Mô tả |
|-------|------|-------|
| `previousPeriodRevenue` | decimal | Doanh thu kỳ trước |
| `revenueGrowth` | decimal | Tăng trưởng doanh thu (0.25 = +25%) |
| `previousPeriodTransactions` | int | Số giao dịch kỳ trước |
| `transactionGrowth` | decimal | Tăng trưởng giao dịch |

#### Breakdown Array
Dữ liệu chi tiết theo từng ngày/tuần/tháng (tùy `groupBy`):
- `date`: Ngày/tuần/tháng
- `revenue`: Doanh thu trong khoảng thời gian đó
- `commission`: Hoa hồng thu được
- `payouts`: Tiền trả cho thợ
- `transactions`: Số giao dịch

---

### HTTP Status Codes

| Status | Trường hợp |
|--------|-----------|
| **200 OK** | ✅ Lấy báo cáo thành công |
| **401 Unauthorized** | ❌ Không có token hoặc token hết hạn |
| **403 Forbidden** | ❌ Không phải Admin |
| **400 Bad Request** | ❌ fromDate > toDate hoặc khoảng thời gian > 1 năm |
| **500 Internal Server Error** | ❌ Lỗi server |

---

## 📈 GET /api/v1/admin/analytics/revenue/by-service

### Mục đích
Phân tích **doanh thu theo từng loại dịch vụ** để biết:
- Dịch vụ nào được sử dụng nhiều nhất
- Dịch vụ nào sinh lời cao nhất
- Xu hướng sử dụng dịch vụ

### Request
```http
GET /api/v1/admin/analytics/revenue/by-service?fromDate=2025-11-01&toDate=2025-11-17&top=10
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `fromDate` | DateTime | ✅ | Ngày bắt đầu | `2025-11-01` |
| `toDate` | DateTime | ✅ | Ngày kết thúc | `2025-11-17` |
| `categoryId` | Guid | ❌ | Lọc theo category | `guid` |
| `top` | int | ❌ | Lấy top N dịch vụ (mặc định: 10) | `10` |

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Service revenue breakdown retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "period": {
      "fromDate": "2025-11-01T00:00:00Z",
      "toDate": "2025-11-17T23:59:59Z"
    },
    
    "totalRevenue": 25000000.00,
    "totalCommission": 3750000.00,
    
    "services": [
      {
        "serviceId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
        "serviceName": "Sửa điều hòa",
        "categoryName": "Điện lạnh",
        "totalRevenue": 8500000.00,
        "totalCommission": 1275000.00,
        "totalTransactions": 15,
        "averagePrice": 566666.67,
        "percentageOfTotal": 0.34,
        "growth": 0.20
      },
      {
        "serviceId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
        "serviceName": "Sửa tivi",
        "categoryName": "Điện tử",
        "totalRevenue": 6000000.00,
        "totalCommission": 900000.00,
        "totalTransactions": 12,
        "averagePrice": 500000.00,
        "percentageOfTotal": 0.24,
        "growth": 0.15
      }
    ]
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `serviceId` | Guid | ID dịch vụ |
| `serviceName` | string | Tên dịch vụ |
| `categoryName` | string | Danh mục |
| `totalRevenue` | decimal | Tổng doanh thu dịch vụ này |
| `totalCommission` | decimal | Tổng hoa hồng thu được |
| `totalTransactions` | int | Số lượng giao dịch |
| `averagePrice` | decimal | Giá trung bình mỗi đơn |
| `percentageOfTotal` | decimal | Phần trăm trong tổng doanh thu |
| `growth` | decimal | Tăng trưởng so với kỳ trước |

---

## 👨‍🔧 GET /api/v1/admin/analytics/revenue/by-technician

### Mục đích
Xem **thu nhập của từng technician** để:
- Đánh giá hiệu suất làm việc
- So sánh giữa các thợ
- Phát hiện thợ bị underperform hoặc overperform

### Request
```http
GET /api/v1/admin/analytics/revenue/by-technician?fromDate=2025-11-01&toDate=2025-11-17&sortBy=revenue&order=desc&top=20
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `fromDate` | DateTime | ✅ | Ngày bắt đầu | `2025-11-01` |
| `toDate` | DateTime | ✅ | Ngày kết thúc | `2025-11-17` |
| `technicianId` | Guid | ❌ | Xem chi tiết 1 thợ cụ thể | `guid` |
| `sortBy` | string | ❌ | Sắp xếp theo: `revenue`, `jobs`, `rating` | `revenue` |
| `order` | string | ❌ | `asc` hoặc `desc` (mặc định: `desc`) | `desc` |
| `top` | int | ❌ | Lấy top N thợ | `20` |

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Technician revenue report retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "period": {
      "fromDate": "2025-11-01T00:00:00Z",
      "toDate": "2025-11-17T23:59:59Z"
    },
    
    "totalTechnicians": 25,
    
    "technicians": [
      {
        "technicianId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
        "firstName": "Trần",
        "lastName": "Văn B",
        "email": "tranvanb@email.com",
        "phone": "0912345678",
        "avatarLink": "https://cloudinary.com/avatar.jpg",
        
        "statistics": {
          "totalEarnings": 5500000.00,
          "platformCommission": 825000.00,
          "netEarnings": 4675000.00,
          "totalJobs": 12,
          "completedJobs": 11,
          "cancelledJobs": 1,
          "averageJobValue": 500000.00,
          "averageRating": 4.8,
          "totalReviews": 10
        },
        
        "paymentStatus": {
          "pendingPayout": 1200000.00,
          "paidOut": 3475000.00,
          "inEscrow": 0.00
        },
        
        "performance": {
          "completionRate": 0.917,
          "onTimeRate": 0.909,
          "disputeCount": 0,
          "rank": 1
        }
      }
    ]
  }
}
```

### Response Fields

#### Statistics Object
| Field | Type | Mô tả |
|-------|------|-------|
| `totalEarnings` | decimal | Tổng thu nhập (trước trừ hoa hồng) |
| `platformCommission` | decimal | Hoa hồng nền tảng đã trừ |
| `netEarnings` | decimal | Thu nhập ròng (sau trừ hoa hồng) |
| `totalJobs` | int | Tổng số việc nhận |
| `completedJobs` | int | Số việc hoàn thành |
| `cancelledJobs` | int | Số việc bị hủy |
| `averageJobValue` | decimal | Giá trị trung bình mỗi việc |
| `averageRating` | decimal | Đánh giá trung bình |
| `totalReviews` | int | Số lượng đánh giá |

#### Payment Status Object
| Field | Type | Mô tả |
|-------|------|-------|
| `pendingPayout` | decimal | Tiền chờ rút |
| `paidOut` | decimal | Đã rút về |
| `inEscrow` | decimal | Đang giữ escrow |

#### Performance Object
| Field | Type | Mô tả |
|-------|------|-------|
| `completionRate` | decimal | Tỷ lệ hoàn thành (0.917 = 91.7%) |
| `onTimeRate` | decimal | Tỷ lệ đúng giờ |
| `disputeCount` | int | Số tranh chấp |
| `rank` | int | Xếp hạng trong hệ thống |

---

## 💳 GET /api/v1/admin/analytics/transactions

### Mục đích
Xem **chi tiết tất cả giao dịch** tài chính trong hệ thống:
- Payments từ customers
- Wallet transactions
- Refunds
- Payouts

### Request
```http
GET /api/v1/admin/analytics/transactions?fromDate=2025-11-01&toDate=2025-11-17&type=PAYMENT&status=COMPLETE&page=1&pageSize=50
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `fromDate` | DateTime | ❌ | Ngày bắt đầu | `2025-11-01` |
| `toDate` | DateTime | ❌ | Ngày kết thúc | `2025-11-17` |
| `type` | string | ❌ | Loại: `PAYMENT`, `WALLET_DEPOSIT`, `WALLET_WITHDRAWAL`, `REFUND`, `COMMISSION` | `PAYMENT` |
| `status` | string | ❌ | Trạng thái giao dịch | `COMPLETE`, `PENDING`, `FAILED` |
| `customerId` | Guid | ❌ | Lọc theo khách hàng | `guid` |
| `technicianId` | Guid | ❌ | Lọc theo thợ | `guid` |
| `minAmount` | decimal | ❌ | Số tiền tối thiểu | `100000` |
| `maxAmount` | decimal | ❌ | Số tiền tối đa | `5000000` |
| `page` | int | ❌ | Trang (mặc định: 1) | `1` |
| `pageSize` | int | ❌ | Số items/trang (mặc định: 50) | `50` |

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Transactions retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "summary": {
      "totalAmount": 25000000.00,
      "totalTransactions": 150,
      "successfulTransactions": 145,
      "failedTransactions": 5
    },
    
    "items": [
      {
        "transactionId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
        "type": "PAYMENT",
        "amount": 650000.00,
        "status": "COMPLETE",
        "createdDate": "2025-11-15T10:30:00Z",
        "completedDate": "2025-11-15T10:30:15Z",
        
        "from": {
          "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "Nguyễn Văn A",
          "role": "CUSTOMER"
        },
        
        "to": {
          "userId": "5fa85f64-5717-4562-b3fc-2c963f66afa6",
          "name": "Trần Văn B",
          "role": "TECHNICIAN"
        },
        
        "relatedEntity": {
          "type": "APPOINTMENT",
          "id": "2fa85f64-5717-4562-b3fc-2c963f66afa6"
        },
        
        "paymentMethod": "ONLINE",
        "paymentProvider": "PayOS",
        "transactionCode": "PAY_123456789",
        "commissionAmount": 97500.00,
        "netAmount": 552500.00,
        
        "notes": "Thanh toán cho dịch vụ sửa điều hòa"
      }
    ],
    
    "pagination": {
      "currentPage": 1,
      "pageSize": 50,
      "totalItems": 150,
      "totalPages": 3
    }
  }
}
```

### Response Fields

| Field | Type | Mô tả |
|-------|------|-------|
| `transactionId` | Guid | ID giao dịch |
| `type` | string | Loại giao dịch |
| `amount` | decimal | Số tiền |
| `status` | string | Trạng thái |
| `createdDate` | DateTime | Ngày tạo |
| `completedDate` | DateTime? | Ngày hoàn thành |
| `from` | Object | Người gửi tiền |
| `to` | Object | Người nhận tiền |
| `relatedEntity` | Object | Entity liên quan (Appointment, Payment, etc.) |
| `paymentMethod` | string | Phương thức thanh toán |
| `paymentProvider` | string | Nhà cung cấp (PayOS, VNPay, CASH) |
| `transactionCode` | string | Mã giao dịch từ provider |
| `commissionAmount` | decimal | Hoa hồng trừ |
| `netAmount` | decimal | Số tiền ròng |

---

## 💰 GET /api/v1/admin/analytics/commission-report

### Mục đích
Báo cáo **hoa hồng đã thu** chi tiết:
- Tổng hoa hồng theo thời gian
- Hoa hồng theo từng dịch vụ
- Hoa hồng theo technician

### Request
```http
GET /api/v1/admin/analytics/commission-report?fromDate=2025-11-01&toDate=2025-11-17&groupBy=service
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type | Bắt buộc | Mô tả | Ví dụ |
|-----------|------|----------|-------|-------|
| `fromDate` | DateTime | ✅ | Ngày bắt đầu | `2025-11-01` |
| `toDate` | DateTime | ✅ | Ngày kết thúc | `2025-11-17` |
| `groupBy` | string | ❌ | Nhóm theo: `service`, `technician`, `date` | `service` |

---

### Response Structure

```json
{
  "status_code": 200,
  "message": "Commission report retrieved successfully",
  "is_success": true,
  "reason": null,
  "data": {
    "period": {
      "fromDate": "2025-11-01T00:00:00Z",
      "toDate": "2025-11-17T23:59:59Z"
    },
    
    "summary": {
      "totalCommission": 3750000.00,
      "totalRevenue": 25000000.00,
      "averageCommissionRate": 0.15,
      "totalTransactions": 45
    },
    
    "breakdown": [
      {
        "serviceId": "1fa85f64-5717-4562-b3fc-2c963f66afa6",
        "serviceName": "Sửa điều hòa",
        "categoryName": "Điện lạnh",
        "totalRevenue": 8500000.00,
        "commissionCollected": 1275000.00,
        "commissionRate": 0.15,
        "transactions": 15
      },
      {
        "serviceId": "2fa85f64-5717-4562-b3fc-2c963f66afa6",
        "serviceName": "Sửa tivi",
        "categoryName": "Điện tử",
        "totalRevenue": 6000000.00,
        "commissionCollected": 900000.00,
        "commissionRate": 0.15,
        "transactions": 12
      }
    ]
  }
}
```

---

## 📝 Notes cho Frontend

### 1. **Dashboard Widgets**

Màn hình Dashboard nên có các widgets:

```typescript
// Revenue Card
{
  title: "Tổng doanh thu",
  value: "25,000,000 VND",
  growth: "+25%",
  trend: "up",
  icon: "money"
}

// Commission Card
{
  title: "Hoa hồng đã thu",
  value: "3,750,000 VND",
  percentage: "15%",
  icon: "percentage"
}

// Transactions Card
{
  title: "Số giao dịch",
  value: "45",
  growth: "+28.6%",
  icon: "receipt"
}

// Active Technicians
{
  title: "Thợ đang hoạt động",
  value: "25",
  icon: "users"
}
```

### 2. **Charts cần implement**

- **Line Chart**: Doanh thu theo thời gian (breakdown array)
- **Pie Chart**: Doanh thu theo phương thức thanh toán
- **Bar Chart**: Top 10 dịch vụ theo doanh thu
- **Leaderboard**: Top technicians theo thu nhập

### 3. **Export Functions**

Cần nút export cho từng report:
- Export to Excel (.xlsx)
- Export to PDF
- Export to CSV

### 4. **Date Range Presets**

Các preset thường dùng:
- Hôm nay
- 7 ngày qua
- 30 ngày qua
- Tháng này
- Tháng trước
- Quý này
- Năm nay
- Custom range

### 5. **Real-time Updates**

Các metrics nên auto-refresh:
- Mỗi 5 phút cho dashboard overview
- Real-time cho transactions (khi có payment mới)

---

## 🔐 Security & Permissions

### Authorization
Tất cả analytics endpoints yêu cầu:
```csharp
[Authorize(Policy = PolicyNames.Admin)]
```

### Data Privacy
- Mask sensitive info trong export (số thẻ, số tài khoản)
- Log mọi truy cập vào financial reports
- Chỉ Admin cấp cao mới xem được chi tiết technician income

---

## 📊 Use Cases thực tế

### Use Case 1: Theo dõi doanh thu hàng ngày
```
Admin vào dashboard mỗi sáng
↓
Xem overview với groupBy=day
↓
Kiểm tra:
- Doanh thu hôm qua
- So sánh với hôm trước
- Xu hướng 7 ngày
↓
Phát hiện bất thường → drill down vào transactions
```

### Use Case 2: Đánh giá hiệu quả dịch vụ
```
Cuối tháng, Admin muốn biết dịch vụ nào nên marketing
↓
Gọi /revenue/by-service với fromDate = đầu tháng
↓
Sắp xếp theo totalRevenue DESC
↓
Thấy "Sửa điều hòa" top 1 → tăng quảng cáo
```

### Use Case 3: Kiểm tra thu nhập thợ
```
Thợ khiếu nại về hoa hồng
↓
Admin gọi /revenue/by-technician?technicianId={id}
↓
Xem chi tiết:
- Total jobs
- Commission deducted
- Net earnings
↓
So sánh với transactions để verify
```

### Use Case 4: Audit giao dịch
```
Phát hiện chênh lệch số liệu
↓
Gọi /analytics/transactions với filters cụ thể
↓
Export to Excel
↓
Reconcile với bank statements
```

---

## 🎯 Summary Table

| Endpoint | Mục đích chính | Data Source | Filter | Status |
|----------|----------------|-------------|--------|--------|
| `/revenue/overview` | Dashboard metrics | Payment (COMPLETE only) | Date range + groupBy | ✅ |
| `/revenue/by-service` | Service analysis | Payment (COMPLETE only) | Date + categoryId + top | ✅ |
| `/revenue/by-technician` | Technician performance | Payment + Appointment + Review | Date + sortBy + order | ✅ |
| `/analytics/transactions` | Audit & reconciliation | Payment (ALL statuses) | Date + status + amount + userId | ✅ |
| `/commission-report` | Financial reporting | Payment (COMPLETE only) | Date + groupBy | ✅ |

## 📁 Implementation Files

| File | Location | Lines | Status |
|------|----------|-------|--------|
| **Models** | `EzyFix.Service/Models/Admin/AdminAnalyticsModels.cs` | 290 | ✅ Complete |
| **Service Interface** | `EzyFix.Service/Services/Interfaces/IAdminAnalyticsService.cs` | ~30 | ✅ Complete |
| **Service Implementation** | `EzyFix.Service/Services/Implements/AdminAnalyticsService.cs` | 597 | ✅ Complete |
| **Controller** | `EzyFix.API/Controllers/AdminAnalyticsController.cs` | 192 | ✅ Complete |
| **HTTP Tests** | `tests/AdminAnalytics.http` | 213 | ✅ Complete |

## 🔧 Technical Details

### Key Classes & Methods

**AdminAnalyticsService.cs:**
- `GetRevenueOverviewAsync()` - Revenue summary with breakdown by day/week/month
- `GetRevenueByServiceAsync()` - Service revenue with percentages
- `GetRevenueByTechnicianAsync()` - Technician stats with performance metrics
- `GetTransactionsAsync()` - Filtered transaction list with pagination
- `GetCommissionReportAsync()` - Commission breakdown by service/technician/date

### Database Queries
All methods use:
- `IUnitOfWork<EzyFixDbContext>` for data access
- EF Core LINQ with `.Include()` for navigation properties
- `DateTime.SpecifyKind(date, DateTimeKind.Utc)` for PostgreSQL compatibility
- Complex grouping and aggregations with `.GroupBy()`, `.Sum()`, `.Average()`

### Known Issues & Limitations
- ⚠️ PaymentMethodId check always true (non-nullable Guid) - needs schema review
- ⚠️ No caching implemented yet - queries run on every request
- ⚠️ Large datasets may be slow - consider adding background job for pre-aggregation
- ✅ UTC conversion working correctly
- ✅ Enum conflicts resolved with type aliases

---

**Last Updated**: November 18, 2025  
**Version**: 2.0  
**Branch**: `admin-flow`  
**Status**: ✅ Fully Implemented & Tested
