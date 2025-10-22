'use client';

import {
  Activity,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  dashboardStats,
  revenueChartData,
  serviceDemandData,
  technicianPerformanceData,
} from '@/libs/admin-data';

export default function AdminDashboard() {
  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  // Format number
  const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Prepare data for pie chart
  const userDistribution = [
    { name: 'Khách hàng', value: dashboardStats.totalCustomers, color: '#3B82F6' },
    { name: 'Thợ', value: dashboardStats.totalTechnicians, color: '#10B981' },
    { name: 'Hỗ trợ', value: dashboardStats.totalSupportStaff, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng quan hoạt động hệ thống EzyFix
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Calendar className="h-4 w-4" />
          Hôm nay
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-blue-100 p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              <ArrowUpRight className="h-3 w-3" />
              12.5%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatCurrency(dashboardStats.totalRevenue)}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Tháng này:
              {' '}
              {formatCurrency(dashboardStats.monthlyRevenue)}
            </p>
          </div>
        </div>

        {/* Total Users */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              <ArrowUpRight className="h-3 w-3" />
              8.2%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Người dùng</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatNumber(dashboardStats.totalUsers)}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {dashboardStats.totalCustomers}
              {' '}
              khách,
              {' '}
              {dashboardStats.totalTechnicians}
              {' '}
              thợ
            </p>
          </div>
        </div>

        {/* Active Appointments */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-orange-100 p-3">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
              <TrendingUp className="h-3 w-3" />
              Live
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Công việc đang hoạt động</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatNumber(dashboardStats.activeAppointments)}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {formatNumber(dashboardStats.completedAppointments)}
              {' '}
              đã hoàn thành
            </p>
          </div>
        </div>

        {/* Average Rating */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-lg bg-purple-100 p-3">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
              <Star className="h-3 w-3 fill-purple-700" />
              {dashboardStats.averageRating}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {dashboardStats.averageRating}
              /5.0
            </p>
            <p className="mt-2 text-xs text-gray-500">Từ khách hàng</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu 7 ngày qua</h3>
              <p className="text-sm text-gray-500">Biểu đồ xu hướng doanh thu</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <TrendingUp className="h-4 w-4" />
              +15.3%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={value => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution Pie Chart */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phân bố người dùng</h3>
            <p className="text-sm text-gray-500">Theo vai trò</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {userDistribution.map(entry => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [formatNumber(value), 'Số lượng']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {userDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{formatNumber(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Demand Chart */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dịch vụ phổ biến</h3>
            <p className="text-sm text-gray-500">Top dịch vụ được yêu cầu nhiều nhất</p>
          </div>
          <Wrench className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serviceDemandData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="serviceName" stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'requestCount') {
                  return [formatNumber(value), 'Yêu cầu'];
                }
                return [value, name];
              }}
            />
            <Legend
              formatter={(value) => {
                if (value === 'requestCount') {
                  return 'Số yêu cầu';
                }
                return value;
              }}
            />
            <Bar dataKey="requestCount" fill="#3B82F6" radius={[8, 8, 0, 0]}>
              {serviceDemandData.map((entry, index) => (
                <Cell key={entry.serviceName} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Technician Performance */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Thợ xuất sắc</h3>
          <p className="text-sm text-gray-500">Top thợ có hiệu suất cao nhất</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Công việc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thu nhập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Hiệu suất
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {technicianPerformanceData.map((tech, index) => {
                const performancePercent = (tech.completedJobs / tech.totalJobs) * 100;
                return (
                  <tr key={tech.technicianID} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                          {tech.technicianName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{tech.technicianName}</div>
                          <div className="text-xs text-gray-500">{tech.specialty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatNumber(tech.completedJobs)}</div>
                      <div className="text-xs text-gray-500">
                        /
                        {tech.totalJobs}
                        {' '}
                        tổng
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {formatCurrency(tech.earnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{tech.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: `${performancePercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {performancePercent.toFixed(0)}
                          %
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
