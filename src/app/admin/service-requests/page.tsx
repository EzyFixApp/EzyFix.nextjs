'use client';

import type {
  GetServiceRequestsParams,
  ServiceRequest,
  ServiceRequestDetails,
  ServiceRequestStatus,
} from '@/types/serviceRequest';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  Search,
  User,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import ServiceRequestService from '@/libs/ServiceRequestService';

export default function ServiceRequestsPage() {
  // State
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, _setCurrentPage] = useState(1);
  const [_totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestDetails, setRequestDetails] = useState<ServiceRequestDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Form states
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notifyTechnicians, setNotifyTechnicians] = useState(true);
  const [newStatus, setNewStatus] = useState<string>('PENDING');
  const [newStatusError, setNewStatusError] = useState('');
  const [updateReason, setUpdateReason] = useState('');
  const [updateReasonError, setUpdateReasonError] = useState('');
  const [notifyAffectedParties, setNotifyAffectedParties] = useState(false);

  // Fetch service requests from API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setIsLoading(true);
        const params: GetServiceRequestsParams = {
          page: currentPage,
          pageSize: 10,
        };

        if (statusFilter !== 'ALL') {
          params.status = statusFilter as any;
        }

        if (searchTerm.trim()) {
          params.searchKeyword = searchTerm.trim();
        }

        const response = await ServiceRequestService.getAllServiceRequests(params);

        console.warn('Service Requests Response:', response.items.map(item => ({
          id: item.requestId,
          status: item.status,
          statusType: typeof item.status,
        })));

        setServiceRequests(response.items);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequests();
  }, [currentPage, statusFilter, searchTerm]);

  // Filter using useMemo
  const filteredRequests = useMemo(() => {
    return serviceRequests;
  }, [serviceRequests]);

  // Normalize status to UPPER_SNAKE_CASE format
  const normalizeStatus = (status: string | null): string | null => {
    if (!status) {
      return null;
    }
    // Convert PascalCase to snake_case first, then uppercase
    // QuoteAccepted -> Quote_Accepted -> QUOTE_ACCEPTED
    // Cancelled -> Cancelled -> CANCELLED
    const snakeCase = status
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // XMLParser -> XML_Parser
      .replace(/([a-z\d])([A-Z])/g, '$1_$2'); // QuoteAccepted -> Quote_Accepted

    const result = snakeCase.toUpperCase();
    console.warn(`normalizeStatus: "${status}" -> "${snakeCase}" -> "${result}"`);
    return result;
  };

  // Helper functions
  const getStatusColor = (status: string | null): string => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'QUOTED':
        return 'bg-blue-100 text-blue-800';
      case 'QUOTE_REJECTED':
        return 'bg-red-100 text-red-800';
      case 'QUOTE_ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string | null) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'PENDING':
        return <Clock className="h-5 w-5" />;
      case 'QUOTED':
        return <FileText className="h-5 w-5" />;
      case 'QUOTE_REJECTED':
        return <XCircle className="h-5 w-5" />;
      case 'QUOTE_ACCEPTED':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'COMPLETED':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'CANCELLED':
        return <X className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string | null): string => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'QUOTED':
        return 'Đã báo giá';
      case 'QUOTE_REJECTED':
        return 'Từ chối báo giá';
      case 'QUOTE_ACCEPTED':
        return 'Chấp nhận báo giá';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status || 'Không xác định';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return '-';
    }
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatus: string | null): ServiceRequestStatus[] => {
    const status = normalizeStatus(currentStatus);
    console.warn('getValidNextStatuses - Original:', currentStatus, 'Normalized:', status);

    switch (status) {
      case 'PENDING':
        // Từ PENDING có thể chuyển sang QUOTED
        return ['QUOTED'];
      case 'QUOTED':
        // Từ QUOTED có thể chuyển sang QUOTE_ACCEPTED hoặc QUOTE_REJECTED
        return ['QUOTE_ACCEPTED', 'QUOTE_REJECTED'];
      case 'QUOTE_REJECTED':
        // Từ QUOTE_REJECTED có thể chuyển sang QUOTED (báo giá lại)
        return ['QUOTED'];
      case 'QUOTE_ACCEPTED':
        // Từ QUOTE_ACCEPTED có thể chuyển sang COMPLETED
        return ['COMPLETED'];
      case 'COMPLETED':
        // COMPLETED là trạng thái cuối, không thể chuyển
        return [];
      case 'CANCELLED':
        // CANCELLED là trạng thái cuối, không thể chuyển
        return [];
      default:
        // Nếu không xác định, cho phép chọn các trạng thái cơ bản (không bao gồm CANCELLED)
        return ['PENDING', 'QUOTED', 'QUOTE_REJECTED', 'QUOTE_ACCEPTED', 'COMPLETED'];
    }
  };

  // Event handlers
  const handleViewDetails = async (request: ServiceRequest) => {
    setSelectedRequest(request);
    setViewDetailsModal(true);
    setIsLoadingDetails(true);

    try {
      const details = await ServiceRequestService.getServiceRequestById(request.requestId);
      setRequestDetails(details);
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Có lỗi xảy ra khi tải chi tiết');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedRequest) {
      return;
    }

    // Reset errors
    setCancelReasonError('');

    // Validate
    if (cancelReason.length < 10) {
      setCancelReasonError('Lý do hủy phải có ít nhất 10 ký tự');
      toast.error('Lý do hủy phải có ít nhất 10 ký tự');
      return;
    }

    setIsCancelling(true);
    try {
      const response = await ServiceRequestService.cancelServiceRequest(
        selectedRequest.requestId,
        {
          reason: cancelReason,
          notifyCustomer,
          notifyTechnicians,
        },
      );

      console.warn('Cancel response:', response);
      toast.success('Đã hủy yêu cầu dịch vụ thành công');

      // Refresh list
      setServiceRequests(prev =>
        prev.map(sr =>
          sr.requestId === selectedRequest.requestId
            ? { ...sr, status: 'CANCELLED' }
            : sr,
        ),
      );

      setCancelModal(false);
      setCancelReason('');
      setCancelReasonError('');
      setNotifyCustomer(true);
      setNotifyTechnicians(true);
    } catch (error: any) {
      console.error('Error cancelling request:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi hủy yêu cầu';
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) {
      return;
    }

    // Reset errors
    setNewStatusError('');
    setUpdateReasonError('');

    // Validate status
    if (!newStatus || newStatus === '') {
      setNewStatusError('Vui lòng chọn trạng thái mới');
      toast.error('Vui lòng chọn trạng thái mới');
      return;
    }

    // Validate reason
    if (updateReason.length < 10) {
      setUpdateReasonError('Lý do cập nhật phải có ít nhất 10 ký tự');
      toast.error('Lý do cập nhật phải có ít nhất 10 ký tự');
      return;
    }

    if (newStatus === selectedRequest.status) {
      toast.error('Trạng thái mới phải khác trạng thái hiện tại');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const response = await ServiceRequestService.updateServiceRequestStatus(
        selectedRequest.requestId,
        {
          newStatus: newStatus as ServiceRequestStatus,
          reason: updateReason,
          notifyAffectedParties,
        },
      );

      console.warn('Update status response:', response);
      toast.success(`Đã cập nhật trạng thái thành ${getStatusText(newStatus)}`);

      // Refresh list
      setServiceRequests(prev =>
        prev.map(sr =>
          sr.requestId === selectedRequest.requestId
            ? { ...sr, status: newStatus as ServiceRequestStatus }
            : sr,
        ),
      );

      setUpdateStatusModal(false);
      setUpdateReason('');
      setUpdateReasonError('');
      setNewStatusError('');
      setNotifyAffectedParties(false);
    } catch (error: any) {
      console.error('Error updating status:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật trạng thái';
      toast.error(errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Calculate stats
  // Calculate stats
  const stats = {
    total: totalItems,
    pending: serviceRequests.filter(sr => normalizeStatus(sr.status) === 'PENDING').length,
    quoted: serviceRequests.filter(sr => normalizeStatus(sr.status) === 'QUOTED').length,
    accepted: serviceRequests.filter(sr => normalizeStatus(sr.status) === 'QUOTE_ACCEPTED').length,
    completed: serviceRequests.filter(sr => normalizeStatus(sr.status) === 'COMPLETED').length,
    cancelled: serviceRequests.filter(sr => normalizeStatus(sr.status) === 'CANCELLED').length,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Đang tải danh sách yêu cầu dịch vụ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Yêu cầu dịch vụ</h2>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý tất cả yêu cầu dịch vụ từ khách hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Tổng số</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Chờ báo giá</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Đã báo giá</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">{stats.quoted}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Đã chấp nhận</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-700" />
            <span className="text-sm font-medium text-gray-600">Hoàn thành</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Đã hủy</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      {/* Search & Filters */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, địa chỉ, dịch vụ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ báo giá</option>
            <option value="QUOTED">Đã báo giá</option>
            <option value="QUOTE_REJECTED">Từ chối báo giá</option>
            <option value="QUOTE_ACCEPTED">Đã chấp nhận</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="CANCELLED">Đã hủy</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Hiển thị
          {' '}
          <span className="font-semibold">{filteredRequests.length}</span>
          {' '}
          /
          {' '}
          {totalItems}
          {' '}
          yêu cầu
        </div>
      </div>

      {/* Service Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0
          ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <p className="text-gray-500">Không tìm thấy yêu cầu dịch vụ nào</p>
              </div>
            )
          : filteredRequests.map(request => (
              <div
                key={request.requestId}
                className="grid grid-cols-[90px_150px_minmax(220px,1fr)_200px_180px_200px] items-center gap-6 rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
              >
                {/* Status */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <span className="text-center text-xs font-medium">
                    {getStatusText(request.status)}
                  </span>
                </div>

                {/* ID & Service */}
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-xs text-gray-500">
                    ID:
                    {' '}
                    {request.requestId.slice(0, 8)}
                    ...
                  </p>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {request.serviceName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {request.totalOffers}
                      {' '}
                      báo giá
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="truncate font-medium text-gray-900">
                      {request.customerName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {request.customerPhone || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {request.requestAddress || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <p className="line-clamp-3 text-sm text-gray-700">
                    {request.serviceDescription || 'Chưa có mô tả'}
                  </p>
                  {request.mediaCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
                      <span className="text-xs text-blue-600">
                        {request.mediaCount}
                        {' '}
                        ảnh/video
                      </span>
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Tạo:</span>
                      <span className="text-xs font-medium text-gray-700">
                        {formatDate(request.createdDate)}
                      </span>
                    </div>
                  </div>
                  {request.expectedStartTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Mong muốn:</span>
                        <span className="text-xs font-medium text-blue-700">
                          {formatDate(request.expectedStartTime)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(request)}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700"
                  >
                    Xem chi tiết
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    {!['CANCELLED', 'COMPLETED'].includes(request.status?.toUpperCase() || '')
                      ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRequest(request);
                                setUpdateStatusModal(true);
                                setNewStatus(''); // Reset to empty so user must choose
                                setUpdateReason('');
                              }}
                              className="rounded-lg border border-blue-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-50"
                            >
                              Đổi trạng thái
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRequest(request);
                                setCancelModal(true);
                              }}
                              className="rounded-lg border border-red-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-red-600 transition-colors hover:bg-red-50"
                            >
                              Hủy
                            </button>
                          </>
                        )
                      : (
                          <>
                            <div />
                            <div />
                          </>
                        )}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {_totalPages > 1 && !isLoading && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-4">
          <button
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage === 1}
            type="button"
            onClick={() => _setCurrentPage(currentPage - 1)}
          >
            Trước
          </button>
          {Array.from({ length: _totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
              type="button"
              onClick={() => _setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage >= _totalPages}
            type="button"
            onClick={() => _setCurrentPage(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết yêu cầu dịch vụ</h2>
              <button
                type="button"
                onClick={() => setViewDetailsModal(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            {isLoadingDetails
              ? (
                  <div className="flex h-[400px] items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
                      <p className="text-gray-600">Đang tải chi tiết...</p>
                    </div>
                  </div>
                )
              : requestDetails && (
                <div className="space-y-6 p-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium text-gray-600">Request ID</div>
                        <p className="font-mono text-sm text-gray-900">{requestDetails.requestId}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Trạng thái</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm font-medium ${getStatusColor(requestDetails.status)}`}>
                            {getStatusIcon(requestDetails.status)}
                            {getStatusText(requestDetails.status)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Dịch vụ</div>
                        <p className="text-sm text-gray-900">{requestDetails.service.serviceName}</p>
                        <p className="text-xs text-gray-500">{requestDetails.service.categoryName}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Ngày tạo</div>
                        <p className="text-sm text-gray-900">{formatDate(requestDetails.createdDate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Thông tin khách hàng</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-sm font-medium text-gray-600">Họ tên</div>
                        <p className="text-sm text-gray-900">
                          {requestDetails.customer.lastName}
                          {' '}
                          {requestDetails.customer.firstName}
                        </p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Email</div>
                        <p className="text-sm text-gray-900">{requestDetails.customer.email}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Số điện thoại</div>
                        <p className="text-sm text-gray-900">{requestDetails.phoneNumber}</p>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Trạng thái xác thực</div>
                        <p className="text-sm text-gray-900">
                          {requestDetails.customer.isVerify ? '✅ Đã xác thực' : '❌ Chưa xác thực'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Chi tiết yêu cầu</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-600">Địa chỉ sửa chữa</div>
                        <p className="text-sm text-gray-900">{requestDetails.requestAddress}</p>
                        {requestDetails.addressNote && (
                          <p className="text-xs text-gray-500">
                            Ghi chú:
                            {' '}
                            {requestDetails.addressNote}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Mô tả vấn đề</div>
                        <p className="text-sm text-gray-900">{requestDetails.serviceDescription}</p>
                      </div>
                      {requestDetails.expectedStartTime && (
                        <div>
                          <div className="text-sm font-medium text-gray-600">Thời gian mong muốn</div>
                          <p className="text-sm text-gray-900">{formatDate(requestDetails.expectedStartTime)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Offers */}
                  {requestDetails.offers.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">
                        Báo giá (
                        {requestDetails.offers.length}
                        )
                      </h3>
                      <div className="space-y-3">
                        {requestDetails.offers.map(offer => (
                          <div key={offer.offerId} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <div className="text-sm font-medium text-gray-600">Thợ</div>
                                <p className="text-sm font-medium text-gray-900">{offer.technicianName}</p>
                                <p className="text-xs text-gray-500">{offer.technicianPhone}</p>
                                <p className="text-xs text-yellow-600">
                                  ⭐
                                  {' '}
                                  {offer.technicianRating.toFixed(1)}
                                </p>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-600">Giá dự kiến</div>
                                <p className="text-lg font-bold text-blue-600">
                                  {offer.estimatedCost.toLocaleString('vi-VN')}
                                  {' '}
                                  đ
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <div className="text-sm font-medium text-gray-600">Ghi chú</div>
                                <p className="text-sm text-gray-700">{offer.notes || 'Không có ghi chú'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media */}
                  {requestDetails.media.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Ảnh/Video đính kèm</h3>
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            Có kèm
                            {' '}
                            {requestDetails.media.length}
                            {' '}
                            ảnh/video
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Logs */}
                  {requestDetails.activityLogs.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Lịch sử hoạt động</h3>
                      <div className="space-y-2">
                        {requestDetails.activityLogs.map(log => (
                          <div key={log.logId} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                            <div className="mt-1 rounded-full bg-blue-100 p-1">
                              <AlertCircle className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{log.action}</p>
                              <p className="text-xs text-gray-600">
                                Bởi:
                                {' '}
                                {log.performedBy}
                                {' '}
                                -
                                {' '}
                                {formatDate(log.performedAt)}
                              </p>
                              {log.oldValue && (
                                <p className="text-xs text-gray-500">
                                  {log.oldValue}
                                  {' '}
                                  →
                                  {' '}
                                  {log.newValue}
                                </p>
                              )}
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
      )}

      {/* Cancel Modal */}
      {cancelModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Hủy yêu cầu dịch vụ</h2>

            <div className="mb-4 rounded-lg bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                <strong>Cảnh báo:</strong>
                {' '}
                Bạn đang hủy yêu cầu dịch vụ của
                {' '}
                {selectedRequest.customerName}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700">
                  Lý do hủy
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="cancel-reason"
                  rows={4}
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (cancelReasonError) {
                      setCancelReasonError('');
                    }
                  }}
                  placeholder="Nhập lý do hủy (tối thiểu 10 ký tự)..."
                  className={`mt-1 w-full rounded-lg border p-2 text-sm focus:ring-1 focus:outline-none ${
                    cancelReasonError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {cancelReasonError
                  ? (
                      <p className="mt-1 text-xs text-red-600">
                        {cancelReasonError}
                      </p>
                    )
                  : (
                      <p className="mt-1 text-xs text-gray-500">
                        {cancelReason.length}
                        /10 ký tự
                      </p>
                    )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyCustomer}
                    onChange={e => setNotifyCustomer(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Gửi thông báo cho khách hàng</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyTechnicians}
                    onChange={e => setNotifyTechnicians(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Gửi thông báo cho các thợ đã báo giá</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCancelModal(false);
                  setCancelReason('');
                }}
                disabled={isCancelling}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleCancelRequest}
                disabled={isCancelling}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateStatusModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Cập nhật trạng thái</h2>

            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Trạng thái hiện tại:
                {' '}
                <strong>{getStatusText(selectedRequest.status)}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="new-status" className="block text-sm font-medium text-gray-700">
                  Trạng thái mới
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => {
                    setNewStatus(e.target.value as ServiceRequestStatus);
                    if (newStatusError) {
                      setNewStatusError('');
                    }
                  }}
                  className={`mt-1 w-full rounded-lg border px-4 py-2 focus:ring-1 focus:outline-none ${
                    newStatusError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  <option value="" disabled>-- Chọn trạng thái --</option>
                  {getValidNextStatuses(selectedRequest.status).map(status => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
                {newStatusError
                  ? (
                      <p className="mt-1 text-xs text-red-600">
                        {newStatusError}
                      </p>
                    )
                  : (
                      <p className="mt-1 text-xs text-gray-500">
                        Trạng thái hiện tại:
                        {' '}
                        <strong>{getStatusText(selectedRequest.status)}</strong>
                      </p>
                    )}
              </div>

              <div>
                <label htmlFor="update-reason" className="block text-sm font-medium text-gray-700">
                  Lý do cập nhật
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="update-reason"
                  rows={4}
                  value={updateReason}
                  onChange={(e) => {
                    setUpdateReason(e.target.value);
                    if (updateReasonError) {
                      setUpdateReasonError('');
                    }
                  }}
                  placeholder="Nhập lý do cập nhật (tối thiểu 10 ký tự)..."
                  className={`mt-1 w-full rounded-lg border p-2 text-sm focus:ring-1 focus:outline-none ${
                    updateReasonError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {updateReasonError
                  ? (
                      <p className="mt-1 text-xs text-red-600">
                        {updateReasonError}
                      </p>
                    )
                  : (
                      <p className="mt-1 text-xs text-gray-500">
                        {updateReason.length}
                        /10 ký tự
                      </p>
                    )}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifyAffectedParties}
                  onChange={e => setNotifyAffectedParties(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Gửi thông báo cho các bên liên quan</span>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setUpdateStatusModal(false);
                  setUpdateReason('');
                }}
                disabled={isUpdatingStatus}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
