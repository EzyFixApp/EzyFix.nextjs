/**
 * User Management Types
 * Based on /api/admin/users endpoints
 */

// User roles
export type UserRole = 'Admin' | 'Customer' | 'Technician' | 'Supporter';

// User list item from GET /admin/users
export type User = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  avatarLink: string | null;
  role: UserRole;
  roleId: string;
  isActive: boolean;
  isVerify: boolean;
  createdDate: string;
  lastChangePassword: string | null;
  preferredLanguage: string | null;
  profileCompletion: number;
  flags: string[];
};

// Customer profile
export type CustomerProfile = {
  customerId: string;
  loyaltyPoints: number;
  preferredContactMethod: string;
  totalServiceRequests: number;
  completedAppointments: number;
  cancelledAppointments: number;
  activeDisputes: number;
  totalSpent: number;
  averageRating: number;
};

// Technician profile
export type TechnicianProfile = {
  technicianId: string;
  certification: string | null;
  yearsOfExperience: number;
  availabilityStatus: string;
  hourlyRate: number;
  totalJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  totalEarnings: number;
  walletBalance: number;
  averageRating: number;
  totalReviews: number;
  skills: string[];
};

// Address
export type Address = {
  addressId: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
};

// Emergency contact
export type EmergencyContact = {
  contactId: string;
  contactName: string;
  phone: string;
  relationship: string;
};

// Activity log
export type ActivityLog = {
  logId: string;
  action: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
};

// User details from GET /admin/users/{id}
export type UserDetails = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  avatarLink: string | null;
  role: {
    roleId: string;
    roleName: UserRole;
  };
  accountStatus: {
    isActive: boolean;
    isVerify: boolean;
    createdDate: string;
    lastChangePassword: string | null;
    preferredLanguage: string | null;
  };
  customerProfile: CustomerProfile | null;
  technicianProfile: TechnicianProfile | null;
  addresses: Address[];
  emergencyContacts: EmergencyContact[];
  statistics: {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    activeDisputes: number;
    totalPayments: number;
    totalReviews: number;
    averageReviewRating: number;
  };
  recentActivity: ActivityLog[];
  securityInfo: {
    lastLogin: string | null;
    passwordAge: number;
    failedLoginAttempts: number;
    accountLocked: boolean;
    twoFactorEnabled: boolean;
  };
};

// Summary stats
export type UserSummary = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  roleBreakdown: {
    Customer: number;
    Technician: number;
    Admin: number;
    Supporter: number;
  };
};

// Response from GET /admin/users
export type GetUsersResponse = {
  items: User[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  summary: UserSummary;
};

// Request params for GET /admin/users
export type GetUsersParams = {
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  searchKeyword?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

// Request for PATCH /admin/users/{id}/status
export type UpdateStatusRequest = {
  isActive: boolean;
  reason: string;
  notifyUser?: boolean;
};

// Response from PATCH /admin/users/{id}/status
export type UpdateStatusResponse = {
  userId: string;
  isActive: boolean;
  updatedAt: string;
  affectedEntities: {
    cancelledRequests: number;
    cancelledAppointments: number;
    notifiedUsers: number;
  };
};

// Request for PATCH /admin/users/{id}/verify
export type VerifyUserRequest = {
  isVerify: boolean;
  notes?: string;
};

// Response from PATCH /admin/users/{id}/verify
export type VerifyUserResponse = {
  userId: string;
  isVerify: boolean;
  verifiedAt: string;
};

// Request for PATCH /admin/users/{id}/role
export type ChangeRoleRequest = {
  newRole: UserRole;
  reason: string;
  preserveData?: boolean;
};

// Response from PATCH /admin/users/{id}/role
export type ChangeRoleResponse = {
  userId: string;
  oldRole: UserRole;
  newRole: UserRole;
  updatedAt: string;
  profilesCreated: string[];
};

// Request for DELETE /admin/users/{id}
export type DeleteUserRequest = {
  reason: string;
  deleteRelatedData?: boolean;
};

// Response from DELETE /admin/users/{id}
export type DeleteUserResponse = {
  userId: string;
  deletedAt: string;
  deleteType: 'soft' | 'hard';
  dataRetention: {
    keptAppointments: number;
    keptPayments: number;
    keptReviews: number;
  };
};

// Request for PATCH /admin/users/{id}/reset-password
export type ResetPasswordRequest = {
  generateTemporaryPassword?: boolean;
  sendEmail?: boolean;
  reason?: string;
};

// Response from PATCH /admin/users/{id}/reset-password
export type ResetPasswordResponse = {
  userId: string;
  temporaryPassword?: string;
  resetToken: string;
  expiresAt: string;
  emailSent: boolean;
};
