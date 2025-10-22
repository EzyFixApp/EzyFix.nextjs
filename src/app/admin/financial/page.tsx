'use client';

import {
  ArrowUpRight,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  Search,
  TrendingUp,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { mockPayments, mockPayoutRequests, mockWalletAccounts } from '@/libs/admin-data';

type TabType = 'wallets' | 'payouts' | 'payments';

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<TabType>('wallets');
  const [searchTerm, setSearchTerm] = useState('');

  const totalWalletBalance = mockWalletAccounts.reduce((sum, w) => sum + w.Balance, 0);
  const pendingPayouts = mockPayoutRequests.filter(p => p.Status === 'Requested').length;
  const completedPayments = mockPayments.filter(p => p.Status === 'Completed').length;

  const tabs = [
    { id: 'wallets' as const, label: 'Ví điện tử', icon: Wallet, count: mockWalletAccounts.length },
    { id: 'payouts' as const, label: 'Rút tiền', icon: ArrowUpRight, count: pendingPayouts },
    {
      id: 'payments' as const,
      label: 'Thanh toán',
      icon: CreditCard,
      count: completedPayments,
    },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý tài chính</h2>
          <p className="mt-1 text-sm text-gray-600">Quản lý ví, rút tiền và thanh toán</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số dư ví</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(totalWalletBalance)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>+15.3% tháng này</span>
              </div>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yêu cầu rút tiền</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{pendingPayouts}</p>
              <p className="mt-2 text-sm text-gray-500">Đang chờ duyệt</p>
            </div>
            <div className="rounded-full bg-orange-50 p-3">
              <ArrowUpRight className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thanh toán hoàn thành</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{completedPayments}</p>
              <p className="mt-2 text-sm text-gray-500">Giao dịch thành công</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-1 items-center justify-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'wallets' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Thợ sửa chữa
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Số dư
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Tiền tệ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Cập nhật
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockWalletAccounts.map(wallet => (
                  <tr key={wallet.WalletAccountID} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white">
                          {wallet.TechnicianName?.[0] || 'T'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {wallet.TechnicianName || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID:
                            {' '}
                            {wallet.TechnicianID.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(wallet.Balance)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {wallet.CurrencyCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {wallet.Status === 'Active'
                        ? (
                            <div className="flex items-center gap-1.5 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Hoạt động</span>
                            </div>
                          )
                        : (
                            <div className="flex items-center gap-1.5 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Tạm khóa</span>
                            </div>
                          )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(wallet.UpdatedDate).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {mockPayoutRequests.map(payout => (
            <div
              key={payout.PayoutRequestID}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white">
                      {payout.TechnicianName?.[0] || 'T'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{payout.TechnicianName}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {new Date(payout.RequestedAt).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      payout.Status === 'Requested'
                        ? 'bg-orange-100 text-orange-700'
                        : payout.Status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {payout.Status === 'Requested'
                      ? (
                          <>
                            <Clock className="h-3 w-3" />
                            Chờ duyệt
                          </>
                        )
                      : payout.Status === 'Completed'
                        ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Đã duyệt
                            </>
                          )
                        : (
                            <>
                              <X className="h-3 w-3" />
                              Từ chối
                            </>
                          )}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Amount - Featured */}
                <div className="mb-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Số tiền rút</p>
                      <p className="mt-1 text-2xl font-bold text-gray-900">
                        {formatCurrency(payout.Amount)}
                      </p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-3">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>Phương thức</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {payout.PayoutChannel === 'Bank' ? 'Chuyển khoản' : 'Ví điện tử'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span>Người nhận</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {payout.ReceiverName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>Tài khoản</span>
                    </div>
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {payout.ReceiverAccount}
                    </span>
                  </div>

                  {payout.BankCode && (
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>Ngân hàng</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {payout.BankCode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {payout.Status === 'Requested'
                  ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Phê duyệt
                        </button>
                        <button
                          type="button"
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Từ chối
                        </button>
                      </div>
                    )
                  : (
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                    )}

                {payout.Note && (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-600">Ghi chú:</p>
                    <p className="mt-1 text-sm text-gray-700">{payout.Note}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Mã thanh toán
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Phương thức
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ngày giao dịch
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockPayments.map(payment => (
                  <tr key={payment.PaymentID} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm font-medium text-gray-900">
                        {payment.PaymentID.slice(0, 12)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.Amount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {payment.PaymentMethodName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.Status === 'Completed'
                        ? (
                            <div className="flex items-center gap-1.5 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Thành công</span>
                            </div>
                          )
                        : payment.Status === 'Pending'
                          ? (
                              <div className="flex items-center gap-1.5 text-orange-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">Đang xử lý</span>
                              </div>
                            )
                          : (
                              <div className="flex items-center gap-1.5 text-red-600">
                                <XCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Thất bại</span>
                              </div>
                            )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(payment.TransactionDate).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
