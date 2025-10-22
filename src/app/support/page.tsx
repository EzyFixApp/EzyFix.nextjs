'use client';

import {
  AlertTriangle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  mockActivityLogs,
  mockDisputes,
  mockSupportConversations,
} from '@/libs/admin-data';

export default function SupportPage() {
  const openDisputes = mockDisputes.filter(d => d.Status === 'Open').length;
  const inProgressDisputes = mockDisputes.filter(d => d.Status === 'InProgress').length;
  const resolvedDisputes = mockDisputes.filter(d => d.Status === 'Resolved').length;
  const waitingConversations = mockSupportConversations.filter(c => c.Status === 'Waiting').length;
  const totalActivities = mockActivityLogs.length;

  // Chart data
  const disputeTrendData = [
    { day: 'T2', count: 3 },
    { day: 'T3', count: 5 },
    { day: 'T4', count: 2 },
    { day: 'T5', count: 4 },
    { day: 'T6', count: 6 },
    { day: 'T7', count: 3 },
    { day: 'CN', count: openDisputes },
  ];

  const statusDistribution = [
    { name: 'Chưa giải quyết', value: openDisputes, color: '#ef4444' },
    { name: 'Đang giải quyết', value: inProgressDisputes, color: '#3b82f6' },
    { name: 'Đã giải quyết', value: resolvedDisputes, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Hỗ trợ</h2>
          <p className="mt-1 text-sm text-gray-600">
            Tổng quan các vấn đề cần xử lý
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
            {openDisputes}
            {' '}
            tranh chấp mới
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tranh chấp mới</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{openDisputes}</p>
              <p className="mt-2 text-xs text-gray-500">Cần xử lý ngay</p>
            </div>
            <div className="rounded-full bg-red-50 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 to-red-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chat đang chờ</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{waitingConversations}</p>
              <p className="mt-2 text-xs text-gray-500">Chưa trả lời</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng hoạt động</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalActivities}</p>
              <p className="mt-2 text-xs text-gray-500">Hôm nay</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Dispute Trend */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Xu hướng tranh chấp (7 ngày)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={disputeTrendData}>
              <defs>
                <linearGradient id="colorDispute" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDispute)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Phân bổ trạng thái</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const percent = props.percent || 0;
                  const name = props.name || '';
                  return `${name}: ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map(entry => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
