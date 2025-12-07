'use client';

import type { AdminWalletPayout, PayoutStatus } from '@/types/wallet';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Loader2,
  Search,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import UploadService from '@/libs/UploadService';
import WalletService from '@/libs/WalletService';

export default function FinancialPage() {
  const [payouts, setPayouts] = useState<AdminWalletPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_totalItems, setTotalItems] = useState(0);

  const [viewModal, setViewModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [markPaidModal, setMarkPaidModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedPayout, setSelectedPayout]
    = useState<AdminWalletPayout | null>(null);

  const [approvePurpose, setApprovePurpose] = useState('Rút ví EZYFIX');
  const [proofNote, setProofNote] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [billImage, setBillImage] = useState<File | null>(null);
  const [billImagePreview, setBillImagePreview] = useState<string>('');

  const [isApproving, setIsApproving] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [approvePurposeError, setApprovePurposeError] = useState(false);
  const [rejectReasonError, setRejectReasonError] = useState(false);
  const [billImageError, setBillImageError] = useState(false);

  const fetchPayouts = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        pageSize: 10,
      };

      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }

      const response = await WalletService.getAllPayouts(params);
      setPayouts(response.items);
      setTotalPages(response.meta.total_pages);
      setTotalItems(response.meta.total_items);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const filteredPayouts = payouts.filter(
    payout =>
      payout.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
      || payout.technicianEmail.toLowerCase().includes(searchTerm.toLowerCase())
      || payout.receiverAccount.includes(searchTerm),
  );

  const stats = {
    totalPending: payouts.filter(p => p.status === 'PENDING').length,
    totalApproved: payouts.filter(p => p.status === 'APPROVED').length,
    totalPaid: payouts.filter(p => p.status === 'PAID').length,
    totalRejected: payouts.filter(p => p.status === 'REJECTED').length,
    totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
  };

  const handleViewPayout = (payout: AdminWalletPayout) => {
    setSelectedPayout(payout);
    setViewModal(true);
  };

  const handleApproveClick = (payout: AdminWalletPayout) => {
    setSelectedPayout(payout);
    setApprovePurpose('Rút ví EZYFIX');
    setApprovePurposeError(false);
    setApproveModal(true);
  };

  const handleApprove = async () => {
    if (!approvePurpose.trim()) {
      setApprovePurposeError(true);
      return;
    }

    try {
      setIsApproving(true);
      const result = await WalletService.approvePayout(selectedPayout!.payoutRequestId, {
        purpose: approvePurpose,
      });
      toast.success('Đã duyệt yêu cầu rút tiền thành công');
      // Cập nhật payout với QR code
      setSelectedPayout(result);
      setApproveModal(false);
      fetchPayouts();
    } catch (error: any) {
      console.error('Error approving payout:', error);

      // Handle specific backend errors
      const errorResponse = error.response?.data;
      const exceptionMessage = errorResponse?.data?.exceptionMessage;

      if (exceptionMessage) {
        const errorCode = exceptionMessage.toUpperCase();

        if (errorCode.includes('INVALID_STATUS')) {
          toast.error('Trạng thái payout không hợp lệ để duyệt');
        } else if (errorCode.includes('NOT_FOUND')) {
          toast.error('Không tìm thấy yêu cầu rút tiền này');
        } else if (errorCode.includes('ALREADY_APPROVED')) {
          toast.error('Yêu cầu này đã được duyệt rồi');
        } else if (errorCode.includes('UNAUTHORIZED')) {
          toast.error('Bạn không có quyền thực hiện thao tác này');
        } else {
          toast.error(exceptionMessage);
        }
      } else if (errorResponse?.reason && errorResponse.reason !== 'Internal server error') {
        toast.error(errorResponse.reason);
      } else if (errorResponse?.message) {
        toast.error(errorResponse.message);
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi duyệt yêu cầu');
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleMarkPaidClick = (payout: AdminWalletPayout) => {
    setSelectedPayout(payout);
    setProofNote('');
    setReferenceNumber('');
    setBillImage(null);
    setBillImagePreview('');
    setBillImageError(false);
    setMarkPaidModal(true);
  };

  const handleMarkPaid = async () => {
    if (!billImage) {
      setBillImageError(true);
      toast.error('Vui lòng upload ảnh bill chuyển tiền');
      return;
    }

    try {
      setIsMarkingPaid(true);

      // Upload bill image to backend using /api/v1/media
      toast.info('Đang upload ảnh bill...');
      const billUrl = await UploadService.uploadPayoutBillImage(billImage);

      // Mark as paid with the uploaded bill URL
      await WalletService.markPaid(selectedPayout!.payoutRequestId, {
        proofImageUrl: billUrl,
        proofNote: proofNote.trim() || undefined,
        referenceNumber: referenceNumber.trim() || undefined,
      });

      toast.success('Đã đánh dấu là đã chuyển tiền');
      setMarkPaidModal(false);
      fetchPayouts();
    } catch (error: any) {
      console.error('Error marking paid:', error);

      // Handle specific backend errors
      const errorResponse = error.response?.data;

      // Check for specific error in data.exceptionMessage
      const exceptionMessage = errorResponse?.data?.exceptionMessage;

      if (exceptionMessage) {
        const errorCode = exceptionMessage.toUpperCase();

        if (errorCode.includes('INSUFFICIENT_BALANCE')) {
          toast.error('Không đủ số dư trong ví để thực hiện thanh toán');
        } else if (errorCode.includes('INVALID_STATUS')) {
          toast.error('Trạng thái payout không hợp lệ để đánh dấu đã thanh toán');
        } else if (errorCode.includes('NOT_FOUND')) {
          toast.error('Không tìm thấy yêu cầu rút tiền này');
        } else if (errorCode.includes('UNAUTHORIZED')) {
          toast.error('Bạn không có quyền thực hiện thao tác này');
        } else if (errorCode.includes('ALREADY_PAID')) {
          toast.error('Yêu cầu này đã được đánh dấu là đã thanh toán rồi');
        } else {
          toast.error(exceptionMessage);
        }
      } else if (errorResponse?.reason && errorResponse.reason !== 'Internal server error') {
        toast.error(errorResponse.reason);
      } else if (errorResponse?.message) {
        toast.error(errorResponse.message);
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi đánh dấu đã thanh toán');
      }
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleRejectClick = (payout: AdminWalletPayout) => {
    setSelectedPayout(payout);
    setRejectReason('');
    setRejectReasonError(false);
    setRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setRejectReasonError(true);
      return;
    }

    try {
      setIsRejecting(true);
      await WalletService.rejectPayout(selectedPayout!.payoutRequestId, {
        reason: rejectReason,
      });
      toast.success('Đã từ chối yêu cầu rút tiền');
      setRejectModal(false);
      fetchPayouts();
    } catch (error: any) {
      console.error('Error rejecting payout:', error);

      // Handle specific backend errors
      const errorResponse = error.response?.data;
      const exceptionMessage = errorResponse?.data?.exceptionMessage;

      if (exceptionMessage) {
        const errorCode = exceptionMessage.toUpperCase();

        if (errorCode.includes('INVALID_STATUS')) {
          toast.error('Trạng thái payout không hợp lệ để từ chối');
        } else if (errorCode.includes('NOT_FOUND')) {
          toast.error('Không tìm thấy yêu cầu rút tiền này');
        } else if (errorCode.includes('ALREADY_REJECTED')) {
          toast.error('Yêu cầu này đã bị từ chối rồi');
        } else if (errorCode.includes('UNAUTHORIZED')) {
          toast.error('Bạn không có quyền thực hiện thao tác này');
        } else {
          toast.error(exceptionMessage);
        }
      } else if (errorResponse?.reason && errorResponse.reason !== 'Internal server error') {
        toast.error(errorResponse.reason);
      } else if (errorResponse?.message) {
        toast.error(errorResponse.message);
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
      }
    } finally {
      setIsRejecting(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: PayoutStatus) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Chờ duyệt',
        icon: Clock,
      },
      APPROVED: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        label: 'Đã duyệt',
        icon: CheckCircle2,
      },
      PAID: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Đã chuyển',
        icon: Check,
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Từ chối',
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="size-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý tài chính
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý yêu cầu rút tiền từ thợ sửa chữa
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Chờ duyệt</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {stats.totalPending}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Đã duyệt</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {stats.totalApproved}
              </p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Đã chuyển</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {stats.totalPaid}
              </p>
            </div>
            <CreditCard className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Từ chối</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {stats.totalRejected}
              </p>
            </div>
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Tổng giá trị</p>
              <p className="mt-1 text-xl font-bold text-purple-600">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              placeholder="Tìm theo tên thợ, email, số tài khoản..."
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'] as const).map(
              status => (
                <button
                  key={status}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'ALL'
                    ? 'Tất cả'
                    : status === 'PENDING'
                      ? 'Chờ duyệt'
                      : status === 'APPROVED'
                        ? 'Đã duyệt'
                        : status === 'PAID'
                          ? 'Đã chuyển'
                          : 'Từ chối'}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-blue-600" />
                <span className="ml-3 text-sm text-gray-600">
                  Đang tải dữ liệu...
                </span>
              </div>
            )
          : filteredPayouts.length === 0
            ? (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-sm font-medium">
                    Không tìm thấy yêu cầu rút tiền nào
                  </p>
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Thợ sửa chữa
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Thông tin nhận tiền
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Số tiền
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          Ngày yêu cầu
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayouts.map(payout => (
                        <tr
                          key={payout.payoutRequestId}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payout.technicianName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payout.technicianEmail}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {payout.receiverName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payout.receiverAccount}
                              {' '}
                              (
                              {payout.bankCode}
                              )
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(payout.amount)}
                            </div>
                            {payout.holdAmount > 0 && (
                              <div className="text-xs text-gray-500">
                                Giữ:
                                {' '}
                                {formatCurrency(payout.holdAmount)}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(payout.status)}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {formatDate(payout.requestedAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                title="Xem chi tiết"
                                type="button"
                                onClick={() => handleViewPayout(payout)}
                              >
                                <Eye className="size-4" />
                              </button>

                              {payout.status === 'PENDING' && (
                                <>
                                  <button
                                    className="rounded-md p-2 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700"
                                    title="Duyệt"
                                    type="button"
                                    onClick={() => handleApproveClick(payout)}
                                  >
                                    <Check className="size-4" />
                                  </button>
                                  <button
                                    className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                    title="Từ chối"
                                    type="button"
                                    onClick={() => handleRejectClick(payout)}
                                  >
                                    <X className="size-4" />
                                  </button>
                                </>
                              )}

                              {payout.status === 'APPROVED' && (
                                <>
                                  <button
                                    className="rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                    title="Đã chuyển tiền"
                                    type="button"
                                    onClick={() => handleMarkPaidClick(payout)}
                                  >
                                    <Check className="size-4" />
                                  </button>
                                  <button
                                    className="rounded-md p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                                    title="Từ chối"
                                    type="button"
                                    onClick={() => handleRejectClick(payout)}
                                  >
                                    <X className="size-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4">
            <button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === 1}
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
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
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết yêu cầu rút tiền
              </h2>
              <button
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                type="button"
                onClick={() => setViewModal(false)}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-600">
                  Trạng thái
                </div>
                <div className="mt-2">
                  {getStatusBadge(selectedPayout.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Tên thợ
                  </div>
                  <div className="mt-1 text-gray-900">
                    {selectedPayout.technicianName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Email
                  </div>
                  <div className="mt-1 text-gray-900">
                    {selectedPayout.technicianEmail}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="mb-3 font-semibold text-blue-900">
                  Thông tin nhận tiền
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-blue-700">
                      Tên tài khoản
                    </div>
                    <div className="mt-1 text-blue-900">
                      {selectedPayout.receiverName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-700">
                      Số tài khoản
                    </div>
                    <div className="mt-1 text-blue-900">
                      {selectedPayout.receiverAccount}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-700">
                      Ngân hàng
                    </div>
                    <div className="mt-1 text-blue-900">
                      {selectedPayout.bankCode}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Số tiền rút
                  </div>
                  <div className="mt-1 text-2xl font-bold text-blue-600">
                    {formatCurrency(selectedPayout.amount)}
                  </div>
                </div>
                {selectedPayout.holdAmount > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Số tiền đang giữ
                    </div>
                    <div className="mt-1 text-2xl font-bold text-orange-600">
                      {formatCurrency(selectedPayout.holdAmount)}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Ngày yêu cầu
                  </div>
                  <div className="mt-1 text-gray-900">
                    {formatDate(selectedPayout.requestedAt)}
                  </div>
                </div>
                {selectedPayout.approvedAt && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Ngày duyệt
                    </div>
                    <div className="mt-1 text-gray-900">
                      {formatDate(selectedPayout.approvedAt)}
                    </div>
                  </div>
                )}
              </div>

              {selectedPayout.note && (
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Ghi chú
                  </div>
                  <div className="mt-1 text-gray-900">
                    {selectedPayout.note}
                  </div>
                </div>
              )}

              {selectedPayout.vietQrImageBase64 && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Mã QR chuyển khoản
                  </h3>
                  <div className="flex justify-center">
                    <Image
                      alt="VietQR"
                      className="rounded-lg border-2 border-gray-200"
                      height={300}
                      src={`data:image/png;base64,${selectedPayout.vietQrImageBase64}`}
                      width={300}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="rounded-lg bg-gray-200 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-300"
                type="button"
                onClick={() => setViewModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Duyệt yêu cầu rút tiền
              </h2>
              <button
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                type="button"
                onClick={() => setApproveModal(false)}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-sm text-blue-700">Thợ sửa chữa</div>
                <div className="font-semibold text-blue-900">
                  {selectedPayout.technicianName}
                </div>
                <div className="mt-2 text-sm text-blue-700">Số tiền</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(selectedPayout.amount)}
                </div>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Mục đích chuyển tiền
                  {' '}
                  <span className="text-red-500">*</span>
                </div>
                <input
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none ${
                    approvePurposeError
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Ví dụ: Rút ví EZYFIX"
                  type="text"
                  value={approvePurpose}
                  onChange={(e) => {
                    setApprovePurpose(e.target.value);
                    setApprovePurposeError(false);
                  }}
                />
                {approvePurposeError && (
                  <p className="mt-1 text-sm text-red-500">
                    Vui lòng nhập mục đích
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <div className="flex gap-2">
                  <AlertCircle className="size-5 shrink-0 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    Sau khi duyệt, hệ thống sẽ tạo mã QR VietQR để chuyển khoản
                    cho thợ sửa chữa.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-lg bg-gray-200 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-300"
                type="button"
                onClick={() => setApproveModal(false)}
              >
                Hủy
              </button>
              <button
                className="flex-1 rounded-lg bg-gradient-to-r from-green-600 to-green-500 px-6 py-2.5 font-medium text-white hover:from-green-700 hover:to-green-600 disabled:opacity-50"
                disabled={isApproving}
                type="button"
                onClick={handleApprove}
              >
                {isApproving
                  ? (
                      <>
                        <Loader2 className="mr-2 inline size-4 animate-spin" />
                        Đang xử lý...
                      </>
                    )
                  : (
                      'Duyệt'
                    )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Paid Modal */}
      {markPaidModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Xác nhận đã chuyển tiền
              </h2>
              <button
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                type="button"
                onClick={() => setMarkPaidModal(false)}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-sm text-blue-700">Thợ sửa chữa</div>
                <div className="font-semibold text-blue-900">
                  {selectedPayout.technicianName}
                </div>
                <div className="mt-2 text-sm text-blue-700">Số tiền</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(selectedPayout.amount)}
                </div>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Ghi chú (tùy chọn)
                </div>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  placeholder="Ví dụ: Đã chuyển lúc 10:30"
                  type="text"
                  value={proofNote}
                  onChange={e => setProofNote(e.target.value)}
                />
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Mã tham chiếu (tùy chọn)
                </div>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  placeholder="Ví dụ: FT123456"
                  type="text"
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                />
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Ảnh bill chuyển tiền
                  {' '}
                  <span className="text-red-500">*</span>
                </div>
                <div className="mt-2 max-h-80 overflow-y-auto">
                  {billImagePreview
                    ? (
                        <div className="relative">
                          <Image
                            src={billImagePreview}
                            alt="Bill preview"
                            width={400}
                            height={300}
                            className="w-full rounded-lg border-2 border-gray-300"
                            unoptimized
                          />
                          <button
                            className="sticky top-2 right-2 float-right rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600"
                            type="button"
                            onClick={() => {
                              setBillImage(null);
                              setBillImagePreview('');
                              setBillImageError(false);
                            }}
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      )
                    : (
                        <button
                          type="button"
                          className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                            billImageError
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e: any) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setBillImage(file);
                                setBillImagePreview(URL.createObjectURL(file));
                                setBillImageError(false);
                              }
                            };
                            input.click();
                          }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <CreditCard className={`size-12 ${billImageError ? 'text-red-400' : 'text-gray-400'}`} />
                            <div className={`text-sm ${billImageError ? 'text-red-600' : 'text-gray-600'}`}>
                              {billImageError ? 'Vui lòng chọn ảnh bill' : 'Click để chọn ảnh bill'}
                            </div>
                          </div>
                        </button>
                      )}
                </div>
                {billImageError && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    Bắt buộc phải upload ảnh bill chuyển tiền
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex gap-2">
                  <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                  <div className="text-sm text-green-800">
                    Hệ thống sẽ tự động trừ tiền trong ví của thợ và giải phóng
                    holdAmount.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-lg bg-gray-200 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-300"
                type="button"
                onClick={() => setMarkPaidModal(false)}
              >
                Hủy
              </button>
              <button
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 font-medium text-white hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
                disabled={isMarkingPaid}
                type="button"
                onClick={handleMarkPaid}
              >
                {isMarkingPaid
                  ? (
                      <>
                        <Loader2 className="mr-2 inline size-4 animate-spin" />
                        Đang xử lý...
                      </>
                    )
                  : (
                      'Xác nhận'
                    )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Từ chối yêu cầu rút tiền
              </h2>
              <button
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                type="button"
                onClick={() => setRejectModal(false)}
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4">
                <div className="text-sm text-red-700">Thợ sửa chữa</div>
                <div className="font-semibold text-red-900">
                  {selectedPayout.technicianName}
                </div>
                <div className="mt-2 text-sm text-red-700">Số tiền</div>
                <div className="text-2xl font-bold text-red-900">
                  {formatCurrency(selectedPayout.amount)}
                </div>
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700">
                  Lý do từ chối
                  {' '}
                  <span className="text-red-500">*</span>
                </div>
                <textarea
                  className={`mt-1 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none ${
                    rejectReasonError
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Ví dụ: Thông tin tài khoản không hợp lệ"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    setRejectReasonError(false);
                  }}
                />
                {rejectReasonError && (
                  <p className="mt-1 text-sm text-red-500">
                    Vui lòng nhập lý do từ chối
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-yellow-50 p-4">
                <div className="flex gap-2">
                  <AlertCircle className="size-5 shrink-0 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    Sau khi từ chối, holdAmount sẽ được giải phóng và thợ có thể
                    tạo yêu cầu mới.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-lg bg-gray-200 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-300"
                type="button"
                onClick={() => setRejectModal(false)}
              >
                Hủy
              </button>
              <button
                className="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 font-medium text-white hover:from-red-700 hover:to-red-600 disabled:opacity-50"
                disabled={isRejecting}
                type="button"
                onClick={handleReject}
              >
                {isRejecting
                  ? (
                      <>
                        <Loader2 className="mr-2 inline size-4 animate-spin" />
                        Đang xử lý...
                      </>
                    )
                  : (
                      'Từ chối'
                    )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
