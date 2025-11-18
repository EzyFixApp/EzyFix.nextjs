'use client';

import type {
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
  MapPin,
  Phone,
  Search,
  User,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// Mock data theo đúng structure API từ ServiceRequestManagement.md
const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    requestId: '1fa85f64-5717-4562-b3fc-2c963f66afa6',
    customerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    serviceId: '2fa85f64-5717-4562-b3fc-2c963f66afa6',
    serviceName: 'Sửa điều hòa',
    fullName: 'Nguyễn Văn A',
    phoneNumber: '0901234567',
    requestAddress: '123 Nguyễn Huệ, Q.1, TP.HCM',
    serviceDescription: 'Điều hòa không lạnh, có tiếng kêu lạ',
    addressNote: 'Tầng 3, căn 301',
    requestedDate: '2025-11-15T08:30:00Z',
    expectedStartTime: '2025-11-16T09:00:00Z',
    status: 'QUOTED',
    createdDate: '2025-11-15T08:30:00Z',
    totalOffers: 3,
    acceptedOfferId: null,
    mediaCount: 2,
  },
  {
    requestId: '2fa85f64-5717-4562-b3fc-2c963f66afa7',
    customerId: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    customerName: 'Lê Thị B',
    customerPhone: '0923456789',
    serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    serviceName: 'Sửa máy giặt',
    fullName: 'Lê Thị B',
    phoneNumber: '0923456789',
    requestAddress: '456 Lê Lợi, Q.1, TP.HCM',
    serviceDescription: 'Máy giặt không vắt khô, tiếng ồn khi giặt',
    addressNote: null,
    requestedDate: '2025-11-16T10:00:00Z',
    expectedStartTime: '2025-11-17T14:00:00Z',
    status: 'PENDING',
    createdDate: '2025-11-16T10:00:00Z',
    totalOffers: 0,
    acceptedOfferId: null,
    mediaCount: 1,
  },
  {
    requestId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
    customerId: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
    customerName: 'Trần Văn C',
    customerPhone: '0934567890',
    serviceId: '4fa85f64-5717-4562-b3fc-2c963f66afa8',
    serviceName: 'Sửa tủ lạnh',
    fullName: 'Trần Văn C',
    phoneNumber: '0934567890',
    requestAddress: '789 Hai Bà Trưng, Q.3, TP.HCM',
    serviceDescription: 'Tủ lạnh không đông đá, ngăn mát chạy bình thường',
    addressNote: 'Căn hộ B5-12, gọi trước 30 phút',
    requestedDate: '2025-11-14T15:20:00Z',
    expectedStartTime: '2025-11-15T10:00:00Z',
    status: 'QUOTE_ACCEPTED',
    createdDate: '2025-11-14T15:20:00Z',
    totalOffers: 5,
    acceptedOfferId: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
    mediaCount: 3,
  },
  {
    requestId: '4fa85f64-5717-4562-b3fc-2c963f66afa9',
    customerId: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
    customerName: 'Phạm Thị D',
    customerPhone: '0945678901',
    serviceId: '5fa85f64-5717-4562-b3fc-2c963f66afa9',
    serviceName: 'Sửa bình nóng lạnh',
    fullName: 'Phạm Thị D',
    phoneNumber: '0945678901',
    requestAddress: '321 Võ Văn Tần, Q.3, TP.HCM',
    serviceDescription: 'Bình nóng lạnh không nóng, có mùi khét',
    addressNote: 'Tầng 5, thang máy hỏng',
    requestedDate: '2025-11-13T09:00:00Z',
    expectedStartTime: '2025-11-14T08:00:00Z',
    status: 'COMPLETED',
    createdDate: '2025-11-13T09:00:00Z',
    totalOffers: 2,
    acceptedOfferId: '7fa85f64-5717-4562-b3fc-2c963f66afa10',
    mediaCount: 4,
  },
  {
    requestId: '5fa85f64-5717-4562-b3fc-2c963f66afa10',
    customerId: '7fa85f64-5717-4562-b3fc-2c963f66afa10',
    customerName: 'Hoàng Văn E',
    customerPhone: '0956789012',
    serviceId: '6fa85f64-5717-4562-b3fc-2c963f66afa10',
    serviceName: 'Sửa quạt điều hòa',
    fullName: 'Hoàng Văn E',
    phoneNumber: '0956789012',
    requestAddress: '654 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
    serviceDescription: 'Quạt không quay, đèn báo sáng bình thường',
    addressNote: null,
    requestedDate: '2025-11-12T14:30:00Z',
    expectedStartTime: '2025-11-13T16:00:00Z',
    status: 'CANCELLED',
    createdDate: '2025-11-12T14:30:00Z',
    totalOffers: 1,
    acceptedOfferId: null,
    mediaCount: 0,
  },
  {
    requestId: '6fa85f64-5717-4562-b3fc-2c963f66afa11',
    customerId: '8fa85f64-5717-4562-b3fc-2c963f66afa11',
    customerName: 'Võ Thị F',
    customerPhone: '0967890123',
    serviceId: '7fa85f64-5717-4562-b3fc-2c963f66afa11',
    serviceName: 'Sửa ổ cắm điện',
    fullName: 'Võ Thị F',
    phoneNumber: '0967890123',
    requestAddress: '987 Cách Mạng Tháng 8, Q.10, TP.HCM',
    serviceDescription: 'Ổ cắm phát ra tiếng kêu lạ, có mùi khét nhẹ',
    addressNote: 'Nhà riêng, có chó dữ',
    requestedDate: '2025-11-17T11:00:00Z',
    expectedStartTime: '2025-11-18T13:00:00Z',
    status: 'QUOTE_REJECTED',
    createdDate: '2025-11-17T11:00:00Z',
    totalOffers: 4,
    acceptedOfferId: null,
    mediaCount: 2,
  },
];

export default function ServiceRequestsPage() {
  // State
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(MOCK_SERVICE_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | 'ALL'>('ALL');

  // Modal states
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestDetails, setRequestDetails] = useState<ServiceRequestDetails | null>(null);

  // Form states
  const [cancelReason, setCancelReason] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notifyTechnicians, setNotifyTechnicians] = useState(true);
  const [newStatus, setNewStatus] = useState<ServiceRequestStatus>('PENDING');
  const [updateReason, setUpdateReason] = useState('');
  const [notifyAffectedParties, setNotifyAffectedParties] = useState(false);

  // Filter and search using useMemo
  const filteredRequests = useMemo(() => {
    let filtered = serviceRequests;

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(sr => sr.status === statusFilter);
    }

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        sr =>
          sr.customerName.toLowerCase().includes(term)
          || sr.customerPhone.includes(term)
          || sr.requestAddress.toLowerCase().includes(term)
          || sr.serviceName.toLowerCase().includes(term)
          || sr.requestId.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [serviceRequests, searchTerm, statusFilter]);

  // Helper functions
  const getStatusColor = (status: ServiceRequestStatus): string => {
    const colors: Record<ServiceRequestStatus, string> = {
      PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      QUOTED: 'bg-blue-50 text-blue-700 border-blue-200',
      QUOTE_REJECTED: 'bg-red-50 text-red-700 border-red-200',
      QUOTE_ACCEPTED: 'bg-green-50 text-green-700 border-green-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
      CANCELLED: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[status];
  };

  const getStatusIcon = (status: ServiceRequestStatus) => {
    const icons: Record<ServiceRequestStatus, React.ReactNode> = {
      PENDING: <Clock className="h-5 w-5" />,
      QUOTED: <FileText className="h-5 w-5" />,
      QUOTE_REJECTED: <XCircle className="h-5 w-5" />,
      QUOTE_ACCEPTED: <CheckCircle2 className="h-5 w-5" />,
      COMPLETED: <CheckCircle2 className="h-5 w-5" />,
      CANCELLED: <X className="h-5 w-5" />,
    };
    return icons[status];
  };

  const getStatusText = (status: ServiceRequestStatus): string => {
    const texts: Record<ServiceRequestStatus, string> = {
      PENDING: 'Chờ báo giá',
      QUOTED: 'Đã báo giá',
      QUOTE_REJECTED: 'Từ chối',
      QUOTE_ACCEPTED: 'Đã chấp nhận',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return texts[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Event handlers
  const handleViewDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);

    // Mock detailed data
    const mockDetails: ServiceRequestDetails = {
      requestId: request.requestId,
      customerId: request.customerId,
      customer: {
        userId: request.customerId,
        email: `${request.customerName.toLowerCase().replace(/\s/g, '')}@email.com`,
        firstName: request.customerName.split(' ').pop() || '',
        lastName: request.customerName.split(' ').slice(0, -1).join(' '),
        phone: request.customerPhone,
        avatarLink: null,
        isVerify: true,
      },
      serviceId: request.serviceId,
      service: {
        serviceId: request.serviceId,
        serviceName: request.serviceName,
        categoryName: 'Điện lạnh',
      },
      fullName: request.fullName,
      phoneNumber: request.phoneNumber,
      requestAddress: request.requestAddress,
      serviceDescription: request.serviceDescription,
      addressNote: request.addressNote,
      requestedDate: request.requestedDate,
      expectedStartTime: request.expectedStartTime,
      status: request.status,
      createdDate: request.createdDate,
      offers: [
        {
          offerId: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
          technicianId: '5fa85f64-5717-4562-b3fc-2c963f66afa6',
          technicianName: 'Trần Văn B',
          technicianPhone: '0912345678',
          technicianRating: 4.5,
          estimatedCost: 500000,
          finalCost: 0,
          submitDate: '2025-11-15T09:00:00Z',
          status: 'PENDING',
          notes: 'Có thể là thiếu gas hoặc lỗi dàn nóng',
        },
      ],
      media: [
        {
          mediaId: '7fa85f64-5717-4562-b3fc-2c963f66afa6',
          url: 'https://via.placeholder.com/400',
          mediaType: 'INITIAL',
          uploadedDate: '2025-11-15T08:30:00Z',
        },
      ],
      voucherUsages: [],
      activityLogs: [
        {
          logId: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
          action: 'CREATED',
          performedBy: request.customerName,
          performedAt: request.createdDate,
          oldValue: null,
          newValue: 'PENDING',
        },
      ],
    };

    setRequestDetails(mockDetails);
    setViewDetailsModal(true);
  };

  const handleCancelRequest = () => {
    if (!selectedRequest) {
      return;
    }

    if (cancelReason.length < 10) {
      toast.error('Lý do hủy phải có ít nhất 10 ký tự');
      return;
    }

    // Update status locally
    setServiceRequests(prev =>
      prev.map(sr =>
        sr.requestId === selectedRequest.requestId
          ? { ...sr, status: 'CANCELLED' as ServiceRequestStatus }
          : sr,
      ),
    );

    toast.success('Đã hủy yêu cầu dịch vụ thành công');
    setCancelModal(false);
    setCancelReason('');
    setNotifyCustomer(true);
    setNotifyTechnicians(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedRequest) {
      return;
    }

    if (updateReason.length < 10) {
      toast.error('Lý do cập nhật phải có ít nhất 10 ký tự');
      return;
    }

    if (newStatus === selectedRequest.status) {
      toast.error('Trạng thái mới phải khác trạng thái hiện tại');
      return;
    }

    // Update status locally
    setServiceRequests(prev =>
      prev.map(sr =>
        sr.requestId === selectedRequest.requestId
          ? { ...sr, status: newStatus }
          : sr,
      ),
    );

    toast.success(`Đã cập nhật trạng thái thành ${newStatus}`);
    setUpdateStatusModal(false);
    setUpdateReason('');
    setNotifyAffectedParties(false);
  };

  // Calculate stats
  const stats = {
    total: serviceRequests.length,
    pending: serviceRequests.filter(sr => sr.status === 'PENDING').length,
    quoted: serviceRequests.filter(sr => sr.status === 'QUOTED').length,
    accepted: serviceRequests.filter(sr => sr.status === 'QUOTE_ACCEPTED').length,
    completed: serviceRequests.filter(sr => sr.status === 'COMPLETED').length,
    cancelled: serviceRequests.filter(sr => sr.status === 'CANCELLED').length,
  };

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
            onChange={e => setStatusFilter(e.target.value as ServiceRequestStatus | 'ALL')}
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
          {serviceRequests.length}
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
                      {request.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {request.customerPhone}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {request.requestAddress}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <p className="line-clamp-3 text-sm text-gray-700">
                    {request.serviceDescription}
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
                    {!['CANCELLED', 'COMPLETED'].includes(request.status)
                      ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRequest(request);
                                setUpdateStatusModal(true);
                                setNewStatus(request.status);
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

      {/* View Details Modal */}
      {viewDetailsModal && requestDetails && (
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
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Hình ảnh/Video (
                    {requestDetails.media.length}
                    )
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {requestDetails.media.map(media => (
                      <div key={media.mediaId} className="relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                        <Image
                          src={media.url}
                          alt={media.mediaType}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute right-0 bottom-0 left-0 bg-black/50 px-2 py-1 text-xs text-white">
                          {media.mediaType}
                        </div>
                      </div>
                    ))}
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
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy (tối thiểu 10 ký tự)..."
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {cancelReason.length}
                  /10 ký tự
                </p>
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
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleCancelRequest}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
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
                  onChange={e => setNewStatus(e.target.value as ServiceRequestStatus)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="PENDING">PENDING - Chờ báo giá</option>
                  <option value="QUOTED">QUOTED - Đã báo giá</option>
                  <option value="QUOTE_REJECTED">QUOTE_REJECTED - Từ chối báo giá</option>
                  <option value="QUOTE_ACCEPTED">QUOTE_ACCEPTED - Đã chấp nhận</option>
                  <option value="COMPLETED">COMPLETED - Hoàn thành</option>
                  <option value="CANCELLED">CANCELLED - Đã hủy</option>
                </select>
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
                  onChange={e => setUpdateReason(e.target.value)}
                  placeholder="Nhập lý do cập nhật (tối thiểu 10 ký tự)..."
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {updateReason.length}
                  /10 ký tự
                </p>
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
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
