'use client';

import {
  Calendar,
  Copy,
  Edit,
  Eye,
  Percent,
  Plus,
  Search,
  Tag,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { mockVouchers } from '@/libs/admin-data';

export default function VouchersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVouchers = mockVouchers.filter(
    voucher =>
      voucher.VoucherCode.toLowerCase().includes(searchTerm.toLowerCase())
      || voucher.VoucherDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeVouchers = mockVouchers.filter(v => v.IsActive).length;
  const totalDiscount = mockVouchers.reduce((sum, v) => sum + v.DiscountValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Voucher</h2>
          <p className="mt-1 text-sm text-gray-600">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Tạo voucher mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng voucher</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{mockVouchers.length}</p>
              <p className="mt-2 text-sm text-gray-500">
                {activeVouchers}
                {' '}
                đang hoạt động
              </p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng giảm giá</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalDiscount.toLocaleString('vi-VN')}
                {' '}
                đ
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12% tháng này</span>
              </div>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lượt sử dụng</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {mockVouchers.reduce((sum, v) => sum + (v.UsageCount || 0), 0)}
              </p>
              <p className="mt-2 text-sm text-gray-500">Tổng lượt đã dùng</p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600" />
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm voucher theo mã hoặc mô tả..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVouchers.map((voucher) => {
          const usagePercent = voucher.MaxUsageCount
            ? ((voucher.UsageCount || 0) / voucher.MaxUsageCount) * 100
            : 0;
          const isExpired = new Date(voucher.ValidTo) < new Date();

          return (
            <div
              key={voucher.VoucherID}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Header with gradient */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white opacity-10" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        <span className="text-sm font-medium opacity-90">Mã giảm giá</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <h3 className="text-2xl font-bold tracking-wider">
                          {voucher.VoucherCode}
                        </h3>
                        <button
                          type="button"
                          className="rounded-lg bg-white/20 p-1.5 transition-colors hover:bg-white/30"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {voucher.IsActive
                      ? (
                          <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-semibold">
                            Active
                          </span>
                        )
                      : (
                          <span className="rounded-full bg-gray-400 px-3 py-1 text-xs font-semibold">
                            Inactive
                          </span>
                        )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex min-h-[320px] flex-col p-6">
                <div className="flex-1">
                  <p className="line-clamp-2 text-sm text-gray-600">{voucher.VoucherDescription}</p>

                  <div className="mt-4 space-y-3">
                    {/* Discount */}
                    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 p-3">
                      <span className="text-sm font-medium text-orange-700">Giảm giá</span>
                      <span className="text-lg font-bold text-orange-800">
                        {voucher.DiscountValue.toLocaleString('vi-VN')}
                        {' '}
                        {voucher.DiscountType === 'Percentage' ? '%' : 'đ'}
                      </span>
                    </div>

                    {/* Usage */}
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600">Lượt sử dụng</span>
                        <span className="font-semibold text-gray-900">
                          {voucher.UsageCount || 0}
                          {' '}
                          /
                          {voucher.MaxUsageCount}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Bắt đầu</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {new Date(voucher.ValidFrom).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Kết thúc</span>
                        </div>
                        <span
                          className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}
                        >
                          {new Date(voucher.ValidTo).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with buttons */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                      Xem
                    </button>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <Edit className="h-4 w-4" />
                      Sửa
                    </button>
                  </div>

                  {/* Warning below buttons */}
                  {isExpired && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      <XCircle className="h-4 w-4 flex-shrink-0" />
                      <span>Voucher đã hết hạn</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVouchers.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Không tìm thấy voucher</h3>
          <p className="mt-2 text-sm text-gray-600">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
