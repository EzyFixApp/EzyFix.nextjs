'use client';

import type {
  GetPaymentsParams,
  Payment,
  PaymentDetails,
  PaymentStatus,
} from '@/types/payment';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Loader2,
  Search,
  User,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import PaymentService from '@/libs/PaymentService';

export default function PaymentsPage() {
  // State
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  // Summary stats
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalCommission: 0,
    pendingEscrow: 0,
    completedPayments: 0,
    failedPayments: 0,
  });

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const params: GetPaymentsParams = {
          page: currentPage,
          pageSize: 10,
        };

        if (statusFilter !== 'ALL') {
          params.status = statusFilter;
        }

        if (showOnlyIssues) {
          params.hasIssue = true;
        }

        const response = await PaymentService.getAllPayments(params);
        setPayments(response.items);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
        setSummary(response.summary);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu thanh toán');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [currentPage, statusFilter, showOnlyIssues]);

  // Filter payments by search term
  const filteredPayments = payments.filter(
    payment =>
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      || payment.customerPhone.includes(searchTerm)
      || payment.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
      || payment.providerOrderCode.includes(searchTerm),
  );

  // Handle view details
  const handleViewDetails = async (payment: Payment) => {
    setSelectedPayment(payment);
    setViewDetailsModal(true);
    setIsLoadingDetails(true);
    setPaymentDetails(null);

    try {
      const details = await PaymentService.getPaymentById(payment.paymentId);
      setPaymentDetails(details);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Không thể tải chi tiết thanh toán');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    // Normalize status to uppercase for matching
    const normalizedStatus = status.toUpperCase();

    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Chờ thanh toán' },
      PAYMENT_SUCCESS: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2, label: 'Đã thanh toán' },
      FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Thất bại' },
      ESCROW: { color: 'bg-purple-100 text-purple-800', icon: Wallet, label: 'Giữ tạm' },
      COMPLETE: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Hoàn thành' },
    };

    const config = statusConfig[normalizedStatus] || {
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
      label: status,
    };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.color}`}>
        <Icon className="size-3" />
        {config.label}
      </span>
    );
  };

  // Get issue badge
  const getIssueBadge = (issueFlags: string[]) => {
    if (issueFlags.length === 0) {
      return null;
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
        <AlertTriangle className="size-3" />
        {issueFlags.includes('STUCK_ESCROW') ? 'Giữ tạm quá lâu' : 'Có vấn đề'}
      </span>
    );
  };

  // Translate wallet transaction type
  const translateWalletType = (type: string): string => {
    const typeMap: Record<string, string> = {
      Credit: 'Cộng tiền',
      Debit: 'Trừ tiền',
    };
    return typeMap[type] || type;
  };

  // Translate wallet transaction reason
  const translateWalletReason = (reason: string): string => {
    const reasonMap: Record<string, string> = {
      Earning: 'Thu nhập',
      Refund: 'Hoàn tiền',
      Withdrawal: 'Rút tiền',
      Commission: 'Hoa hồng',
      Bonus: 'Thưởng',
      Penalty: 'Phạt',
    };
    return reasonMap[reason] || reason;
  };

  // Translate action to Vietnamese
  const translateAction = (action: string): string => {
    const actionMap: Record<string, string> = {
      Created: 'Tạo mới',
      Updated: 'Cập nhật',
      Cancelled: 'Hủy',
      CHECKING: 'Đang kiểm tra',
      REPAIRING: 'Đang sửa chữa',
      REPAIRED: 'Đã sửa xong',
      SCHEDULED: 'Đã đặt lịch',
      EN_ROUTE: 'Đang di chuyển',
      ARRIVED: 'Đã đến',
    };
    return actionMap[action] || action;
  };

  // Translate status for display
  const translateStatus = (oldValue: string | null, newValue: string | null): string => {
    if (!oldValue && !newValue) {
      return '';
    }
    const statusMap: Record<string, string> = {
      SCHEDULED: 'Đã đặt lịch',
      EN_ROUTE: 'Đang di chuyển',
      ARRIVED: 'Đã đến',
      CHECKING: 'Đang kiểm tra',
      REPAIRING: 'Đang sửa chữa',
      REPAIRED: 'Đã sửa xong',
    };
    return statusMap[newValue?.toUpperCase() || ''] || newValue || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo Dòng tiền</h1>
          <p className="mt-2 text-gray-600">Quản lý và theo dõi các giao dịch thanh toán</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3">
                <DollarSign className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-xl font-bold text-gray-900">{summary.completedPayments}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-3">
                <Wallet className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giữ tạm (Escrow)</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.pendingEscrow)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-3">
                <CreditCard className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hoa hồng</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalCommission)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="size-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Thất bại</p>
                <p className="text-xl font-bold text-gray-900">{summary.failedPayments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng, thợ, mã giao dịch..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as PaymentStatus | 'ALL')}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="PAYMENT_SUCCESS">Đã thanh toán</option>
              <option value="ESCROW">Giữ tạm</option>
              <option value="COMPLETE">Hoàn thành</option>
              <option value="FAILED">Thất bại</option>
            </select>

            {/* Issue Filter */}
            <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2">
              <input
                type="checkbox"
                checked={showOnlyIssues}
                onChange={e => setShowOnlyIssues(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Chỉ xem giao dịch có vấn đề</span>
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {isLoading
            ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-blue-600" />
                </div>
              )
            : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Mã GD
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
                            Phương thức
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Ngày GD
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredPayments.length === 0
                          ? (
                              <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                  Không tìm thấy giao dịch nào
                                </td>
                              </tr>
                            )
                          : (
                              filteredPayments.map(payment => (
                                <tr key={payment.paymentId} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                                    <div className="font-medium text-gray-900">
                                      {payment.providerOrderCode}
                                    </div>
                                    {payment.issueFlags.length > 0 && (
                                      <div className="mt-1">{getIssueBadge(payment.issueFlags)}</div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      <User className="size-4 text-gray-400" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {payment.customerName}
                                        </div>
                                        <div className="text-sm text-gray-500">{payment.customerPhone}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{payment.technicianName}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {formatCurrency(payment.amount)}
                                    </div>
                                    {payment.discountAmount > 0 && (
                                      <div className="text-xs text-gray-500">
                                        Giảm:
                                        {' '}
                                        {formatCurrency(payment.discountAmount)}
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="size-4 text-gray-400" />
                                      <span className="text-sm text-gray-900">
                                        {payment.paymentMethodName}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(payment.status)}
                                  </td>
                                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                    {formatDate(payment.transactionDate)}
                                  </td>
                                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => handleViewDetails(payment)}
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                                    >
                                      <Eye className="size-4" />
                                      Xem
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
                      <button
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === 1}
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        Trước
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewDetailsModal && selectedPayment && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setViewDetailsModal(false);
            setPaymentDetails(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setViewDetailsModal(false);
              setPaymentDetails(null);
            }
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết thanh toán</h2>
              <button
                type="button"
                onClick={() => {
                  setViewDetailsModal(false);
                  setPaymentDetails(null);
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-6" />
              </button>
            </div>

            {isLoadingDetails
              ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="size-8 animate-spin text-blue-600" />
                  </div>
                )
              : paymentDetails
                ? (
                    <div className="space-y-6">
                      {/* Payment Info */}
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Thông tin thanh toán</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Mã giao dịch</p>
                            <p className="font-medium text-gray-900">{paymentDetails.providerOrderCode}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Trạng thái</p>
                            <div className="mt-1">{getStatusBadge(paymentDetails.status)}</div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Số tiền gốc</p>
                            <p className="font-medium text-gray-900">
                              {formatCurrency(paymentDetails.originalAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Giảm giá</p>
                            <p className="font-medium text-red-600">
                              -
                              {formatCurrency(paymentDetails.discountAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Số tiền thanh toán</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(paymentDetails.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Hoa hồng</p>
                            <p className="font-medium text-orange-600">
                              {formatCurrency(paymentDetails.commissionAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Thợ nhận</p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(paymentDetails.netAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Phương thức</p>
                            <p className="font-medium text-gray-900">
                              {paymentDetails.paymentMethod.methodName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Ngày giao dịch</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(paymentDetails.transactionDate)}
                            </p>
                          </div>
                          {paymentDetails.paymentSuccessAt && (
                            <div>
                              <p className="text-sm text-gray-600">Thanh toán thành công</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(paymentDetails.paymentSuccessAt)}
                              </p>
                            </div>
                          )}
                          {paymentDetails.escrowReleasedAt && (
                            <div>
                              <p className="text-sm text-gray-600">Giải ngân</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(paymentDetails.escrowReleasedAt)}
                              </p>
                            </div>
                          )}
                          {paymentDetails.expectedReleaseDate && paymentDetails.status === 'ESCROW' && (
                            <div>
                              <p className="text-sm text-gray-600">Dự kiến giải ngân</p>
                              <p className="font-medium text-purple-600">
                                {formatDate(paymentDetails.expectedReleaseDate)}
                              </p>
                            </div>
                          )}
                        </div>

                        {paymentDetails.issueFlags.length > 0 && (
                          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3">
                            <AlertCircle className="size-5 text-red-600" />
                            <span className="text-sm font-medium text-red-800">
                              Cảnh báo: Giao dịch có vấn đề -
                              {' '}
                              {paymentDetails.issueFlags.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Appointment Info */}
                      <div className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                          <Calendar className="size-5" />
                          Thông tin lịch hẹn
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Dịch vụ</p>
                            <p className="font-medium text-gray-900">
                              {paymentDetails.appointment.serviceName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Trạng thái</p>
                            <p className="font-medium text-gray-900">
                              {paymentDetails.appointment.status}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-600">Địa chỉ</p>
                            <p className="font-medium text-gray-900">
                              {paymentDetails.appointment.serviceAddress}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Ngày hẹn</p>
                            <p className="font-medium text-gray-900">
                              {new Date(paymentDetails.appointment.scheduledDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          {paymentDetails.appointment.actualStartTime && (
                            <div>
                              <p className="text-sm text-gray-600">Bắt đầu thực tế</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(paymentDetails.appointment.actualStartTime)}
                              </p>
                            </div>
                          )}
                          {paymentDetails.appointment.actualEndTime && (
                            <div>
                              <p className="text-sm text-gray-600">Kết thúc</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(paymentDetails.appointment.actualEndTime)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer & Technician Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border border-gray-200 p-4">
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <User className="size-5" />
                            Khách hàng
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600">Họ tên</p>
                              <p className="font-medium text-gray-900">{paymentDetails.customer.fullName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium text-gray-900">{paymentDetails.customer.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Điện thoại</p>
                              <p className="font-medium text-gray-900">{paymentDetails.customer.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <User className="size-5" />
                            Thợ
                          </h3>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600">Họ tên</p>
                              <p className="font-medium text-gray-900">{paymentDetails.technician.fullName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium text-gray-900">{paymentDetails.technician.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Điện thoại</p>
                              <p className="font-medium text-gray-900">{paymentDetails.technician.phone}</p>
                            </div>
                            {paymentDetails.technician.walletAccountId && (
                              <div>
                                <p className="text-sm text-gray-600">Ví điện tử</p>
                                <p className="font-mono text-xs text-gray-900">
                                  {paymentDetails.technician.walletAccountId}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Wallet Transactions */}
                      {paymentDetails.walletTransactions.length > 0 && (
                        <div className="rounded-lg border border-gray-200 p-4">
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Wallet className="size-5" />
                            Giao dịch ví
                          </h3>
                          <div className="space-y-3">
                            {paymentDetails.walletTransactions.map(tx => (
                              <div
                                key={tx.transactionId}
                                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {translateWalletType(tx.type)}
                                    {' '}
                                    -
                                    {' '}
                                    {translateWalletReason(tx.reason)}
                                  </p>
                                  <p className="text-sm text-gray-600">{tx.note.includes('Net after commission') ? tx.note.replace('Net after commission', 'Sau khi trừ hoa hồng') : tx.note}</p>
                                  <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-lg font-bold ${tx.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'Credit' ? '+' : '-'}
                                    {formatCurrency(tx.amount)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Voucher Usage */}
                      {paymentDetails.voucherUsages.length > 0 && (
                        <div className="rounded-lg border border-gray-200 p-4">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">Voucher đã sử dụng</h3>
                          <div className="space-y-3">
                            {paymentDetails.voucherUsages.map(voucher => (
                              <div
                                key={voucher.voucherUsageId}
                                className="flex items-center justify-between rounded-lg bg-green-50 p-3"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Mã:
                                    {' '}
                                    {voucher.voucherCode}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Sử dụng:
                                    {' '}
                                    {formatDate(voucher.usedAt)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-600">
                                    -
                                    {formatCurrency(voucher.discountAmount)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activity Logs */}
                      {paymentDetails.activityLogs.length > 0 && (
                        <div className="rounded-lg border border-gray-200 p-4">
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Clock className="size-5" />
                            Lịch sử hoạt động
                          </h3>
                          <div className="space-y-3">
                            {paymentDetails.activityLogs.map(log => (
                              <div
                                key={log.logId}
                                className="flex items-start gap-3 rounded-lg bg-gray-50 p-3"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                      {translateAction(log.action)}
                                    </span>
                                    <span className="text-sm text-gray-600">{log.performedBy}</span>
                                  </div>
                                  {log.oldValue && log.newValue && (
                                    <p className="mt-1 text-sm text-gray-700">
                                      {translateStatus(log.oldValue, log.newValue)}
                                      {log.oldValue && log.oldValue !== log.newValue && (
                                        <>
                                          {' '}
                                          (từ
                                          {' '}
                                          {translateStatus(null, log.oldValue)}
                                          )
                                        </>
                                      )}
                                    </p>
                                  )}
                                  <p className="mt-1 text-xs text-gray-500">
                                    {formatDate(log.performedAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                : (
                    <div className="py-12 text-center text-gray-500">Không thể tải chi tiết thanh toán</div>
                  )}
          </div>
        </div>
      )}
    </div>
  );
}
