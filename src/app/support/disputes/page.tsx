'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { mockDisputes } from '@/libs/admin-data';

export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredDisputes = statusFilter === 'All'
    ? mockDisputes
    : mockDisputes.filter(d => d.Status === statusFilter);

  const statusCounts = {
    All: mockDisputes.length,
    Open: mockDisputes.filter(d => d.Status === 'Open').length,
    InProgress: mockDisputes.filter(d => d.Status === 'InProgress').length,
    Resolved: mockDisputes.filter(d => d.Status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý tranh chấp</h2>
          <p className="mt-1 text-sm text-gray-600">
            Xử lý các tranh chấp giữa khách hàng và thợ
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(['All', 'Open', 'InProgress', 'Resolved'] as const).map(status => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'All' && `Tất cả (${statusCounts.All})`}
            {status === 'Open' && `Chưa giải quyết (${statusCounts.Open})`}
            {status === 'InProgress' && `Đang giải quyết (${statusCounts.InProgress})`}
            {status === 'Resolved' && `Đã giải quyết (${statusCounts.Resolved})`}
          </button>
        ))}
      </div>

      {/* Disputes List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDisputes.map(dispute => (
          <div
            key={dispute.DisputeID}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            {/* Header */}
            <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {dispute.AppointmentDetails?.ServiceName}
                    </h3>
                    {dispute.Status === 'Open'
                      ? (
                          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            Chưa xử lý
                          </span>
                        )
                      : dispute.Status === 'InProgress'
                        ? (
                            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              <Clock className="h-3 w-3" />
                              Đang xử lý
                            </span>
                          )
                        : dispute.Status === 'Resolved'
                          ? (
                              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                <CheckCircle className="h-3 w-3" />
                                Đã xong
                              </span>
                            )
                          : (
                              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                <XCircle className="h-3 w-3" />
                                Từ chối
                              </span>
                            )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(dispute.CreatedDate).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Complaint Details */}
              <div className="mb-4 flex min-h-[100px] flex-col rounded-lg bg-orange-50 p-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-200">
                    <span className="text-xs font-bold text-orange-700">
                      {dispute.RaisedByRole === 'Customer' ? 'K' : 'T'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-orange-900">
                    {dispute.RaisedByName}
                  </p>
                </div>
                <p className="line-clamp-2 text-sm text-gray-600">{dispute.Reason}</p>
              </div>

              {/* People Info */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Khách hàng</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {dispute.AppointmentDetails?.CustomerName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Thợ</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {dispute.AppointmentDetails?.TechnicianName}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-2">
                {dispute.Status === 'Open' || dispute.Status === 'InProgress'
                  ? (
                      <>
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <User className="h-4 w-4" />
                          Xem
                        </button>
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-100"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Giải quyết
                        </button>
                      </>
                    )
                  : (
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                    )}
              </div>

              {/* Resolution Notes - Below buttons */}
              {dispute.ResolutionNotes && (
                <div className="mt-4 rounded-lg bg-green-50 p-3">
                  <div className="mb-1 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-semibold text-green-900">Đã giải quyết</p>
                  </div>
                  <p className="line-clamp-2 text-sm text-green-700">
                    {dispute.ResolutionNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
