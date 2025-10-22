'use client';

import { mockActivityLogs } from '@/libs/admin-data';

export default function LogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lịch sử hoạt động</h2>
          <p className="mt-1 text-sm text-gray-600">
            Theo dõi các hoạt động của admin
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Hành động
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Loại
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Thay đổi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockActivityLogs.map(log => (
                <tr key={log.LogID} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(log.LoggedAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{log.UserName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.Action}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      {log.EntityType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {log.OldValue && (
                      <span className="text-red-600">
                        {log.OldValue}
                        {' '}
                        →
                        {' '}
                      </span>
                    )}
                    <span className="font-medium text-green-600">{log.NewValue}</span>
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
