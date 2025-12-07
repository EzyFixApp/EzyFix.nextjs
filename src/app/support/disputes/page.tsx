'use client';

import type {
  AddDisputeMessageRequest,
  Dispute,
  DisputeDetails,
  DisputeStatus,
  ResolutionType,
  ResolveDisputeRequest,
  ReviewDisputeRequest,
} from '@/types/dispute';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  MessageSquare,
  Phone,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import DisputeService from '@/libs/DisputeService';

export default function DisputesPage() {
  // State
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [_totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState({
    totalDisputes: 0,
    openDisputes: 0,
    inReviewDisputes: 0,
    resolvedDisputes: 0,
  });

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [resolveModal, setResolveModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputeDetails, setDisputeDetails] = useState<DisputeDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form states
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const [resolutionType, setResolutionType] = useState<ResolutionType>('FAVOR_CUSTOMER');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [adjustCommission, setAdjustCommission] = useState(false);
  const [applyPenalty, setApplyPenalty] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const [message, setMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Fetch disputes
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: currentPage,
          pageSize: 20,
          ...(statusFilter !== 'ALL' && { status: statusFilter }),
        };

        const response = await DisputeService.getAllDisputes(params);
        setDisputes(response.items);
        setTotalCount(response.totalCount);
        setTotalPages(Math.ceil(response.totalCount / 10)); // 10 items per page
        setSummary(response.summary);
      } catch (error) {
        console.error('Error fetching disputes:', error);
        toast.error('Không thể tải dữ liệu tranh chấp');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisputes();
  }, [currentPage, statusFilter]);

  // Filter by search term
  const filteredDisputes = disputes.filter(
    d =>
      d.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      || d.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
      || d.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle view details
  const handleViewDetails = async (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setViewDetailsModal(true);
    setIsLoadingDetails(true);

    try {
      const details = await DisputeService.getDisputeById(dispute.disputeId);
      setDisputeDetails(details);
    } catch (error) {
      console.error('Error fetching dispute details:', error);
      toast.error('Không thể tải chi tiết tranh chấp');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Handle start review
  const handleStartReview = async (dispute: Dispute) => {
    if (dispute.status !== 'Open') {
      toast.error('Chỉ có thể xem xét tranh chấp đang mở');
      return;
    }

    setSelectedDispute(dispute);
    setReviewNotes('');
    setReviewModal(true);
  };

  // Submit review
  const submitReview = async () => {
    if (!selectedDispute) {
      return;
    }

    try {
      setIsReviewing(true);
      const request: ReviewDisputeRequest = {
        adminNotes: reviewNotes || undefined,
        status: 'InReview',
      };

      await DisputeService.reviewDispute(selectedDispute.disputeId, request);
      toast.success('Đã chuyển tranh chấp sang trạng thái xem xét');
      setReviewModal(false);
      setSelectedDispute(null);

      // Refresh list
      const params = {
        page: currentPage,
        pageSize: 20,
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
      };
      const response = await DisputeService.getAllDisputes(params);
      setDisputes(response.items);
      setSummary(response.summary);
    } catch (error) {
      console.error('Error reviewing dispute:', error);
      toast.error('Không thể chuyển trạng thái tranh chấp');
    } finally {
      setIsReviewing(false);
    }
  };

  // Handle resolve
  const handleResolve = (dispute: Dispute) => {
    if (dispute.status !== 'InReview') {
      toast.error('Chỉ có thể giải quyết tranh chấp đang xem xét');
      return;
    }

    setSelectedDispute(dispute);
    setResolutionType('FAVOR_CUSTOMER');
    setResolutionNotes('');
    setRefundAmount(dispute.amount);
    setAdjustCommission(false);
    setApplyPenalty(false);
    setResolveModal(true);
  };

  // Submit resolve
  const submitResolve = async () => {
    if (!selectedDispute) {
      return;
    }

    try {
      setIsResolving(true);
      const request: ResolveDisputeRequest = {
        resolution: resolutionType,
        resolutionNotes: resolutionNotes || undefined,
        refundAmount: resolutionType.includes('REFUND') ? refundAmount : undefined,
        adjustTechnicianCommission: adjustCommission,
        applyTechnicianPenalty: applyPenalty,
      };

      await DisputeService.resolveDispute(selectedDispute.disputeId, request);
      toast.success('Đã giải quyết tranh chấp thành công');
      setResolveModal(false);
      setSelectedDispute(null);

      // Refresh list
      const params = {
        page: currentPage,
        pageSize: 20,
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
      };
      const response = await DisputeService.getAllDisputes(params);
      setDisputes(response.items);
      setSummary(response.summary);
    } catch (error) {
      console.error('Error resolving dispute:', error);
      toast.error('Không thể giải quyết tranh chấp');
    } finally {
      setIsResolving(false);
    }
  };

  // Handle add message
  const handleAddMessage = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setMessage('');
    setMessageModal(true);
  };

  // Submit message
  const submitMessage = async () => {
    if (!selectedDispute || !message.trim()) {
      toast.error('Vui lòng nhập tin nhắn');
      return;
    }

    try {
      setIsSendingMessage(true);
      const request: AddDisputeMessageRequest = {
        message: message.trim(),
      };

      await DisputeService.addMessage(selectedDispute.disputeId, request);
      toast.success('Đã thêm tin nhắn thành công');
      setMessageModal(false);
      setSelectedDispute(null);
      setMessage('');
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Không thể thêm tin nhắn');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Helper functions
  const getStatusColor = (status: DisputeStatus): string => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'InReview':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DisputeStatus) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-5 w-5" />;
      case 'InReview':
        return <Clock className="h-5 w-5" />;
      case 'Resolved':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getResolutionText = (resolution: string): string => {
    switch (resolution) {
      case 'FAVOR_CUSTOMER':
        return 'Ưu ái khách hàng';
      case 'FAVOR_TECHNICIAN':
        return 'Ưu ái thợ';
      case 'PARTIAL_REFUND':
        return 'Hoàn tiền một phần';
      case 'NO_ACTION':
        return 'Không xử lý';
      default:
        return resolution;
    }
  };

  const getStatusText = (status: DisputeStatus): string => {
    switch (status) {
      case 'Open':
        return 'Chưa giải quyết';
      case 'InReview':
        return 'Đang xem xét';
      case 'Resolved':
        return 'Đã giải quyết';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý tranh chấp</h2>
          <p className="mt-1 text-sm text-gray-600">
            Xử lý các vấn đề giữa khách hàng và thợ sửa chữa
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalDisputes}</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-gray-400 to-gray-500" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chưa giải quyết</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summary.openDisputes}</p>
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
              <p className="text-sm font-medium text-gray-600">Đang xem xét</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summary.inReviewDisputes}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã giải quyết</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summary.resolvedDisputes}</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="mb-2 block text-sm font-medium text-gray-700">
            Lọc theo trạng thái
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as DisputeStatus | 'ALL')}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
          >
            <option value="ALL">
              Tất cả (
              {summary.totalDisputes}
              )
            </option>
            <option value="Open">
              Chưa giải quyết (
              {summary.openDisputes}
              )
            </option>
            <option value="InReview">
              Đang xem xét (
              {summary.inReviewDisputes}
              )
            </option>
            <option value="Resolved">
              Đã giải quyết (
              {summary.resolvedDisputes}
              )
            </option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
            Tìm kiếm
          </label>
          <input
            id="search"
            type="text"
            placeholder="Tìm theo tên khách hàng, thợ, hoặc lý do..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-orange-600" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Disputes Table */}
      {!isLoading && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Tranh chấp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Thợ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDisputes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Không có tranh chấp nào
                    </td>
                  </tr>
                )}
                {filteredDisputes.map(dispute => (
                  <tr key={dispute.disputeId} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{dispute.reason}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {dispute.daysOpen}
                          {' '}
                          ngày •
                          {dispute.raisedBy === 'CUSTOMER' ? 'Khách hàng' : 'Thợ'}
                          {' '}
                          khiếu nại
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{dispute.customerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{dispute.technicianName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(dispute.amount)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(dispute.status)}`}>
                        {getStatusIcon(dispute.status)}
                        {getStatusText(dispute.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(dispute.createdDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(dispute)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                          title="Xem chi tiết"
                        >
                          <FileText className="h-4 w-4" />
                        </button>

                        {dispute.status === 'Open' && (
                          <button
                            type="button"
                            onClick={() => handleStartReview(dispute)}
                            className="rounded-lg bg-orange-50 p-2 text-orange-600 transition-colors hover:bg-orange-100"
                            title="Bắt đầu xem xét"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </button>
                        )}

                        {dispute.status === 'InReview' && (
                          <button
                            type="button"
                            onClick={() => handleResolve(dispute)}
                            className="rounded-lg bg-green-50 p-2 text-green-600 transition-colors hover:bg-green-100"
                            title="Giải quyết"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleAddMessage(dispute)}
                          className="rounded-lg bg-purple-50 p-2 text-purple-600 transition-colors hover:bg-purple-100"
                          title="Thêm tin nhắn"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredDisputes.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4">
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
      )}

      {/* View Details Modal */}
      {viewDetailsModal && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết tranh chấp</h3>
              <button
                type="button"
                onClick={() => setViewDetailsModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {isLoadingDetails
                ? (
                    <div className="flex h-64 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                    </div>
                  )
                : disputeDetails && (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                          Thông tin khách hàng
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{disputeDetails.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{disputeDetails.customerPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                          Thông tin thợ
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{disputeDetails.technicianName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{disputeDetails.technicianPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dispute Info */}
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                        Thông tin tranh chấp
                      </h4>
                      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-600">Lý do:</span>
                          <span className="text-sm text-gray-900">{disputeDetails.reason}</span>
                        </div>
                        {disputeDetails.description && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium text-gray-600">Kết quả giải quyết:</span>
                            <span className="text-sm text-gray-900">
                              {(() => {
                                // Extract resolution code if description starts with it
                                const resolutionMatch = disputeDetails.description.match(/^(FAVOR_CUSTOMER|FAVOR_TECHNICIAN|PARTIAL_REFUND|NO_ACTION):\s*(.+)/);
                                if (resolutionMatch) {
                                  const resolutionCode = resolutionMatch[1];
                                  const notes = resolutionMatch[2];
                                  return `${getResolutionText(resolutionCode!)}: ${notes}`;
                                }
                                return disputeDetails.description;
                              })()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Số tiền:</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(disputeDetails.finalCost)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Ngày hẹn:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(disputeDetails.scheduledDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Evidence */}
                    {(disputeDetails.customerEvidenceUrls.length > 0
                      || disputeDetails.technicianEvidenceUrls.length > 0) && (
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                          Bằng chứng
                        </h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {disputeDetails.customerEvidenceUrls.length > 0 && (
                            <div>
                              <p className="mb-2 text-sm font-medium text-gray-600">
                                Từ khách hàng
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {disputeDetails.customerEvidenceUrls.map(url => (
                                  <div key={`customer-${url}`} className="relative h-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <Image
                                      src={url}
                                      alt="Customer evidence"
                                      fill
                                      unoptimized
                                      className="object-contain"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {disputeDetails.technicianEvidenceUrls.length > 0 && (
                            <div>
                              <p className="mb-2 text-sm font-medium text-gray-600">Từ thợ</p>
                              <div className="grid grid-cols-2 gap-2">
                                {disputeDetails.technicianEvidenceUrls.map(url => (
                                  <div key={`technician-${url}`} className="relative h-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                    <Image
                                      src={url}
                                      alt="Technician evidence"
                                      fill
                                      unoptimized
                                      className="object-contain"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Activity History */}
                    {disputeDetails.activityHistory.length > 0 && (
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                          Lịch sử hoạt động
                        </h4>
                        <div className="space-y-3">
                          {disputeDetails.activityHistory.map(activity => (
                            <div
                              key={activity.timestamp}
                              className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                <Clock className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">
                                    {activity.performedBy}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(activity.timestamp)}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                  {activity.action}
                                  :
                                  {' '}
                                  {activity.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Bắt đầu xem xét</h3>
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Bạn sắp chuyển tranh chấp từ trạng thái "Chưa giải quyết" sang "Đang xem xét"
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="review-notes" className="mb-2 block text-sm font-medium text-gray-700">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="review-notes"
                  rows={4}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Nhập ghi chú về việc xem xét tranh chấp này..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={isReviewing}
                  className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50"
                >
                  {isReviewing
                    ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </span>
                      )
                    : (
                        'Xác nhận'
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
              <h3 className="text-xl font-semibold text-gray-900">Giải quyết tranh chấp</h3>
              <button
                type="button"
                onClick={() => setResolveModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Resolution Type */}
              <div>
                <label htmlFor="resolution-type" className="mb-2 block text-sm font-medium text-gray-700">
                  Loại giải quyết
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="resolution-type"
                  value={resolutionType}
                  onChange={e => setResolutionType(e.target.value as ResolutionType)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                >
                  <option value="FAVOR_CUSTOMER">Ưu ái khách hàng</option>
                  <option value="FAVOR_TECHNICIAN">Ưu ái thợ</option>
                  <option value="PARTIAL_REFUND">Hoàn tiền một phần</option>
                  <option value="NO_ACTION">Không xử lý</option>
                </select>
              </div>

              {/* Resolution Notes */}
              <div>
                <label htmlFor="resolution-notes" className="mb-2 block text-sm font-medium text-gray-700">
                  Ghi chú giải quyết
                </label>
                <textarea
                  id="resolution-notes"
                  rows={4}
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Nhập chi tiết quyết định..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>

              {/* Refund Amount (if applicable) */}
              {(resolutionType === 'FAVOR_CUSTOMER' || resolutionType === 'PARTIAL_REFUND') && (
                <div>
                  <label htmlFor="refund-amount" className="mb-2 block text-sm font-medium text-gray-700">
                    Số tiền hoàn (VND)
                  </label>
                  <input
                    id="refund-amount"
                    type="number"
                    value={refundAmount}
                    onChange={e => setRefundAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                  />
                </div>
              )}

              {/* Additional Options */}
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={adjustCommission}
                    onChange={e => setAdjustCommission(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Điều chỉnh hoa hồng thợ</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={applyPenalty}
                    onChange={e => setApplyPenalty(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Áp dụng phạt cho thợ</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setResolveModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={submitResolve}
                  disabled={isResolving}
                  className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50"
                >
                  {isResolving
                    ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang xử lý...
                        </span>
                      )
                    : (
                        'Giải quyết'
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Message Modal */}
      {messageModal && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900">Thêm tin nhắn</h3>
              <button
                type="button"
                onClick={() => setMessageModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Tin nhắn
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn cho tranh chấp này..."
                  maxLength={500}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {message.length}
                  /500 ký tự
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMessageModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={submitMessage}
                  disabled={isSendingMessage || !message.trim()}
                  className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50"
                >
                  {isSendingMessage
                    ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Đang gửi...
                        </span>
                      )
                    : (
                        'Gửi tin nhắn'
                      )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
