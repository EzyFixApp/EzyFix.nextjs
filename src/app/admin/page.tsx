'use client';

import {
  ArrowUpRight,
  DollarSign,
  Percent,
  Receipt,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
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

// Mock data theo Revenue Analytics API structure
const revenueOverview = {
  summary: {
    totalRevenue: 25000000.0,
    totalCommission: 3750000.0,
    totalPayouts: 21250000.0,
    totalTransactions: 45,
    completedAppointments: 40,
    averageOrderValue: 625000.0,
    commissionRate: 0.15,
  },
  comparison: {
    previousPeriodRevenue: 20000000.0,
    revenueGrowth: 0.25,
    previousPeriodTransactions: 35,
    transactionGrowth: 0.286,
  },
  breakdown: [
    { date: '11/11', revenue: 1200000, commission: 180000, payouts: 1020000, transactions: 2 },
    { date: '12/11', revenue: 1500000, commission: 225000, payouts: 1275000, transactions: 3 },
    { date: '13/11', revenue: 1800000, commission: 270000, payouts: 1530000, transactions: 4 },
    { date: '14/11', revenue: 2200000, commission: 330000, payouts: 1870000, transactions: 5 },
    { date: '15/11', revenue: 1900000, commission: 285000, payouts: 1615000, transactions: 4 },
    { date: '16/11', revenue: 2400000, commission: 360000, payouts: 2040000, transactions: 6 },
    { date: '17/11', revenue: 2100000, commission: 315000, payouts: 1785000, transactions: 5 },
  ],
  paymentMethods: {
    ONLINE: { count: 30, total: 18000000.0, percentage: 0.72 },
    CASH: { count: 15, total: 7000000.0, percentage: 0.28 },
  },
};

const revenueByService = [
  {
    serviceName: 'Sửa điều hòa',
    categoryName: 'Điện lạnh',
    totalRevenue: 8500000.0,
    totalCommission: 1275000.0,
    totalTransactions: 15,
    percentageOfTotal: 0.34,
    growth: 0.2,
  },
  {
    serviceName: 'Sửa tủ lạnh',
    categoryName: 'Điện lạnh',
    totalRevenue: 6000000.0,
    totalCommission: 900000.0,
    totalTransactions: 12,
    percentageOfTotal: 0.24,
    growth: 0.15,
  },
  {
    serviceName: 'Sửa máy giặt',
    categoryName: 'Gia dụng',
    totalRevenue: 4500000.0,
    totalCommission: 675000.0,
    totalTransactions: 10,
    percentageOfTotal: 0.18,
    growth: 0.1,
  },
  {
    serviceName: 'Sửa TV',
    categoryName: 'Điện tử',
    totalRevenue: 3500000.0,
    totalCommission: 525000.0,
    totalTransactions: 5,
    percentageOfTotal: 0.14,
    growth: -0.05,
  },
  {
    serviceName: 'Sửa bình nóng lạnh',
    categoryName: 'Gia dụng',
    totalRevenue: 2500000.0,
    totalCommission: 375000.0,
    totalTransactions: 3,
    percentageOfTotal: 0.1,
    growth: 0.08,
  },
];

const topTechnicians = [
  {
    firstName: 'Trần',
    lastName: 'Văn B',
    statistics: {
      totalEarnings: 5500000.0,
      platformCommission: 825000.0,
      netEarnings: 4675000.0,
      totalJobs: 12,
      completedJobs: 11,
      averageJobValue: 500000.0,
      averageRating: 4.8,
    },
    performance: {
      completionRate: 0.917,
      rank: 1,
    },
  },
  {
    firstName: 'Nguyễn',
    lastName: 'Văn C',
    statistics: {
      totalEarnings: 4800000.0,
      platformCommission: 720000.0,
      netEarnings: 4080000.0,
      totalJobs: 10,
      completedJobs: 9,
      averageJobValue: 533333.33,
      averageRating: 4.7,
    },
    performance: {
      completionRate: 0.9,
      rank: 2,
    },
  },
  {
    firstName: 'Lê',
    lastName: 'Thị D',
    statistics: {
      totalEarnings: 4200000.0,
      platformCommission: 630000.0,
      netEarnings: 3570000.0,
      totalJobs: 9,
      completedJobs: 8,
      averageJobValue: 525000.0,
      averageRating: 4.9,
    },
    performance: {
      completionRate: 0.889,
      rank: 3,
    },
  },
  {
    firstName: 'Phạm',
    lastName: 'Văn E',
    statistics: {
      totalEarnings: 3900000.0,
      platformCommission: 585000.0,
      netEarnings: 3315000.0,
      totalJobs: 8,
      completedJobs: 7,
      averageJobValue: 557142.86,
      averageRating: 4.6,
    },
    performance: {
      completionRate: 0.875,
      rank: 4,
    },
  },
  {
    firstName: 'Hoàng',
    lastName: 'Văn F',
    statistics: {
      totalEarnings: 3600000.0,
      platformCommission: 540000.0,
      netEarnings: 3060000.0,
      totalJobs: 7,
      completedJobs: 6,
      averageJobValue: 600000.0,
      averageRating: 4.5,
    },
    performance: {
      completionRate: 0.857,
      rank: 5,
    },
  },
];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7days');

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  // Format number
  const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  // Format percentage
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  // Prepare payment method pie chart data
  const paymentMethodData = [
    {
      name: 'Online',
      value: revenueOverview.paymentMethods.ONLINE.total,
      count: revenueOverview.paymentMethods.ONLINE.count,
      percentage: revenueOverview.paymentMethods.ONLINE.percentage,
      color: '#3B82F6',
    },
    {
      name: 'Tiền mặt',
      value: revenueOverview.paymentMethods.CASH.total,
      count: revenueOverview.paymentMethods.CASH.count,
      percentage: revenueOverview.paymentMethods.CASH.percentage,
      color: '#10B981',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Tổng quan doanh thu và hoạt động hệ thống
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="thisMonth">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
          </select>
        </div>
      </div>

      {/* Main Stats Grid - 4 cards theo Revenue Analytics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(revenueOverview.summary.totalRevenue)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {formatNumber(revenueOverview.summary.completedAppointments)}
                {' '}
                đơn hoàn thành
              </p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">
              {formatPercentage(revenueOverview.comparison.revenueGrowth)}
            </span>
            <span className="text-gray-500">so với kỳ trước</span>
          </div>
        </div>

        {/* Total Commission */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hoa hồng đã thu</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(revenueOverview.summary.totalCommission)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {formatPercentage(revenueOverview.summary.commissionRate)}
                {' '}
                trung bình
              </p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="font-medium text-gray-700">
              {formatCurrency(revenueOverview.summary.totalPayouts)}
            </span>
            <span className="text-gray-500">đã trả thợ</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Số giao dịch</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatNumber(revenueOverview.summary.totalTransactions)}
              </p>
              <p className="mt-2 text-sm text-gray-500">Giao dịch hoàn thành</p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600" />
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">
              {formatPercentage(revenueOverview.comparison.transactionGrowth)}
            </span>
            <span className="text-gray-500">so với kỳ trước</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá trị TB/đơn</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(revenueOverview.summary.averageOrderValue)}
              </p>
              <p className="mt-2 text-sm text-gray-500">Trung bình mỗi đơn</p>
            </div>
            <div className="rounded-full bg-orange-50 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600" />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Breakdown Chart - Takes 2 columns */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Xu hướng doanh thu</h3>
              <p className="text-sm text-gray-500">Doanh thu và hoa hồng 7 ngày qua</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              <TrendingUp className="h-4 w-4" />
              +
              {formatPercentage(revenueOverview.comparison.revenueGrowth)}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueOverview.breakdown}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={value => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    revenue: 'Doanh thu',
                    commission: 'Hoa hồng',
                    payouts: 'Trả thợ',
                  };
                  return [formatCurrency(value), labels[name] || name];
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    revenue: 'Doanh thu',
                    commission: 'Hoa hồng',
                  };
                  return labels[value] || value;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="commission"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorCommission)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods Distribution */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h3>
            <p className="text-sm text-gray-500">Phân bố theo loại</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentMethodData.map(entry => (
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
                formatter={(value: number) => [formatCurrency(value), 'Tổng tiền']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-3">
            {paymentMethodData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.count}
                    {' '}
                    giao dịch (
                    {formatPercentage(item.percentage)}
                    )
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Revenue Chart */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo dịch vụ</h3>
            <p className="text-sm text-gray-500">Top 5 dịch vụ có doanh thu cao nhất</p>
          </div>
          <Wrench className="h-5 w-5 text-gray-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueByService}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="serviceName" stroke="#6B7280" fontSize={12} />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={value => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  totalRevenue: 'Doanh thu',
                  totalCommission: 'Hoa hồng',
                };
                return [formatCurrency(value), labels[name] || name];
              }}
            />
            <Legend
              formatter={(value) => {
                const labels: Record<string, string> = {
                  totalRevenue: 'Doanh thu',
                  totalCommission: 'Hoa hồng',
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="totalCommission" fill="#10B981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="totalRevenue" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Technicians Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Top thợ xuất sắc</h3>
          <p className="text-sm text-gray-500">Thợ có thu nhập cao nhất trong kỳ</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Xếp hạng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Tổng thu nhập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Hoa hồng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thu nhập ròng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Công việc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Tỷ lệ hoàn thành
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {topTechnicians.map(tech => (
                <tr key={`${tech.lastName}-${tech.firstName}`} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex h-8 w-8 items-center justify-between rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                      <span className="w-full text-center">
                        #
                        {tech.performance.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-400 text-sm font-bold text-white">
                        {tech.lastName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {tech.lastName}
                          {' '}
                          {tech.firstName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {tech.statistics.completedJobs}
                          /
                          {tech.statistics.totalJobs}
                          {' '}
                          việc
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    {formatCurrency(tech.statistics.totalEarnings)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-red-600">
                    <span>
                      -
                      {formatCurrency(tech.statistics.platformCommission)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-green-600">
                    {formatCurrency(tech.statistics.netEarnings)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {formatCurrency(tech.statistics.averageJobValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-medium text-gray-900">
                        {tech.statistics.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${tech.performance.completionRate * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPercentage(tech.performance.completionRate)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
