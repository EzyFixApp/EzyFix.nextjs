'use client';

import {
  CheckCircle,
  Mail,
  Phone,
  Search,
  Shield,
  Star,
  User,
  UserCog,
  UserPlus,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { mockCustomers, mockTechnicians, mockUsers } from '@/libs/admin-data';

type TabType = 'all' | 'customers' | 'technicians' | 'support';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allUsers = [...mockUsers];
  const customers = mockCustomers;
  const technicians = mockTechnicians;
  const supportStaff = mockUsers.filter(u => u.RoleName === 'Support');

  const getDisplayUsers = () => {
    switch (activeTab) {
      case 'customers':
        return customers;
      case 'technicians':
        return technicians;
      case 'support':
        return supportStaff;
      default:
        return allUsers;
    }
  };

  const filteredUsers = getDisplayUsers().filter(
    user =>
      `${user.FirstName} ${user.LastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      || user.Email.toLowerCase().includes(searchTerm.toLowerCase())
      || user.Phone.includes(searchTerm),
  );

  const tabs = [
    { id: 'all' as const, label: 'Tất cả', count: allUsers.length, icon: Users, color: 'blue' },
    {
      id: 'customers' as const,
      label: 'Khách hàng',
      count: customers.length,
      icon: User,
      color: 'green',
    },
    {
      id: 'technicians' as const,
      label: 'Thợ sửa',
      count: technicians.length,
      icon: Wrench,
      color: 'orange',
    },
    {
      id: 'support' as const,
      label: 'Hỗ trợ',
      count: supportStaff.length,
      icon: UserCog,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý khách hàng, thợ sửa chữa và nhân viên hỗ trợ
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          <UserPlus className="h-4 w-4" />
          Thêm người dùng
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group relative overflow-hidden rounded-xl border p-6 text-left transition-all ${
                activeTab === tab.id
                  ? 'border-blue-200 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'}`}
                  >
                    {tab.label}
                  </p>
                  <p
                    className={`mt-1 text-2xl font-bold ${activeTab === tab.id ? 'text-blue-700' : 'text-gray-900'}`}
                  >
                    {tab.count}
                  </p>
                </div>
                <div
                  className={`rounded-full p-3 ${activeTab === tab.id ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  <Icon
                    className={`h-6 w-6 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'}`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vai trò</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Trạng thái
                </th>
                {activeTab === 'technicians' && (
                  <>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Đánh giá
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Công việc
                    </th>
                  </>
                )}
                {activeTab === 'customers' && (
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Điểm tích lũy
                  </th>
                )}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.UserID} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
                        {user.FirstName[0]}
                        {user.LastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.FirstName}
                          {' '}
                          {user.LastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID:
                          {user.UserID.slice(0, 8)}
                          ...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {user.Email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {user.Phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        user.RoleName === 'Admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.RoleName === 'Technician'
                            ? 'bg-orange-100 text-orange-700'
                            : user.RoleName === 'Customer'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {user.RoleName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.IsActive
                      ? (
                          <div className="flex items-center gap-1.5 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Hoạt động</span>
                          </div>
                        )
                      : (
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Tạm khóa</span>
                          </div>
                        )}
                  </td>
                  {activeTab === 'technicians'
                    && 'Rating' in user
                    && typeof user.Rating === 'number' && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-gray-900">{user.Rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {(user as any).TotalJobs || 0}
                          {' '}
                          công việc
                        </span>
                      </td>
                    </>
                  )}
                  {activeTab === 'customers'
                    && 'LoyaltyPoints' in user
                    && typeof user.LoyaltyPoints === 'number' && (
                    <td className="px-6 py-4">
                      <span className="font-medium text-blue-600">
                        {user.LoyaltyPoints}
                        {' '}
                        điểm
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        title="Xem chi tiết"
                      >
                        Chi tiết
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        title="Chỉnh sửa"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          user.IsActive
                            ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                            : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                        title={user.IsActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {user.IsActive ? 'Khóa' : 'Mở'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Không tìm thấy người dùng</h3>
          <p className="mt-2 text-sm text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );
}
