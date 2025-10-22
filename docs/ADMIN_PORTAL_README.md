# 🎯 EzyFix Admin Portal - Hướng dẫn sử dụng

## 📋 Tổng quan

**EzyFix Admin Portal** là trang quản trị dành cho admin để quản lý toàn bộ hệ thống EzyFix, bao gồm người dùng, dịch vụ, voucher và tài chính.

### 🌐 URL truy cập
```
http://localhost:3000/admin
```

---

## 🎨 Thiết kế UI/UX

### **Color Scheme** (Theo EzyFix Branding)
- **Primary Gradient:** `#C3EAFA` → `#5E9BEF`
- **Secondary Colors:** Blue, Green, Orange, Purple (cho stats cards)
- **Background:** `#F9FAFB` (Gray-50)
- **Text:** Gray-800, Gray-600, Gray-500

### **Typography**
- **Headings:** Font-bold, text-2xl/3xl
- **Body:** Font-medium, text-sm/base
- **Numbers:** Font-bold, text-2xl/3xl (KPIs)

### **Components**
- **Cards:** Rounded-xl, shadow-lg, hover:shadow-xl
- **Buttons:** Gradient backgrounds, rounded-lg
- **Tables:** Gradient headers, hover effects
- **Badges:** Rounded-full, color-coded status

---

## 📁 Cấu trúc dự án

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # 🎨 Sidebar Layout
│       ├── page.tsx                # 📊 Dashboard
│       ├── users/
│       │   └── page.tsx            # 👥 User Management
│       ├── services/
│       │   └── page.tsx            # 🔧 Service Management
│       ├── vouchers/
│       │   └── page.tsx            # 🎫 Voucher Management
│       └── financial/
│           └── page.tsx            # 💰 Financial Management
├── types/
│   └── admin.ts                    # 📝 TypeScript Types
└── libs/
    └── admin-data.ts               # 🗄️ Mock Data
```

---

## 🚀 Các trang chức năng

### 1. 📊 **Dashboard** (`/admin`)

#### **Tính năng:**
- ✅ **4 KPI Cards** với gradient màu:
  - 👥 Tổng người dùng (Khách + Thợ + Support)
  - 💰 Doanh thu tháng này (với % tăng trưởng)
  - 📅 Lịch hẹn đang hoạt động
  - ⭐ Đánh giá trung bình

- ✅ **Revenue Chart** (7 ngày qua):
  - Bar chart horizontal với gradient fill
  - Hiển thị số đơn hàng mỗi ngày

- ✅ **Top 5 dịch vụ phổ biến:**
  - Số yêu cầu và doanh thu
  - Badge ranking (1-5)

- ✅ **Top thợ sửa chữa xuất sắc:**
  - Table với: Ranking, Tên, Công việc, Đánh giá, Thu nhập
  - Gradient badge cho xếp hạng

- ✅ **Quick Actions:**
  - Thêm thợ mới
  - Tạo voucher mới
  - Xem báo cáo chi tiết

#### **Mock Data:**
- Total Users: **1,248**
- Monthly Revenue: **456,780,000 VND**
- Active Appointments: **127**
- Average Rating: **4.7⭐**

---

### 2. 👥 **User Management** (`/admin/users`)

#### **Tính năng:**

##### **Tabs Filter:**
- ✅ **Tất cả** (1,248 users)
- ✅ **Khách hàng** (856 users)
- ✅ **Thợ sửa chữa** (342 users)
- ✅ **Nhân viên hỗ trợ** (50 users)

##### **Search & Filter:**
- 🔍 Tìm kiếm theo: Tên, Email, Số điện thoại
- Real-time filtering

##### **User Table Columns:**
- **Người dùng:** Avatar + Tên + User ID
- **Vai trò:** Badge với màu (Customer/Technician/Support)
- **Thông tin liên hệ:** Email + Phone
- **Trạng thái:**
  - 🟢 Hoạt động / 🔴 Vô hiệu hóa
  - ✅ Đã xác minh / ⏳ Chưa xác minh

##### **Technician-specific columns:**
- ⭐ **Đánh giá:** Rating with stars
- 🔧 **Công việc:** Total jobs completed

##### **Customer-specific columns:**
- 🎁 **Điểm thưởng:** Loyalty points

##### **Actions:**
- 👁️ Xem chi tiết
- ✏️ Chỉnh sửa thông tin

#### **Mock Users:**
- 5 sample users (Customer, Technician, Support)
- Full profile data theo DB schema

---

### 3. 🔧 **Service Management** (`/admin/services`)

#### **Tính năng:**

##### **Stats Cards:**
- 🔧 Tổng dịch vụ
- ✅ Đang hoạt động
- ⛔ Bị tắt
- ⚠️ Không có thợ

##### **Service Table:**
- **Dịch vụ:** Icon + Tên + Mô tả
- **Danh mục:** Badge với màu
- **Giá cơ bản:** VND format
- **Thợ khả dụng:**
  - ✅ Green badge nếu có thợ
  - ❌ Red badge nếu không có thợ
- **Yêu cầu:** Số lượng requests
- **Trạng thái:** 🟢 Hoạt động / ⚫ Đã tắt

##### **Enable/Disable Logic:**
- ✅ **Có thể bật:** Nếu có thợ khả dụng
- ⛔ **Không thể bật:** Nếu không có thợ (disabled button)
- Logic check dựa trên `TechnicianSkill` table

##### **Search & Filter:**
- 🔍 Tìm kiếm dịch vụ
- Lọc theo danh mục

#### **Mock Services:**
- 6 services: Máy lạnh, Máy giặt, Tủ lạnh, TV, Bình nóng lạnh, Quạt điện
- Service "Quạt điện" bị disable vì không có thợ

---

### 4. 🎫 **Voucher Management** (`/admin/vouchers`)

#### **Tính năng:**

##### **Stats Cards:**
- 🎫 Tổng voucher
- ✅ Đang hoạt động
- ⏰ Hết hạn
- 📊 Lượt sử dụng

##### **Voucher Cards (Grid Layout):**

**Header (Gradient):**
- Voucher Code (BOLD)
- Description
- Status Badge (Active/Expired/Disabled)

**Body:**
- **Discount Info:**
  - Percentage (20%) hoặc Fixed Amount (50,000đ)
  - Max discount (nếu Percentage)
- **Đơn tối thiểu:** Min order amount
- **Usage Progress Bar:**
  - Current / Max usage
  - Warning color khi ≥80%
- **Validity Period:** From → To dates
- **Restrictions:**
  - 📂 Áp dụng cho categories
  - 💳 Payment methods
  - 👤 Max usage per user

**Actions:**
- 👁️ Chi tiết
- ✏️ Chỉnh sửa
- 🗑️ Xóa

##### **Search & Filter:**
- 🔍 Tìm kiếm voucher code
- Filter: All / Active / Inactive

#### **Mock Vouchers:**
- **WELCOME2025:** 20% off cho khách mới
- **FLASH50K:** Giảm 50K cho đơn từ 500K
- **SUMMER15:** 15% off (Expired)

---

### 5. 💰 **Financial Management** (`/admin/financial`)

#### **Tính năng:**

##### **Stats Cards:**
- 💰 Tổng doanh thu
- ⏳ Chờ rút tiền (số lượng + số tiền)
- ✅ Đã rút
- 📊 Tổng giao dịch

##### **3 Tabs:**

###### **Tab 1: Yêu cầu rút tiền**
- **Columns:**
  - Thợ sửa chữa + Note
  - Số tiền (BOLD)
  - Phương thức (🏦 Ngân hàng / 💳 Ví điện tử)
  - Tài khoản nhận (Tên + Số TK + Bank Code)
  - Trạng thái:
    - ⏳ Chờ duyệt (Yellow)
    - 🔄 Đang xử lý (Blue)
    - ✅ Hoàn thành (Green)
    - ❌ Từ chối (Red)
  - Thời gian (Request + Processed)

- **Actions:**
  - ✅ Duyệt / ❌ Từ chối (cho status "Requested")
  - 👁️ Xem chi tiết (các status khác)

###### **Tab 2: Giao dịch ví**
- **Columns:**
  - Thợ
  - Loại: ➕ Nạp (Green) / ➖ Trừ (Red)
  - Số tiền (với dấu +/-)
  - Lý do:
    - 💰 Thu nhập
    - 📊 Phí nền tảng
    - 💸 Rút tiền
    - 🔧 Điều chỉnh
  - Ghi chú
  - Thời gian

###### **Tab 3: Thanh toán**
- **Columns:**
  - Mã thanh toán (PaymentID)
  - Số tiền
  - Phương thức (MoMo, ZaloPay, etc.)
  - Trạng thái:
    - ✅ Thành công
    - ⏳ Chờ xử lý
    - ❌ Thất bại
    - ↩️ Hoàn tiền
  - Hóa đơn (✅ Có / -)
  - Thời gian

#### **Mock Data:**
- 3 Payout Requests (Completed, Requested, Processing)
- 4 Wallet Transactions (Credit/Debit)
- 3 Payments (Completed, Pending)

---

## 🎨 Layout & Navigation

### **Sidebar Menu:**
- ✅ **Collapsible:** Toggle button (◀/▶)
- ✅ **Logo:** EzyFix với gradient
- ✅ **Menu Items:**
  - 📊 Dashboard
  - 👥 User Management
    - All Users
    - Customers
    - Technicians
    - Support Staff
  - 🔧 Services
    - All Services
    - Categories
  - 🎫 Vouchers
  - 💰 Financial
    - Overview
    - Payout Requests
    - Transactions

- ✅ **User Profile:** Avatar + Name + Email

### **Top Header:**
- ✅ **Page Title:** Dynamic based on route
- ✅ **Current Date:** Vietnamese format
- ✅ **Actions:**
  - 🔔 Notifications (với badge)
  - ⚙️ Settings
  - Đăng xuất button (gradient)

---

## 🗄️ Mock Data Summary

### **Database Tables Implemented:**
1. ✅ **Users** - 5 sample users
2. ✅ **Customer** - 2 customers
3. ✅ **Technician** - 2 technicians (với Skills)
4. ✅ **Skill** - 7 skills
5. ✅ **ServiceCategory** - 4 categories
6. ✅ **Service** - 6 services (1 disabled)
7. ✅ **Voucher** - 3 vouchers
8. ✅ **VoucherUsage** - 2 usage records
9. ✅ **PaymentMethod** - 5 methods
10. ✅ **WalletAccount** - 2 accounts
11. ✅ **WalletTransaction** - 4 transactions
12. ✅ **WalletPayoutRequest** - 3 requests
13. ✅ **Payment** - 3 payments
14. ✅ **DashboardStats** - Full analytics

---

## 🎯 Các tính năng đặc biệt

### 1. **Service Availability Check**
```typescript
// Kiểm tra thợ khả dụng cho service
const getTechnicianCountForSkill = (serviceName: string) => {
  const matchingSkill = mockSkills.find(skill => skill.SkillName === serviceName);
  if (!matchingSkill) {
    return 0;
  }
  return mockTechnicians.filter(tech =>
    tech.Skills?.some(s => s.SkillID === matchingSkill.SkillID)
  ).length;
};

// Logic enable/disable service
const canBeActive = techCount > 0;
```

### 2. **Voucher Usage Progress**
```typescript
const getUsagePercentage = (voucher) => {
  const used = voucher.UsageCount || 0;
  const max = voucher.MaxUsageCount;
  return Math.round((used / max) * 100);
};

// Warning color khi ≥80%
const isNearlyFull = usagePercent >= 80;
```

### 3. **Dynamic Stats Calculation**
```typescript
const totalPendingPayouts = mockPayoutRequests
  .filter(p => p.Status === 'Requested')
  .reduce((sum, p) => sum + p.Amount, 0);
```

---

## 🎨 Responsive Design

### **Breakpoints:**
- **Mobile:** < 640px (1 column)
- **Tablet:** 640-1024px (2 columns)
- **Desktop:** ≥1024px (3-4 columns)

### **Grid Layouts:**
- Stats Cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Voucher Cards: `grid-cols-1 lg:grid-cols-2`
- Service Table: Horizontal scroll on mobile

---

## 🚀 Cách sử dụng

### **Development:**
```bash
npm run dev
# Truy cập: http://localhost:3000/admin
```

### **Production Build:**
```bash
npm run build
npm start
```

---

## 📝 TODO - Tích hợp Backend (Future)

### **API Endpoints cần thiết:**

#### **Users:**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user detail
- `PUT /api/admin/users/:id` - Update user
- `POST /api/admin/users` - Create user

#### **Services:**
- `GET /api/admin/services` - Get all services
- `PUT /api/admin/services/:id/toggle` - Enable/disable service
- `GET /api/admin/services/:id/technicians` - Get available technicians

#### **Vouchers:**
- `GET /api/admin/vouchers` - Get all vouchers
- `POST /api/admin/vouchers` - Create voucher
- `PUT /api/admin/vouchers/:id` - Update voucher
- `DELETE /api/admin/vouchers/:id` - Delete voucher

#### **Financial:**
- `GET /api/admin/financial/payouts` - Get payout requests
- `PUT /api/admin/financial/payouts/:id/approve` - Approve payout
- `PUT /api/admin/financial/payouts/:id/reject` - Reject payout
- `GET /api/admin/financial/transactions` - Get transactions
- `GET /api/admin/financial/payments` - Get payments

#### **Dashboard:**
- `GET /api/admin/dashboard/stats` - Get KPIs
- `GET /api/admin/dashboard/revenue-chart` - Revenue data
- `GET /api/admin/dashboard/top-services` - Top services
- `GET /api/admin/dashboard/top-technicians` - Top technicians

---

## ✅ Checklist hoàn thành

- [x] ✅ Admin Layout với Sidebar Navigation
- [x] ✅ Dashboard với charts và KPIs
- [x] ✅ User Management (All/Customers/Technicians/Support)
- [x] ✅ Service Management với availability check
- [x] ✅ Voucher Management với usage tracking
- [x] ✅ Financial Management (Payouts/Transactions/Payments)
- [x] ✅ Mock Data theo đúng DB Schema
- [x] ✅ Responsive Design
- [x] ✅ EzyFix Color Scheme (C3EAFA → 5E9BEF)
- [x] ✅ Professional UI/UX với animations

---

## 🎉 Kết luận

**EzyFix Admin Portal** đã hoàn thành với đầy đủ các tính năng quản lý:
- ✅ UI/UX đẹp mắt và thân thiện
- ✅ Responsive design cho mọi thiết bị
- ✅ Mock data đầy đủ theo DB schema
- ✅ Logic nghiệp vụ (service availability, voucher usage, etc.)
- ✅ Color scheme theo branding EzyFix

**Sẵn sàng để tích hợp Backend API! 🚀**

---

<div align="center">

**Made with ❤️ by EzyFix Team**

*Trang admin chuyên nghiệp cho hệ thống EzyFix*

</div>
