'use client';

import type {
  GetUsersParams,
  ResetPasswordRequest,
  UpdateStatusRequest,
  User,
  UserDetails,
  UserRole,
  VerifyUserRequest,
} from '@/types/user';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  KeyRound,
  Loader2,
  MapPin,
  Phone,
  Power,
  Search,
  Shield,
  UserCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import UserService from '@/libs/UserService';

export default function UsersPage() {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [activeFilter, setActiveFilter] = useState<boolean | 'ALL'>('ALL');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, _setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    roleBreakdown: {
      Customer: 0,
      Technician: 0,
      Admin: 0,
      Supporter: 0,
    },
  });

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  // Selected user
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  // Form states
  const [newStatus, setNewStatus] = useState(true);
  const [statusReason, setStatusReason] = useState('');
  const [verifyStatus, setVerifyStatus] = useState(true);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [resetReason, setResetReason] = useState('');
  const [generateTempPassword, setGenerateTempPassword] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  // Loading states
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Validation errors
  const [statusReasonError, setStatusReasonError] = useState(false);

  // Helper function to check if avatar URL is valid
  const isValidAvatarUrl = (url: string | null | undefined): boolean => {
    if (!url) {
      return false;
    }
    try {
      const urlObj = new URL(url);
      // Check if domain exists and is not cdn.ezyfix.site (which doesn't resolve)
      return !urlObj.hostname.includes('cdn.ezyfix.site');
    } catch {
      return false;
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params: GetUsersParams = {
        page: currentPage,
        pageSize: 20,
      };

      if (roleFilter !== 'ALL') {
        params.role = roleFilter;
      }
      if (activeFilter !== 'ALL') {
        params.isActive = activeFilter;
      }
      if (verifiedFilter !== 'ALL') {
        params.isVerified = verifiedFilter;
      }
      if (searchTerm.trim()) {
        params.searchKeyword = searchTerm.trim();
      }

      const response = await UserService.getAllUsers(params);
      setUsers(response.items);
      setTotalCount(response.pagination.totalItems);
      setSummary(response.summary);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchUsers when filters change
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, activeFilter, verifiedFilter, searchTerm, currentPage]);

  // Fetch user details
  const fetchUserDetails = async (userId: string) => {
    try {
      setIsLoadingDetails(true);
      const details = await UserService.getUserById(userId);
      setUserDetails(details);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Không thể tải thông tin chi tiết');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Handle view details
  const handleViewDetails = async (user: User) => {
    setSelectedUser(user);
    setUserDetails(null);
    setViewDetailsModal(true);
    await fetchUserDetails(user.userId);
  };

  // Handle update status
  const handleUpdateStatus = (user: User) => {
    setSelectedUser(user);
    setNewStatus(!user.isActive);
    setStatusReason('');
    setStatusReasonError(false);
    setStatusModal(true);
  };

  const submitUpdateStatus = async () => {
    if (!selectedUser || !statusReason.trim()) {
      setStatusReasonError(true);
      toast.error('Vui lòng nhập lý do');
      return;
    }

    setStatusReasonError(false);

    try {
      setIsUpdatingStatus(true);
      const request: UpdateStatusRequest = {
        isActive: newStatus,
        reason: statusReason.trim(),
        notifyUser: true,
      };

      await UserService.updateStatus(selectedUser.userId, request);
      toast.success(`Đã ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản thành công`);
      setStatusModal(false);
      setSelectedUser(null);
      setStatusReasonError(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle verify user
  const handleVerify = (user: User) => {
    setSelectedUser(user);
    setVerifyStatus(!user.isVerify);
    setVerifyNotes('');
    setVerifyModal(true);
  };

  const submitVerify = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setIsVerifying(true);
      const request: VerifyUserRequest = {
        isVerify: verifyStatus,
        notes: verifyNotes.trim() || undefined,
      };

      await UserService.verifyUser(selectedUser.userId, request);
      toast.success(`Đã ${verifyStatus ? 'xác thực' : 'hủy xác thực'} email thành công`);
      setVerifyModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Không thể cập nhật trạng thái xác thực');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle reset password
  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setResetReason('');
    setGenerateTempPassword(true);
    setSendEmail(true);
    setResetPasswordModal(true);
  };

  const submitResetPassword = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setIsResetting(true);
      const request: ResetPasswordRequest = {
        generateTemporaryPassword: generateTempPassword,
        sendEmail,
        reason: resetReason.trim() || undefined,
      };

      const response = await UserService.resetPassword(selectedUser.userId, request);
      if (!sendEmail && response.temporaryPassword) {
        toast.success(`Mật khẩu tạm: ${response.temporaryPassword}`, { duration: 10000 });
      } else {
        toast.success('Đã gửi email reset mật khẩu thành công');
      }
      setResetPasswordModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Không thể reset mật khẩu');
    } finally {
      setIsResetting(false);
    }
  };

  // Helper functions
  const getRoleBadgeColor = (role: UserRole): string => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Customer':
        return 'bg-blue-100 text-blue-800';
      case 'Technician':
        return 'bg-orange-100 text-orange-800';
      case 'Supporter':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4" />;
      case 'Customer':
        return <Users className="h-4 w-4" />;
      case 'Technician':
        return <Wrench className="h-4 w-4" />;
      case 'Supporter':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <p className="text-sm text-gray-600">Quản lý tất cả người dùng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Tổng người dùng</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{summary.totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Đang hoạt động</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{summary.activeUsers}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Khách hàng</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">{summary.roleBreakdown.Customer}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Thợ sửa chữa</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">{summary.roleBreakdown.Technician}</p>
            </div>
            <Wrench className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Supporter</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{summary.roleBreakdown.Supporter}</p>
            </div>
            <UserCheck className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Role Filter */}
          <div>
            <label htmlFor="role-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Lọc theo Role
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as UserRole | 'ALL')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả</option>
              <option value="Customer">Khách hàng</option>
              <option value="Technician">Thợ sửa chữa</option>
              <option value="Admin">Admin</option>
              <option value="Supporter">Supporter</option>
            </select>
          </div>

          {/* Active Filter */}
          <div>
            <label htmlFor="active-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="active-filter"
              value={activeFilter.toString()}
              onChange={e => setActiveFilter(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Bị khóa</option>
            </select>
          </div>

          {/* Verified Filter */}
          <div>
            <label htmlFor="verified-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Xác thực
            </label>
            <select
              id="verified-filter"
              value={verifiedFilter.toString()}
              onChange={e => setVerifiedFilter(e.target.value === 'ALL' ? 'ALL' : e.target.value === 'true')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả</option>
              <option value="true">Đã xác thực</option>
              <option value="false">Chưa xác thực</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Tên, email, SĐT..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          {isLoading
            ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )
            : users.length === 0
              ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                  </div>
                )
              : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Người dùng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Liên hệ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Role
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Xác thực
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Ngày tạo
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Profile
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map(user => (
                        <tr key={user.userId} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {user.avatarLink && isValidAvatarUrl(user.avatarLink)
                                  ? (
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={user.avatarLink}
                                        alt={user.fullName || 'User'}
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          target.style.display = 'none';
                                          const fallback = document.createElement('div');
                                          fallback.className = 'flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium';
                                          fallback.textContent = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';
                                          target.parentElement?.appendChild(fallback);
                                        }}
                                      />
                                    )
                                  : (
                                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                      </div>
                                    )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                              {getRoleIcon(user.role)}
                              <span>{user.role}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {user.isActive
                              ? (
                                  <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                                )
                              : (
                                  <AlertCircle className="mx-auto h-5 w-5 text-red-500" />
                                )}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {user.isVerify
                              ? (
                                  <UserCheck className="mx-auto h-5 w-5 text-blue-500" />
                                )
                              : (
                                  <X className="mx-auto h-5 w-5 text-gray-400" />
                                )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(user.createdDate).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.profileCompletion}
                              %
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleViewDetails(user)}
                                className="rounded p-1 text-blue-600 transition-colors hover:bg-blue-50"
                                title="Xem chi tiết"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              {!user.isVerify && (
                                <button
                                  type="button"
                                  onClick={() => handleVerify(user)}
                                  className="rounded p-1 text-purple-600 transition-colors hover:bg-purple-50"
                                  title="Xác thực email"
                                >
                                  <UserCheck className="h-5 w-5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleResetPassword(user)}
                                className="rounded p-1 text-indigo-600 transition-colors hover:bg-indigo-50"
                                title="Reset mật khẩu"
                              >
                                <KeyRound className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(user)}
                                className={`rounded p-1 transition-colors ${
                                  user.isActive
                                    ? 'text-red-600 hover:bg-red-50'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                              >
                                <Power className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
        </div>

        {/* Pagination */}
        {!isLoading && totalCount > 0 && (
          <div className="border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị
                {' '}
                <span className="font-medium">{users.length}</span>
                {' '}
                /
                {' '}
                <span className="font-medium">{totalCount}</span>
                {' '}
                người dùng
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewDetailsModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết người dùng</h2>
              <button
                type="button"
                onClick={() => {
                  setViewDetailsModal(false);
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {isLoadingDetails
                ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  )
                : userDetails
                  ? (
                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-center gap-3">
                              {userDetails.avatarLink && isValidAvatarUrl(userDetails.avatarLink)
                                ? (
                                    <img
                                      src={userDetails.avatarLink}
                                      alt={userDetails.fullName || 'User'}
                                      className="h-16 w-16 rounded-full object-cover"
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = 'none';
                                        const fallback = document.createElement('div');
                                        fallback.className = 'flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600';
                                        fallback.textContent = userDetails.fullName ? userDetails.fullName.charAt(0).toUpperCase() : 'U';
                                        target.parentElement?.appendChild(fallback);
                                      }}
                                    />
                                  )
                                : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                                      {userDetails.fullName ? userDetails.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                  )}
                              <div>
                                <p className="font-medium text-gray-900">{userDetails.fullName || 'N/A'}</p>
                                <p className="text-sm text-gray-500">{userDetails.email}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">SĐT:</span>
                                {' '}
                                <span className="text-gray-900">{userDetails.phone || 'N/A'}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Ngôn ngữ:</span>
                                {' '}
                                <span className="text-gray-900">{userDetails.accountStatus.preferredLanguage || 'N/A'}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Ngày tạo:</span>
                                {' '}
                                <span className="text-gray-900">
                                  {new Date(userDetails.accountStatus.createdDate).toLocaleDateString('vi-VN')}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Profile Info */}
                        {userDetails.role.roleName === 'Customer' && userDetails.customerProfile && (
                          <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Thông tin Khách hàng</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Điểm tích lũy:</span>
                                {' '}
                                <span className="text-gray-900">{userDetails.customerProfile.loyaltyPoints}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Yêu cầu dịch vụ:</span>
                                {' '}
                                <span className="text-gray-900">{userDetails.customerProfile.totalServiceRequests}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Tổng chi tiêu:</span>
                                {' '}
                                <span className="text-gray-900">{formatCurrency(userDetails.customerProfile.totalSpent)}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Đánh giá TB:</span>
                                {' '}
                                <span className="text-gray-900">
                                  {userDetails.customerProfile.averageRating.toFixed(1)}
                                  {' '}
                                  ⭐
                                </span>
                              </p>
                            </div>
                          </div>
                        )}

                        {userDetails.role.roleName === 'Technician' && userDetails.technicianProfile && (
                          <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Thông tin Thợ sửa chữa</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Kỹ năng:</span>
                                {' '}
                                <span className="text-gray-900">{userDetails.technicianProfile.skills.join(', ')}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Kinh nghiệm:</span>
                                {' '}
                                <span className="text-gray-900">
                                  {userDetails.technicianProfile.yearsOfExperience}
                                  {' '}
                                  năm
                                </span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Đánh giá:</span>
                                {' '}
                                <span className="text-gray-900">
                                  {userDetails.technicianProfile.averageRating.toFixed(1)}
                                  {' '}
                                  ⭐ (
                                  {userDetails.technicianProfile.totalReviews}
                                  {' '}
                                  đánh giá)
                                </span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Trạng thái:</span>
                                {' '}
                                <span className="text-gray-900">{userDetails.technicianProfile.availabilityStatus}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Tổng thu nhập:</span>
                                {' '}
                                <span className="text-gray-900">{formatCurrency(userDetails.technicianProfile.totalEarnings)}</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-medium text-gray-700">Số dư ví:</span>
                                {' '}
                                <span className="text-gray-900">{formatCurrency(userDetails.technicianProfile.walletBalance)}</span>
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Statistics */}
                        {userDetails.statistics && (
                          <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Thống kê</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              <div className="rounded-lg bg-blue-50 p-4 text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                  {userDetails.statistics.totalAppointments}
                                </p>
                                <p className="text-sm text-gray-600">Lịch hẹn</p>
                              </div>
                              <div className="rounded-lg bg-green-50 p-4 text-center">
                                <p className="text-2xl font-bold text-green-600">
                                  {userDetails.statistics.completedAppointments}
                                </p>
                                <p className="text-sm text-gray-600">Hoàn thành</p>
                              </div>
                              <div className="rounded-lg bg-orange-50 p-4 text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                  {formatCurrency(userDetails.statistics.totalPayments)}
                                </p>
                                <p className="text-sm text-gray-600">Tổng thanh toán</p>
                              </div>
                              <div className="rounded-lg bg-purple-50 p-4 text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                  {userDetails.statistics.totalReviews}
                                </p>
                                <p className="text-sm text-gray-600">Đánh giá</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Addresses */}
                        {userDetails.addresses && userDetails.addresses.length > 0 && (
                          <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Địa chỉ</h3>
                            <div className="space-y-3">
                              {userDetails.addresses.map((address, idx) => (
                                <div key={address.addressId || idx} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{address.street}</p>
                                    <p className="text-sm text-gray-600">
                                      {address.city}
                                      ,
                                      {address.province}
                                      {' '}
                                      {address.postalCode}
                                    </p>
                                    {address.isPrimary && (
                                      <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                        Chính
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Emergency Contact */}
                        {userDetails.emergencyContacts && userDetails.emergencyContacts.length > 0 && (
                          <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Liên hệ khẩn cấp</h3>
                            <div className="space-y-3">
                              {userDetails.emergencyContacts.map((contact, idx) => (
                                <div key={contact.contactId || idx} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                                  <div>
                                    <p className="font-medium text-gray-900">{contact.contactName}</p>
                                    <p className="text-sm text-gray-600">{contact.phone}</p>
                                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  : (
                      <p className="text-center text-gray-500">Không thể tải thông tin chi tiết</p>
                    )}
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {newStatus ? 'Kích hoạt' : 'Vô hiệu hóa'}
                {' '}
                tài khoản
              </h2>
              <button
                type="button"
                onClick={() => {
                  setStatusModal(false);
                  setSelectedUser(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Bạn có chắc muốn
                {' '}
                {newStatus ? 'kích hoạt' : 'vô hiệu hóa'}
                {' '}
                tài khoản
                {' '}
                <span className="font-medium">{selectedUser.fullName}</span>
                ?
              </p>
              <div className="mb-4">
                <label htmlFor="status-reason" className="mb-2 block text-sm font-medium text-gray-700">Lý do *</label>
                <textarea
                  id="status-reason"
                  value={statusReason}
                  onChange={(e) => {
                    setStatusReason(e.target.value);
                    if (e.target.value.trim()) {
                      setStatusReasonError(false);
                    }
                  }}
                  rows={3}
                  className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                    statusReasonError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Nhập lý do..."
                />
                {statusReasonError && (
                  <p className="mt-1 text-sm text-red-600">Vui lòng nhập lý do</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatusModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={submitUpdateStatus}
                  disabled={isUpdatingStatus}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdatingStatus
                    ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      )
                    : (
                        'Xác nhận'
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {verifyModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800">Xác thực Email</h2>
              <button
                type="button"
                onClick={() => {
                  setVerifyModal(false);
                  setSelectedUser(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Xác thực email thủ công cho
                {' '}
                <span className="font-medium">{selectedUser.fullName}</span>
              </p>
              <div className="mb-4">
                <label htmlFor="verify-notes" className="mb-2 block text-sm font-medium text-gray-700">Ghi chú</label>
                <textarea
                  id="verify-notes"
                  value={verifyNotes}
                  onChange={e => setVerifyNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ghi chú (không bắt buộc)..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setVerifyModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={submitVerify}
                  disabled={isVerifying}
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                >
                  {isVerifying
                    ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      )
                    : (
                        'Xác thực'
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-800">Reset Mật khẩu</h2>
              <button
                type="button"
                onClick={() => {
                  setResetPasswordModal(false);
                  setSelectedUser(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4 text-gray-600">
                Reset mật khẩu cho
                {' '}
                <span className="font-medium">{selectedUser.fullName}</span>
              </p>

              <div className="mb-4 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong>
                  {' '}
                  Người dùng sẽ bị buộc đổi mật khẩu khi đăng nhập lần tiếp theo.
                </p>
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="generate-temp-password"
                    checked={generateTempPassword}
                    onChange={e => setGenerateTempPassword(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="generate-temp-password" className="flex-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Tạo mật khẩu tạm thời</span>
                    <p className="text-xs text-gray-500">
                      Tự động tạo mật khẩu ngẫu nhiên (12 ký tự) và gửi cho người dùng. Nếu bỏ chọn, chỉ gửi link reset password.
                    </p>
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="send-email-reset"
                    checked={sendEmail}
                    onChange={e => setSendEmail(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="send-email-reset" className="flex-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">Gửi email cho người dùng</span>
                    <p className="text-xs text-gray-500">
                      {generateTempPassword
                        ? 'Gửi email kèm mật khẩu tạm thời. Nếu bỏ chọn, mật khẩu sẽ hiển thị trên màn hình.'
                        : 'Gửi email kèm link reset password (valid 24h).'}
                    </p>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="reset-reason" className="mb-2 block text-sm font-medium text-gray-700">Lý do (không bắt buộc)</label>
                <textarea
                  id="reset-reason"
                  value={resetReason}
                  onChange={e => setResetReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="VD: Hoạt động đáng ngờ, người dùng yêu cầu..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={submitResetPassword}
                  disabled={isResetting}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isResetting
                    ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                      )
                    : (
                        'Reset'
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
