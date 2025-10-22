// Mock Data for EzyFix Admin Portal
import type {
  Customer,
  DashboardStats,
  Payment,
  PaymentMethod,
  RevenueChart,
  Service,
  ServiceCategory,
  ServiceDemand,
  Skill,
  Technician,
  TechnicianPerformance,
  User,
  Voucher,
  VoucherUsage,
  WalletAccount,
  WalletPayoutRequest,
  WalletTransaction,
} from '@/types/admin';

// ============================================
// DASHBOARD STATISTICS
// ============================================

export const dashboardStats: DashboardStats = {
  totalUsers: 1248,
  totalCustomers: 856,
  totalTechnicians: 342,
  totalSupportStaff: 50,
  activeAppointments: 127,
  completedAppointments: 8563,
  totalRevenue: 2456780000, // VND
  monthlyRevenue: 456780000, // VND
  averageRating: 4.7,
  activeDisputes: 12,
  pendingPayouts: 28,
  activeVouchers: 15,
};

// ============================================
// REVENUE CHART DATA (Last 7 days)
// ============================================

export const revenueChartData: RevenueChart[] = [
  { date: '2025-10-13', revenue: 45600000, appointments: 82 },
  { date: '2025-10-14', revenue: 52300000, appointments: 95 },
  { date: '2025-10-15', revenue: 48900000, appointments: 88 },
  { date: '2025-10-16', revenue: 61200000, appointments: 102 },
  { date: '2025-10-17', revenue: 58700000, appointments: 97 },
  { date: '2025-10-18', revenue: 72400000, appointments: 115 },
  { date: '2025-10-19', revenue: 67680000, appointments: 108 },
];

// ============================================
// SERVICE DEMAND DATA
// ============================================

export const serviceDemandData: ServiceDemand[] = [
  { serviceName: 'Sửa máy lạnh', requestCount: 342, revenue: 856000000 },
  { serviceName: 'Sửa máy giặt', requestCount: 298, revenue: 672000000 },
  { serviceName: 'Sửa tủ lạnh', requestCount: 215, revenue: 548000000 },
  { serviceName: 'Sửa TV', requestCount: 187, revenue: 421000000 },
  { serviceName: 'Sửa bình nóng lạnh', requestCount: 156, revenue: 312000000 },
];

// ============================================
// TECHNICIAN PERFORMANCE DATA
// ============================================

export const technicianPerformanceData: TechnicianPerformance[] = [
  {
    technicianID: 't1',
    technicianName: 'Nguyễn Văn A',
    specialty: 'Điện lạnh',
    completedJobs: 156,
    totalJobs: 162,
    rating: 4.9,
    earnings: 78000000,
  },
  {
    technicianID: 't2',
    technicianName: 'Trần Thị B',
    specialty: 'Sửa ống nước',
    completedJobs: 142,
    totalJobs: 148,
    rating: 4.8,
    earnings: 71000000,
  },
  {
    technicianID: 't3',
    technicianName: 'Lê Văn C',
    specialty: 'Điện dân dụng',
    completedJobs: 138,
    totalJobs: 145,
    rating: 4.8,
    earnings: 69000000,
  },
  {
    technicianID: 't4',
    technicianName: 'Phạm Thị D',
    specialty: 'Sơn nhà',
    completedJobs: 125,
    totalJobs: 133,
    rating: 4.7,
    earnings: 62500000,
  },
  {
    technicianID: 't5',
    technicianName: 'Hoàng Văn E',
    specialty: 'Điện tử',
    completedJobs: 118,
    totalJobs: 125,
    rating: 4.6,
    earnings: 59000000,
  },
];

// ============================================
// USERS DATA
// ============================================

export const mockUsers: User[] = [
  {
    UserID: 'u1',
    RoleID: 'r3',
    RoleName: 'Customer',
    FirstName: 'Nguyễn',
    LastName: 'Văn An',
    Email: 'nguyenvanan@gmail.com',
    Phone: '0901234567',
    AvatarLink: 'https://i.pravatar.cc/150?img=1',
    PreferredLanguage: 'vi',
    IsActive: true,
    IsVerify: true,
    CreatedDate: '2025-01-15T10:30:00',
  },
  {
    UserID: 'u2',
    RoleID: 'r2',
    RoleName: 'Technician',
    FirstName: 'Trần',
    LastName: 'Thị Bình',
    Email: 'tranthibinh@gmail.com',
    Phone: '0902345678',
    AvatarLink: 'https://i.pravatar.cc/150?img=5',
    PreferredLanguage: 'vi',
    IsActive: true,
    IsVerify: true,
    CreatedDate: '2024-11-20T14:20:00',
  },
  {
    UserID: 'u3',
    RoleID: 'r4',
    RoleName: 'Support',
    FirstName: 'Lê',
    LastName: 'Văn Cường',
    Email: 'levancuong@ezyfix.com',
    Phone: '0903456789',
    AvatarLink: 'https://i.pravatar.cc/150?img=12',
    PreferredLanguage: 'vi',
    IsActive: true,
    IsVerify: true,
    CreatedDate: '2024-09-10T09:00:00',
  },
  {
    UserID: 'u4',
    RoleID: 'r3',
    RoleName: 'Customer',
    FirstName: 'Phạm',
    LastName: 'Thị Dung',
    Email: 'phamthidung@gmail.com',
    Phone: '0904567890',
    AvatarLink: 'https://i.pravatar.cc/150?img=10',
    PreferredLanguage: 'vi',
    IsActive: true,
    IsVerify: false,
    CreatedDate: '2025-02-28T16:45:00',
  },
  {
    UserID: 'u5',
    RoleID: 'r2',
    RoleName: 'Technician',
    FirstName: 'Hoàng',
    LastName: 'Văn Em',
    Email: 'hoangvanem@gmail.com',
    Phone: '0905678901',
    AvatarLink: 'https://i.pravatar.cc/150?img=15',
    PreferredLanguage: 'vi',
    IsActive: true,
    IsVerify: true,
    CreatedDate: '2024-12-05T11:30:00',
  },
];

// ============================================
// CUSTOMERS DATA
// ============================================

export const mockCustomers: Customer[] = [
  {
    ...mockUsers[0]!,
    CustomerID: 'c1',
    LoyaltyPoints: 1250,
    PreferredContactMethod: 'Phone',
  },
  {
    ...mockUsers[3]!,
    CustomerID: 'c2',
    LoyaltyPoints: 450,
    PreferredContactMethod: 'Email',
  },
];

// ============================================
// SKILLS DATA
// ============================================

export const mockSkills: Skill[] = [
  { SkillID: 'sk1', SkillName: 'Sửa máy lạnh' },
  { SkillID: 'sk2', SkillName: 'Sửa máy giặt' },
  { SkillID: 'sk3', SkillName: 'Sửa tủ lạnh' },
  { SkillID: 'sk4', SkillName: 'Sửa TV' },
  { SkillID: 'sk5', SkillName: 'Sửa bình nóng lạnh' },
  { SkillID: 'sk6', SkillName: 'Điện lạnh công nghiệp' },
  { SkillID: 'sk7', SkillName: 'Điện dân dụng' },
];

// ============================================
// TECHNICIANS DATA
// ============================================

export const mockTechnicians: Technician[] = [
  {
    ...mockUsers[1]!,
    TechnicianID: 't1',
    Certification: 'Chứng chỉ Điện lạnh cấp 3',
    YearsOfExperience: 5,
    AvailabilityStatus: 'Available',
    HourlyRate: 150000,
    Rating: 4.8,
    TotalJobs: 142,
    Skills: [
      { TechnicianID: 't1', SkillID: 'sk1', SkillName: 'Sửa máy lạnh', Level: 'Expert' },
      { TechnicianID: 't1', SkillID: 'sk2', SkillName: 'Sửa máy giặt', Level: 'Intermediate' },
      { TechnicianID: 't1', SkillID: 'sk5', SkillName: 'Sửa bình nóng lạnh', Level: 'Expert' },
    ],
  },
  {
    ...mockUsers[4]!,
    TechnicianID: 't2',
    Certification: 'Chứng chỉ Điện lạnh cấp 2',
    YearsOfExperience: 3,
    AvailabilityStatus: 'Busy',
    HourlyRate: 120000,
    Rating: 4.6,
    TotalJobs: 89,
    Skills: [
      { TechnicianID: 't2', SkillID: 'sk3', SkillName: 'Sửa tủ lạnh', Level: 'Expert' },
      { TechnicianID: 't2', SkillID: 'sk4', SkillName: 'Sửa TV', Level: 'Intermediate' },
    ],
  },
];

// ============================================
// SERVICE CATEGORIES DATA
// ============================================

export const mockServiceCategories: ServiceCategory[] = [
  { CategoryID: 'cat1', CategoryName: 'Điện lạnh', ServiceCount: 5, IsActive: true },
  { CategoryID: 'cat2', CategoryName: 'Điện tử', ServiceCount: 3, IsActive: true },
  { CategoryID: 'cat3', CategoryName: 'Nội thất', ServiceCount: 4, IsActive: true },
  { CategoryID: 'cat4', CategoryName: 'Điện dân dụng', ServiceCount: 6, IsActive: true },
];

// ============================================
// SERVICES DATA
// ============================================

export const mockServices: Service[] = [
  {
    ServiceID: 's1',
    CategoryID: 'cat1',
    CategoryName: 'Điện lạnh',
    ServiceName: 'Sửa máy lạnh',
    Description: 'Sửa chữa, bảo trì máy lạnh các loại',
    ServiceIconUrl: '❄️',
    BasePrice: 200000,
    IsActive: true,
    AvailableTechniciansCount: 45,
    TotalRequests: 342,
  },
  {
    ServiceID: 's2',
    CategoryID: 'cat1',
    CategoryName: 'Điện lạnh',
    ServiceName: 'Sửa máy giặt',
    Description: 'Sửa chữa máy giặt cửa ngang, cửa trên',
    ServiceIconUrl: '🧺',
    BasePrice: 180000,
    IsActive: true,
    AvailableTechniciansCount: 38,
    TotalRequests: 298,
  },
  {
    ServiceID: 's3',
    CategoryID: 'cat1',
    CategoryName: 'Điện lạnh',
    ServiceName: 'Sửa tủ lạnh',
    Description: 'Sửa chữa tủ lạnh, tủ đông các loại',
    ServiceIconUrl: '🧊',
    BasePrice: 220000,
    IsActive: true,
    AvailableTechniciansCount: 32,
    TotalRequests: 215,
  },
  {
    ServiceID: 's4',
    CategoryID: 'cat2',
    CategoryName: 'Điện tử',
    ServiceName: 'Sửa TV',
    Description: 'Sửa chữa TV LCD, LED, Smart TV',
    ServiceIconUrl: '📺',
    BasePrice: 250000,
    IsActive: true,
    AvailableTechniciansCount: 28,
    TotalRequests: 187,
  },
  {
    ServiceID: 's5',
    CategoryID: 'cat1',
    CategoryName: 'Điện lạnh',
    ServiceName: 'Sửa bình nóng lạnh',
    Description: 'Sửa chữa bình nóng lạnh điện, gas',
    ServiceIconUrl: '🚿',
    BasePrice: 150000,
    IsActive: true,
    AvailableTechniciansCount: 25,
    TotalRequests: 156,
  },
  {
    ServiceID: 's6',
    CategoryID: 'cat4',
    CategoryName: 'Điện dân dụng',
    ServiceName: 'Sửa quạt điện',
    Description: 'Sửa chữa quạt trần, quạt đứng, quạt hộp',
    ServiceIconUrl: '🌀',
    BasePrice: 100000,
    IsActive: false,
    AvailableTechniciansCount: 0,
    TotalRequests: 87,
  },
];

// ============================================
// PAYMENT METHODS DATA
// ============================================

export const mockPaymentMethods: PaymentMethod[] = [
  {
    PaymentMethodID: 'pm1',
    MethodCode: 'MOMO',
    MethodName: 'Ví MoMo',
    IsOnline: true,
    IsActive: true,
    CreatedDate: '2024-01-01T00:00:00',
  },
  {
    PaymentMethodID: 'pm2',
    MethodCode: 'ZALOPAY',
    MethodName: 'ZaloPay',
    IsOnline: true,
    IsActive: true,
    CreatedDate: '2024-01-01T00:00:00',
  },
  {
    PaymentMethodID: 'pm3',
    MethodCode: 'VNPAY',
    MethodName: 'VNPAY',
    IsOnline: true,
    IsActive: true,
    CreatedDate: '2024-01-01T00:00:00',
  },
  {
    PaymentMethodID: 'pm4',
    MethodCode: 'BANK_QR',
    MethodName: 'Chuyển khoản QR',
    IsOnline: true,
    IsActive: true,
    CreatedDate: '2024-01-01T00:00:00',
  },
  {
    PaymentMethodID: 'pm5',
    MethodCode: 'CASH',
    MethodName: 'Tiền mặt',
    IsOnline: false,
    IsActive: true,
    CreatedDate: '2024-01-01T00:00:00',
  },
];

// ============================================
// VOUCHERS DATA
// ============================================

export const mockVouchers: Voucher[] = [
  {
    VoucherID: 'v1',
    VoucherCode: 'WELCOME2025',
    VoucherDescription: 'Giảm 20% cho khách hàng mới',
    DiscountType: 'Percentage',
    DiscountValue: 20,
    MaxDiscountAmount: 100000,
    MinimumOrderAmount: 200000,
    ValidFrom: '2025-01-01T00:00:00',
    ValidTo: '2025-12-31T23:59:59',
    MaxUsageCount: 1000,
    MaxUsagePerUserCount: 1,
    IsActive: true,
    CreatedDate: '2024-12-15T10:00:00',
    UsageCount: 342,
    Categories: ['Điện lạnh', 'Điện tử'],
    Services: ['Sửa máy lạnh', 'Sửa máy giặt'],
    PaymentMethods: ['MOMO', 'ZALOPAY', 'VNPAY'],
  },
  {
    VoucherID: 'v2',
    VoucherCode: 'FLASH50K',
    VoucherDescription: 'Giảm 50,000đ cho đơn từ 500K',
    DiscountType: 'FixedAmount',
    DiscountValue: 50000,
    MinimumOrderAmount: 500000,
    ValidFrom: '2025-10-01T00:00:00',
    ValidTo: '2025-10-31T23:59:59',
    MaxUsageCount: 500,
    MaxUsagePerUserCount: 2,
    IsActive: true,
    CreatedDate: '2025-09-25T14:30:00',
    UsageCount: 128,
    Categories: ['Điện lạnh'],
    Services: ['Sửa máy lạnh', 'Sửa tủ lạnh'],
    PaymentMethods: ['MOMO', 'ZALOPAY'],
  },
  {
    VoucherID: 'v3',
    VoucherCode: 'SUMMER15',
    VoucherDescription: 'Giảm 15% dịch vụ điện lạnh mùa hè',
    DiscountType: 'Percentage',
    DiscountValue: 15,
    MaxDiscountAmount: 80000,
    MinimumOrderAmount: 300000,
    ValidFrom: '2025-05-01T00:00:00',
    ValidTo: '2025-08-31T23:59:59',
    MaxUsageCount: 2000,
    MaxUsagePerUserCount: 3,
    IsActive: false,
    CreatedDate: '2025-04-20T09:00:00',
    UsageCount: 1856,
    Categories: ['Điện lạnh'],
    Services: [],
    PaymentMethods: [],
  },
];

// ============================================
// VOUCHER USAGE DATA
// ============================================

export const mockVoucherUsage: VoucherUsage[] = [
  {
    VoucherUsageID: 'vu1',
    VoucherID: 'v1',
    VoucherCode: 'WELCOME2025',
    UserID: 'u1',
    UserName: 'Nguyễn Văn An',
    ServiceRequestID: 'sr1',
    PaymentID: 'pay1',
    UsedAt: '2025-10-15T14:30:00',
  },
  {
    VoucherUsageID: 'vu2',
    VoucherID: 'v2',
    VoucherCode: 'FLASH50K',
    UserID: 'u4',
    UserName: 'Phạm Thị Dung',
    ServiceRequestID: 'sr2',
    PaymentID: 'pay2',
    UsedAt: '2025-10-18T10:15:00',
  },
];

// ============================================
// WALLET ACCOUNTS DATA
// ============================================

export const mockWalletAccounts: WalletAccount[] = [
  {
    WalletAccountID: 'wa1',
    TechnicianID: 't1',
    TechnicianName: 'Trần Thị Bình',
    CurrencyCode: 'VND',
    Balance: 15680000,
    Status: 'Active',
    CreatedDate: '2024-11-20T14:20:00',
    UpdatedDate: '2025-10-19T08:30:00',
  },
  {
    WalletAccountID: 'wa2',
    TechnicianID: 't2',
    TechnicianName: 'Hoàng Văn Em',
    CurrencyCode: 'VND',
    Balance: 8920000,
    Status: 'Active',
    CreatedDate: '2024-12-05T11:30:00',
    UpdatedDate: '2025-10-18T16:45:00',
  },
];

// ============================================
// WALLET TRANSACTIONS DATA
// ============================================

export const mockWalletTransactions: WalletTransaction[] = [
  {
    TransactionID: 'wt1',
    WalletAccountID: 'wa1',
    TechnicianName: 'Trần Thị Bình',
    Type: 'Credit',
    Amount: 450000,
    Reason: 'Earning',
    ReferenceType: 'Appointment',
    ReferenceID: 'ap1',
    Note: 'Hoàn thành sửa máy lạnh #AP001',
    CreatedAt: '2025-10-19T10:30:00',
  },
  {
    TransactionID: 'wt2',
    WalletAccountID: 'wa1',
    TechnicianName: 'Trần Thị Bình',
    Type: 'Debit',
    Amount: 67500,
    Reason: 'Commission',
    ReferenceType: 'Payment',
    ReferenceID: 'pay1',
    Note: 'Phí nền tảng 15%',
    CreatedAt: '2025-10-19T10:31:00',
  },
  {
    TransactionID: 'wt3',
    WalletAccountID: 'wa1',
    TechnicianName: 'Trần Thị Bình',
    Type: 'Debit',
    Amount: 5000000,
    Reason: 'Withdrawal',
    ReferenceType: 'Manual',
    Note: 'Rút tiền về tài khoản ngân hàng',
    CreatedAt: '2025-10-18T14:20:00',
  },
  {
    TransactionID: 'wt4',
    WalletAccountID: 'wa2',
    TechnicianName: 'Hoàng Văn Em',
    Type: 'Credit',
    Amount: 380000,
    Reason: 'Earning',
    ReferenceType: 'Appointment',
    ReferenceID: 'ap2',
    Note: 'Hoàn thành sửa tủ lạnh #AP002',
    CreatedAt: '2025-10-18T16:45:00',
  },
];

// ============================================
// WALLET PAYOUT REQUESTS DATA
// ============================================

export const mockPayoutRequests: WalletPayoutRequest[] = [
  {
    PayoutRequestID: 'pr1',
    WalletAccountID: 'wa1',
    TechnicianName: 'Trần Thị Bình',
    Amount: 5000000,
    Status: 'Completed',
    RequestedAt: '2025-10-18T09:00:00',
    ProcessedAt: '2025-10-18T14:20:00',
    PayoutChannel: 'Bank',
    ReceiverName: 'TRAN THI BINH',
    ReceiverAccount: '1234567890',
    BankCode: 'VCB',
    Note: 'Rút tiền lương tháng 10',
  },
  {
    PayoutRequestID: 'pr2',
    WalletAccountID: 'wa2',
    TechnicianName: 'Hoàng Văn Em',
    Amount: 3000000,
    Status: 'Requested',
    RequestedAt: '2025-10-19T08:30:00',
    PayoutChannel: 'EWallet',
    ReceiverName: 'Hoàng Văn Em',
    ReceiverAccount: '0905678901',
    Note: 'Rút về ví MoMo',
  },
  {
    PayoutRequestID: 'pr3',
    WalletAccountID: 'wa1',
    TechnicianName: 'Trần Thị Bình',
    Amount: 2500000,
    Status: 'Processing',
    RequestedAt: '2025-10-19T10:00:00',
    PayoutChannel: 'Bank',
    ReceiverName: 'TRAN THI BINH',
    ReceiverAccount: '1234567890',
    BankCode: 'VCB',
  },
];

// ============================================
// PAYMENTS DATA
// ============================================

export const mockPayments: Payment[] = [
  {
    PaymentID: 'pay1',
    AppointmentID: 'ap1',
    Amount: 450000,
    PaymentMethodID: 'pm1',
    PaymentMethodName: 'Ví MoMo',
    Status: 'Completed',
    TransactionDate: '2025-10-19T10:30:00',
    InvoiceRequested: false,
  },
  {
    PaymentID: 'pay2',
    AppointmentID: 'ap2',
    Amount: 380000,
    PaymentMethodID: 'pm2',
    PaymentMethodName: 'ZaloPay',
    Status: 'Completed',
    TransactionDate: '2025-10-18T16:45:00',
    InvoiceRequested: true,
  },
  {
    PaymentID: 'pay3',
    AppointmentID: 'ap3',
    Amount: 520000,
    PaymentMethodID: 'pm5',
    PaymentMethodName: 'Tiền mặt',
    Status: 'Pending',
    TransactionDate: '2025-10-19T11:00:00',
    InvoiceRequested: false,
  },
];

// ============================================
// SUPPORT DATA
// ============================================

export const mockDisputes: import('@/types/admin').Dispute[] = [
  {
    DisputeID: 'd1',
    AppointmentID: 'ap1',
    AppointmentDetails: {
      ServiceName: 'Sửa điều hòa',
      CustomerName: 'Nguyễn Văn An',
      TechnicianName: 'Trần Văn Thợ',
      ScheduledDate: '2025-10-15',
    },
    RaisedBy: 'c1',
    RaisedByName: 'Nguyễn Văn An',
    RaisedByRole: 'Customer',
    Reason: 'Thợ đến muộn 2 tiếng và không thông báo trước. Chất lượng sửa chữa không đảm bảo, máy lạnh vẫn kêu sau khi sửa.',
    Status: 'Open',
    CreatedDate: '2025-10-19T14:30:00',
  },
  {
    DisputeID: 'd2',
    AppointmentID: 'ap2',
    AppointmentDetails: {
      ServiceName: 'Sửa ống nước',
      CustomerName: 'Lê Thị Bình',
      TechnicianName: 'Phạm Văn Công',
      ScheduledDate: '2025-10-16',
    },
    RaisedBy: 't2',
    RaisedByName: 'Phạm Văn Công',
    RaisedByRole: 'Technician',
    Reason: 'Khách hàng yêu cầu làm thêm công việc ngoài phạm vi đã thỏa thuận nhưng không chịu trả thêm phí.',
    Status: 'InProgress',
    CreatedDate: '2025-10-17T09:15:00',
  },
  {
    DisputeID: 'd3',
    AppointmentID: 'ap3',
    AppointmentDetails: {
      ServiceName: 'Sửa điện',
      CustomerName: 'Trần Văn Cường',
      TechnicianName: 'Hoàng Văn Đức',
      ScheduledDate: '2025-10-14',
    },
    RaisedBy: 'c3',
    RaisedByName: 'Trần Văn Cường',
    RaisedByRole: 'Customer',
    Reason: 'Thợ tính sai giá, báo 500k nhưng cuối cùng đòi 1.2 triệu',
    Status: 'Resolved',
    CreatedDate: '2025-10-14T16:00:00',
    ResolvedDate: '2025-10-15T10:30:00',
    ResolutionNotes: 'Đã xác minh báo giá ban đầu. Hoàn tiền cho khách 700k. Cảnh cáo thợ.',
  },
  {
    DisputeID: 'd4',
    AppointmentID: 'ap4',
    AppointmentDetails: {
      ServiceName: 'Sơn nhà',
      CustomerName: 'Phạm Thị Dung',
      TechnicianName: 'Nguyễn Văn Em',
      ScheduledDate: '2025-10-18',
    },
    RaisedBy: 'c4',
    RaisedByName: 'Phạm Thị Dung',
    RaisedByRole: 'Customer',
    Reason: 'Thợ sử dụng sơn không đúng chất lượng như đã thỏa thuận',
    Status: 'Open',
    CreatedDate: '2025-10-19T11:20:00',
  },
];

export const mockSupportConversations: import('@/types/admin').SupportConversation[] = [
  {
    ConversationId: 'conv1',
    ConversationType: 'support',
    CustomerName: 'Nguyễn Văn An',
    CustomerAvatar: 'https://i.pravatar.cc/150?img=1',
    Subject: 'Không tìm được thợ',
    Status: 'Waiting',
    LastMessageAt: '2025-10-19T15:30:00',
    UnreadCount: 3,
    CreatedAt: '2025-10-19T15:00:00',
  },
  {
    ConversationId: 'conv2',
    ConversationType: 'support',
    CustomerName: 'Trần Thị Bình',
    CustomerAvatar: 'https://i.pravatar.cc/150?img=2',
    Subject: 'Vấn đề thanh toán',
    Status: 'InProgress',
    LastMessageAt: '2025-10-19T14:20:00',
    UnreadCount: 1,
    AssignedTo: 'Support Agent #2',
    CreatedAt: '2025-10-19T10:30:00',
  },
  {
    ConversationId: 'conv3',
    ConversationType: 'support',
    CustomerName: 'Lê Văn Cường',
    Subject: 'Tài khoản bị khóa',
    Status: 'InProgress',
    LastMessageAt: '2025-10-19T13:45:00',
    UnreadCount: 0,
    AssignedTo: 'Support Agent #1',
    CreatedAt: '2025-10-19T09:00:00',
  },
  {
    ConversationId: 'conv4',
    ConversationType: 'support',
    CustomerName: 'Phạm Thị Dung',
    CustomerAvatar: 'https://i.pravatar.cc/150?img=4',
    Subject: 'Cách sử dụng voucher',
    Status: 'Resolved',
    LastMessageAt: '2025-10-18T16:30:00',
    UnreadCount: 0,
    CreatedAt: '2025-10-18T14:00:00',
  },
];

export const mockActivityLogs: import('@/types/admin').ActivityLog[] = [
  {
    LogID: 'log1',
    AppointmentID: 'ap1',
    UserID: 'u1',
    UserName: 'Nguyễn Văn An',
    Action: 'STATUS_CHANGED',
    OldValue: 'Scheduled',
    NewValue: 'InProgress',
    LoggedAt: '2025-10-19T08:00:00',
    EntityType: 'Appointment',
  },
  {
    LogID: 'log2',
    RequestID: 'req1',
    UserID: 't1',
    UserName: 'Trần Văn Thợ',
    Action: 'OFFER_SUBMITTED',
    NewValue: '500000 VND',
    LoggedAt: '2025-10-18T14:30:00',
    EntityType: 'Request',
  },
  {
    LogID: 'log3',
    AppointmentID: 'ap2',
    UserID: 'system',
    UserName: 'System',
    Action: 'PAYMENT_COMPLETED',
    NewValue: '350000 VND',
    LoggedAt: '2025-10-18T16:45:00',
    EntityType: 'Payment',
  },
  {
    LogID: 'log4',
    UserID: 'u5',
    UserName: 'Admin',
    Action: 'USER_SUSPENDED',
    OldValue: 'Active',
    NewValue: 'Suspended',
    LoggedAt: '2025-10-17T11:20:00',
    EntityType: 'User',
  },
];

export const mockProblematicRequests: import('@/types/admin').ProblematicRequest[] = [
  {
    RequestID: 'req5',
    CustomerID: 'c5',
    CustomerName: 'Võ Văn Phúc',
    ServiceName: 'Sửa máy giặt',
    Status: 'Pending',
    IssueType: 'NoOffers',
    IssueDescription: 'Không có thợ nào gửi báo giá sau 3 ngày',
    RequestedDate: '2025-10-16T10:00:00',
    DaysPending: 3,
    OfferCount: 0,
  },
  {
    RequestID: 'req6',
    CustomerID: 'c6',
    CustomerName: 'Đặng Thị Giang',
    ServiceName: 'Sửa tủ lạnh',
    Status: 'Cancelled',
    IssueType: 'Cancelled',
    IssueDescription: 'Khách hủy sau khi đã có 2 thợ nhận',
    RequestedDate: '2025-10-17T09:00:00',
    DaysPending: 2,
    OfferCount: 2,
  },
  {
    RequestID: 'req7',
    CustomerID: 'c7',
    CustomerName: 'Bùi Văn Hùng',
    ServiceName: 'Sửa cửa',
    Status: 'Pending',
    IssueType: 'Expired',
    IssueDescription: 'Quá hạn thời gian xử lý (> 7 ngày)',
    RequestedDate: '2025-10-10T08:00:00',
    DaysPending: 9,
    OfferCount: 1,
  },
  {
    RequestID: 'req8',
    CustomerID: 'c8',
    CustomerName: 'Lý Thị Lan',
    ServiceName: 'Sửa bồn cầu',
    Status: 'Pending',
    IssueType: 'Stuck',
    IssueDescription: 'Có offer nhưng không chuyển sang appointment',
    RequestedDate: '2025-10-15T11:30:00',
    DaysPending: 4,
    OfferCount: 3,
  },
];
