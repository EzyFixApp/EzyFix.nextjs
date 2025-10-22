// Admin Portal Types - Based on EzyFix Database Schema

// ============================================
// USER MANAGEMENT TYPES
// ============================================

export type Role = {
  RoleID: string;
  RoleName: 'Admin' | 'Customer' | 'Technician' | 'Support';
};

export type User = {
  UserID: string;
  RoleID: string;
  RoleName?: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  AvatarLink?: string;
  PreferredLanguage: 'vi' | 'en';
  IsActive: boolean;
  IsVerify: boolean;
  CreatedDate: string;
};

export type Customer = User & {
  CustomerID: string;
  LoyaltyPoints: number;
  PreferredContactMethod: string;
};

export type Technician = User & {
  TechnicianID: string;
  Certification: string;
  YearsOfExperience: number;
  AvailabilityStatus: 'Available' | 'Busy' | 'Offline' | 'Suspended';
  HourlyRate: number;
  Rating?: number;
  TotalJobs?: number;
  Skills?: TechnicianSkill[];
};

export type Skill = {
  SkillID: string;
  SkillName: string;
};

export type TechnicianSkill = {
  TechnicianID: string;
  SkillID: string;
  SkillName?: string;
  Level: 'Beginner' | 'Intermediate' | 'Expert';
};

// ============================================
// SERVICE MANAGEMENT TYPES
// ============================================

export type ServiceCategory = {
  CategoryID: string;
  CategoryName: string;
  ServiceCount?: number;
  IsActive?: boolean;
};

export type Service = {
  ServiceID: string;
  CategoryID: string;
  CategoryName?: string;
  ServiceName: string;
  Description: string;
  ServiceIconUrl?: string;
  BasePrice: number;
  IsActive: boolean;
  AvailableTechniciansCount?: number;
  TotalRequests?: number;
};

// ============================================
// VOUCHER MANAGEMENT TYPES
// ============================================

export type Voucher = {
  VoucherID: string;
  VoucherCode: string;
  VoucherDescription: string;
  DiscountType: 'Percentage' | 'FixedAmount';
  DiscountValue: number;
  MaxDiscountAmount?: number;
  MinimumOrderAmount: number;
  ValidFrom: string;
  ValidTo: string;
  MaxUsageCount: number;
  MaxUsagePerUserCount: number;
  IsActive: boolean;
  CreatedDate: string;
  UsageCount?: number;
  Categories?: string[];
  Services?: string[];
  PaymentMethods?: string[];
};

export type VoucherUsage = {
  VoucherUsageID: string;
  VoucherID: string;
  VoucherCode?: string;
  UserID: string;
  UserName?: string;
  ServiceRequestID: string;
  PaymentID?: string;
  UsedAt: string;
};

// ============================================
// FINANCIAL TYPES
// ============================================

export type Payment = {
  PaymentID: string;
  AppointmentID: string;
  Amount: number;
  PaymentMethodID: string;
  PaymentMethodName?: string;
  Status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  TransactionDate: string;
  InvoiceRequested: boolean;
  ConfirmImageURL?: string;
};

export type PaymentMethod = {
  PaymentMethodID: string;
  MethodCode: string;
  MethodName: string;
  IsOnline: boolean;
  IsActive: boolean;
  CreatedDate: string;
};

export type WalletAccount = {
  WalletAccountID: string;
  TechnicianID: string;
  TechnicianName?: string;
  CurrencyCode: string;
  Balance: number;
  Status: 'Active' | 'Suspended';
  CreatedDate: string;
  UpdatedDate: string;
};

export type WalletTransaction = {
  TransactionID: string;
  WalletAccountID: string;
  TechnicianName?: string;
  Type: 'Credit' | 'Debit';
  Amount: number;
  Reason: 'Earning' | 'Commission' | 'Withdrawal' | 'Adjustment';
  ReferenceType: 'Appointment' | 'Payment' | 'Manual';
  ReferenceID?: string;
  Note?: string;
  CreatedAt: string;
};

export type WalletPayoutRequest = {
  PayoutRequestID: string;
  WalletAccountID: string;
  TechnicianName?: string;
  Amount: number;
  Status: 'Requested' | 'Processing' | 'Completed' | 'Rejected';
  RequestedAt: string;
  ProcessedAt?: string;
  PayoutChannel: 'Bank' | 'EWallet';
  ReceiverName: string;
  ReceiverAccount: string;
  BankCode?: string;
  Note?: string;
};

// ============================================
// ANALYTICS TYPES
// ============================================

export type DashboardStats = {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  totalSupportStaff: number;
  activeAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  activeDisputes: number;
  pendingPayouts: number;
  activeVouchers: number;
};

export type RevenueChart = {
  date: string;
  revenue: number;
  appointments: number;
};

export type ServiceDemand = {
  serviceName: string;
  requestCount: number;
  revenue: number;
};

export type TechnicianPerformance = {
  technicianID: string;
  technicianName: string;
  specialty: string;
  completedJobs: number;
  totalJobs: number;
  rating: number;
  earnings: number;
};

// ============================================
// SUPPORT MANAGEMENT TYPES
// ============================================

export type Dispute = {
  DisputeID: string;
  AppointmentID: string;
  AppointmentDetails?: {
    ServiceName: string;
    CustomerName: string;
    TechnicianName: string;
    ScheduledDate: string;
  };
  RaisedBy: string;
  RaisedByName?: string;
  RaisedByRole?: 'Customer' | 'Technician';
  Reason: string;
  Status: 'Open' | 'InProgress' | 'Resolved' | 'Rejected';
  CreatedDate: string;
  ResolvedDate?: string;
  ResolutionNotes?: string;
};

export type SupportConversation = {
  ConversationId: string;
  ConversationType: 'support';
  CustomerName: string;
  CustomerAvatar?: string;
  Subject: string;
  Status: 'Waiting' | 'InProgress' | 'Resolved';
  LastMessageAt: string;
  UnreadCount: number;
  AssignedTo?: string;
  CreatedAt: string;
};

export type SupportMessage = {
  MessageId: string;
  ConversationId: string;
  SenderId: string;
  SenderName: string;
  SenderRole: 'Customer' | 'Technician' | 'Support' | 'Admin';
  Content: string;
  MessageType: 'text' | 'image' | 'file';
  Timestamp: string;
  IsRead: boolean;
};

export type ActivityLog = {
  LogID: string;
  AppointmentID?: string;
  RequestID?: string;
  UserID: string;
  UserName?: string;
  Action: string;
  OldValue?: string;
  NewValue?: string;
  LoggedAt: string;
  EntityType?: 'Appointment' | 'Request' | 'User' | 'Payment';
};

export type ProblematicRequest = {
  RequestID: string;
  CustomerID: string;
  CustomerName: string;
  ServiceName: string;
  Status: string;
  IssueType: 'NoOffers' | 'Cancelled' | 'Expired' | 'Stuck';
  IssueDescription: string;
  RequestedDate: string;
  DaysPending: number;
  OfferCount: number;
};

// ============================================
// FILTER & PAGINATION TYPES
// ============================================

export type FilterParams = {
  search?: string;
  role?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};
