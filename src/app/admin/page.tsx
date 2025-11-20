'use client';

import type {
  CommissionReportData,
  RevenueByServiceData,
  RevenueByTechnicianData,
  RevenueOverviewData,
  TransactionItem,
  TransactionsData,
} from '@/types/analytics';
import {
  ArrowUpRight,
  DollarSign,
  Loader2,
  Percent,
  Receipt,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';

import RevenueAnalyticsService from '@/libs/RevenueAnalyticsService';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'thisMonth' | 'lastMonth' | 'thisYear'>('30days');
  const [isLoading, setIsLoading] = useState(true);

  // State cho các API data
  const [revenueOverview, setRevenueOverview] = useState<RevenueOverviewData | null>(null);
  const [revenueByService, setRevenueByService] = useState<RevenueByServiceData | null>(null);
  const [topTechnicians, setTopTechnicians] = useState<RevenueByTechnicianData | null>(null);
  const [transactions, setTransactions] = useState<TransactionsData | null>(null);
  const [commissionReport, setCommissionReport] = useState<CommissionReportData | null>(null);

  // Fetch data từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const dateParams = RevenueAnalyticsService.getDateRange(dateRange);

        // Parallel fetch all analytics data (5 APIs)
        const [overviewRes, serviceRes, technicianRes, transactionsRes, commissionRes] = await Promise.all([
          RevenueAnalyticsService.getRevenueOverview({
            ...dateParams,
            groupBy: 'day',
          }),
          RevenueAnalyticsService.getRevenueByService({
            ...dateParams,
            top: 5,
          }),
          RevenueAnalyticsService.getRevenueByTechnician({
            ...dateParams,
            sortBy: 'revenue',
            order: 'desc',
            top: 5,
          }),
          RevenueAnalyticsService.getTransactions({
            fromDate: dateParams.fromDate,
            toDate: dateParams.toDate,
            page: 1,
            pageSize: 10,
          }),
          RevenueAnalyticsService.getCommissionReport({
            ...dateParams,
            groupBy: 'service',
          }),
        ]);

        if (overviewRes.is_success) {
          setRevenueOverview(overviewRes.data);
        } else {
          toast.error('Không thể tải dữ liệu tổng quan doanh thu');
        }

        if (serviceRes.is_success) {
          setRevenueByService(serviceRes.data);
        } else {
          toast.error('Không thể tải dữ liệu doanh thu theo dịch vụ');
        }

        if (technicianRes.is_success) {
          setTopTechnicians(technicianRes.data);
        } else {
          toast.error('Không thể tải dữ liệu thợ xuất sắc');
        }

        if (transactionsRes.is_success) {
          setTransactions(transactionsRes.data);
        } else {
          console.error('❌ Transactions API failed:', transactionsRes);
          toast.error('Không thể tải dữ liệu giao dịch');
        }

        if (commissionRes.is_success) {
          setCommissionReport(commissionRes.data);
        } else {
          toast.error('Không thể tải báo cáo hoa hồng');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange]);

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

  // Format date for breakdown chart
  const formatBreakdownDate = (dateStr: string | null) => {
    if (!dateStr) {
      return '';
    }
    try {
      const date = new Date(dateStr);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } catch {
      return dateStr;
    }
  };

  // Loading state
  if (isLoading || !revenueOverview) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare payment method pie chart data (nếu có)
  const paymentMethodData = revenueOverview.paymentMethods
    ? [
        {
          name: 'Online',
          value: revenueOverview.paymentMethods.ONLINE?.total || 0,
          count: revenueOverview.paymentMethods.ONLINE?.count || 0,
          percentage: revenueOverview.paymentMethods.ONLINE?.percentage || 0,
          color: '#3B82F6',
        },
        {
          name: 'Tiền mặt',
          value: revenueOverview.paymentMethods.CASH?.total || 0,
          count: revenueOverview.paymentMethods.CASH?.count || 0,
          percentage: revenueOverview.paymentMethods.CASH?.percentage || 0,
          color: '#10B981',
        },
      ]
    : [];

  // Prepare breakdown data with formatted dates
  const breakdownData = revenueOverview.breakdown.map(item => ({
    ...item,
    date: formatBreakdownDate(item.date),
  }));

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
            onChange={e => setDateRange(e.target.value as typeof dateRange)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="thisMonth">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
            <option value="thisYear">Năm nay</option>
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
            <AreaChart data={breakdownData}>
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
          {paymentMethodData.length > 0
            ? (
                <>
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
                </>
              )
            : (
                <div className="flex h-[250px] items-center justify-center text-gray-400">
                  <p>Chưa có dữ liệu phương thức thanh toán</p>
                </div>
              )}
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
        {revenueByService && revenueByService.services.length > 0
          ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByService.services}>
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
            )
          : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                <p>Chưa có dữ liệu doanh thu theo dịch vụ</p>
              </div>
            )}
      </div>

      {/* Top Technicians Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Top thợ xuất sắc</h3>
          <p className="text-sm text-gray-500">Thợ có thu nhập cao nhất trong kỳ</p>
        </div>
        <div className="overflow-x-auto">
          {topTechnicians && topTechnicians.technicians.length > 0
            ? (
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
                    {topTechnicians.technicians.map(tech => (
                      <tr key={tech.technicianId} className="transition-colors hover:bg-gray-50">
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
                              {(tech.lastName || tech.firstName || 'U').charAt(0)}
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
              )
            : (
                <div className="flex h-[200px] items-center justify-center text-gray-400">
                  <p>Chưa có dữ liệu thợ trong kỳ</p>
                </div>
              )}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
          <p className="text-sm text-gray-500">
            {transactions?.pagination.totalItems || 0}
            {' '}
            giao dịch trong kỳ
          </p>
        </div>
        <div className="overflow-x-auto">
          {transactions && transactions.items.length > 0
            ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Mã giao dịch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Dịch vụ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Thợ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Hoa hồng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Thanh toán
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {transactions.items.map((txn: TransactionItem) => (
                      <tr key={txn.transactionId} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm whitespace-nowrap text-blue-600">
                          #
                          {txn.transactionId.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{txn.type || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{txn.from?.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{txn.to?.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-orange-600">
                          {formatCurrency(txn.commissionAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {txn.paymentMethod === 'CASH' && 'Tiền mặt'}
                            {txn.paymentMethod === 'ONLINE' && 'Online'}
                            {(!txn.paymentMethod || txn.paymentMethod === 'WALLET') && 'Ví'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              txn.status?.toUpperCase() === 'COMPLETE'
                                ? 'bg-green-100 text-green-800'
                                : txn.status?.toUpperCase() === 'PENDING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : txn.status?.toUpperCase() === 'FAILED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {txn.status?.toUpperCase() === 'COMPLETE' && 'Hoàn thành'}
                            {txn.status?.toUpperCase() === 'PENDING' && 'Đang chờ'}
                            {txn.status?.toUpperCase() === 'FAILED' && 'Thất bại'}
                            {!txn.status && 'Không rõ'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                          {new Date(txn.createdDate).toLocaleString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            : (
                <div className="flex h-[200px] items-center justify-center text-gray-400">
                  <p>Chưa có giao dịch nào trong kỳ</p>
                </div>
              )}
        </div>
      </div>

      {/* Commission Report */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900">Báo cáo hoa hồng</h3>
          <p className="text-sm text-gray-500">Phân tích hoa hồng theo dịch vụ</p>
        </div>

        {commissionReport
          ? (
              <div className="p-6">
                {/* Summary Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <div className="text-sm font-medium text-blue-600">Tổng doanh thu</div>
                    <div className="mt-1 text-2xl font-bold text-blue-900">
                      {formatCurrency(commissionReport.summary.totalRevenue)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                    <div className="text-sm font-medium text-orange-600">Tổng hoa hồng</div>
                    <div className="mt-1 text-2xl font-bold text-orange-900">
                      {formatCurrency(commissionReport.summary.totalCommission)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
                    <div className="text-sm font-medium text-green-600">Thu nhập ròng</div>
                    <div className="mt-1 text-2xl font-bold text-green-900">
                      {formatCurrency(commissionReport.summary.totalRevenue - commissionReport.summary.totalCommission)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                    <div className="text-sm font-medium text-purple-600">Tỷ lệ hoa hồng TB</div>
                    <div className="mt-1 text-2xl font-bold text-purple-900">
                      {formatPercentage(commissionReport.summary.averageCommissionRate)}
                    </div>
                  </div>
                </div>

                {/* Breakdown Table */}
                <div className="overflow-x-auto">
                  {commissionReport.breakdown.length > 0
                    ? (
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Dịch vụ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Doanh thu
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Hoa hồng
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Thu nhập thợ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Tỷ lệ hoa hồng
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                Số giao dịch
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {commissionReport.breakdown.map(item => (
                              <tr key={`${item.serviceId || item.technicianId || ''}-${item.date || 'total'}`} className="transition-colors hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-gray-900">{item.serviceName || item.technicianName || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                  {formatCurrency(item.totalRevenue)}
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-orange-600">
                                  {formatCurrency(item.commissionCollected)}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-green-600">
                                  {formatCurrency(item.totalRevenue - item.commissionCollected)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                                        style={{ width: `${item.commissionRate * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {formatPercentage(item.commissionRate)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                  {formatNumber(item.transactions)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    : (
                        <div className="flex h-[200px] items-center justify-center text-gray-400">
                          <p>Chưa có dữ liệu hoa hồng</p>
                        </div>
                      )}
                </div>
              </div>
            )
          : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                <p>Chưa có dữ liệu báo cáo hoa hồng</p>
              </div>
            )}
      </div>
    </div>
  );
}
