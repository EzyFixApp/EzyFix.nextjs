'use client';

import type {
  Appointment,
  AppointmentDetails,
  AppointmentStatus,
  GetAppointmentsParams,
} from '@/types/appointment';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
  UserCog,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppointmentService } from '@/libs/AppointmentService';

export default function AppointmentsPage() {
  // State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, _setCurrentPage] = useState(1);
  const [_totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [reassignModal, setReassignModal] = useState(false);
  const [updateStatusModal, setUpdateStatusModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Cancel form
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [notifyTechnician, setNotifyTechnician] = useState(true);
  const [penalizeTechnician, setPenalizeTechnician] = useState(false);

  // Reassign form
  const [newTechnicianId, setNewTechnicianId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [notifyOldTechnician, setNotifyOldTechnician] = useState(true);
  const [notifyNewTechnician, setNotifyNewTechnician] = useState(true);
  const [notifyCustomerReassign, setNotifyCustomerReassign] = useState(true);
  const [adjustPrice, setAdjustPrice] = useState(false);
  const [newEstimatedCost, setNewEstimatedCost] = useState(0);

  // Update status form
  const [newStatus, setNewStatus] = useState<AppointmentStatus | ''>('');
  const [updateReason, setUpdateReason] = useState('');
  const [skipValidation, setSkipValidation] = useState(true);

  // Validation errors
  const [cancelReasonError, setCancelReasonError] = useState('');
  const [reassignReasonError, setReassignReasonError] = useState('');
  const [newTechnicianIdError, setNewTechnicianIdError] = useState('');
  const [updateReasonError, setUpdateReasonError] = useState('');
  const [newStatusError, setNewStatusError] = useState('');

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const params: GetAppointmentsParams = {
          page: currentPage,
          pageSize: 20,
        };

        if (statusFilter !== 'ALL') {
          params.status = statusFilter;
        }

        if (searchTerm.trim()) {
          params.searchKeyword = searchTerm.trim();
        }

        if (showOnlyIssues) {
          params.hasIssues = true;
        }

        const response = await AppointmentService.getAllAppointments(params);

        console.warn('Appointments Response:', response.items.map(item => ({
          id: item.appointmentId,
          status: item.status,
        })));

        setAppointments(response.items);
        setTotalPages(response.pagination.totalPages);
        setTotalItems(response.pagination.totalItems);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentPage, statusFilter, searchTerm, showOnlyIssues]);

  // Normalize status to UPPER_SNAKE_CASE format
  const normalizeStatus = (status: string | null): string | null => {
    if (!status) {
      return null;
    }
    // Convert PascalCase to snake_case first, then uppercase
    // Scheduled -> SCHEDULED, EnRoute -> EN_ROUTE
    const snakeCase = status
      .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2');

    return snakeCase.toUpperCase();
  };

  // Status badge color
  const getStatusColor = (status: string | null): string => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'EN_ROUTE':
        return 'bg-purple-100 text-purple-800';
      case 'ARRIVED':
        return 'bg-cyan-100 text-cyan-800';
      case 'CHECKING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PRICE_REVIEW':
        return 'bg-orange-100 text-orange-800';
      case 'REPAIRING':
        return 'bg-indigo-100 text-indigo-800';
      case 'REPAIRED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'DISPUTE':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icon
  const getStatusIcon = (status: string | null) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'SCHEDULED':
        return <Calendar className="h-5 w-5" />;
      case 'EN_ROUTE':
        return <Navigation className="h-5 w-5" />;
      case 'ARRIVED':
        return <MapPin className="h-5 w-5" />;
      case 'CHECKING':
        return <Search className="h-5 w-5" />;
      case 'PRICE_REVIEW':
        return <AlertTriangle className="h-5 w-5" />;
      case 'REPAIRING':
        return <Wrench className="h-5 w-5" />;
      case 'REPAIRED':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'CANCELLED':
        return <X className="h-5 w-5" />;
      case 'ABSENT':
        return <XCircle className="h-5 w-5" />;
      case 'DISPUTE':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  // Status text in Vietnamese
  const getStatusText = (status: string | null): string => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'EN_ROUTE':
        return 'Đang di chuyển';
      case 'ARRIVED':
        return 'Đã đến';
      case 'CHECKING':
        return 'Đang kiểm tra';
      case 'PRICE_REVIEW':
        return 'Xem xét giá';
      case 'REPAIRING':
        return 'Đang sửa chữa';
      case 'REPAIRED':
        return 'Đã sửa xong';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'ABSENT':
        return 'Không có mặt';
      case 'DISPUTE':
        return 'Tranh chấp';
      default:
        return status || 'Không xác định';
    }
  };

  // Get valid next statuses based on current status
  const getValidNextStatuses = (currentStatus: string | null): AppointmentStatus[] => {
    const normalized = normalizeStatus(currentStatus);
    switch (normalized) {
      case 'SCHEDULED':
        return ['EN_ROUTE', 'ABSENT'];
      case 'EN_ROUTE':
        return ['ARRIVED', 'ABSENT'];
      case 'ARRIVED':
        return ['CHECKING'];
      case 'CHECKING':
        return ['PRICE_REVIEW', 'REPAIRING'];
      case 'PRICE_REVIEW':
        return ['REPAIRING', 'DISPUTE'];
      case 'REPAIRING':
        return ['REPAIRED', 'DISPUTE'];
      case 'REPAIRED':
        return [];
      case 'CANCELLED':
        return [];
      case 'ABSENT':
        return ['SCHEDULED'];
      case 'DISPUTE':
        return ['REPAIRING', 'CANCELLED'];
      default:
        return [];
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return '-';
    }
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // View details handler
  const handleViewDetails = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewDetailsModal(true);
    setIsLoadingDetails(true);

    try {
      const details = await AppointmentService.getAppointmentById(appointment.appointmentId);
      console.warn('Appointment Details Response:', details);
      console.warn('Timeline data:', details.timeline);
      console.warn('ActivityLogs data:', details.activityLogs);
      setAppointmentDetails(details);
    } catch (error: any) {
      console.error('Error fetching appointment details:', error);
      const backendReason = error?.response?.data?.reason;
      const errorMsg = error?.response?.status === 500
        ? backendReason === 'Object reference not set to an instance of an object.'
          ? `Lỗi backend: Thiếu dữ liệu cho appointment ở trạng thái ${getStatusText(appointment.status)}. Vui lòng liên hệ backend team.`
          : `Lỗi server: ${backendReason || 'Không xác định'}`
        : 'Có lỗi xảy ra khi tải chi tiết';
      toast.error(errorMsg);
      setViewDetailsModal(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Cancel handler
  const [isCancelling, setIsCancelling] = useState(false);
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) {
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

    try {
      setIsCancelling(true);
      const cancelRequest = {
        reason: cancelReason,
        refundAmount,
        notifyCustomer,
        notifyTechnician,
        penalizeTechnician,
      };
      console.warn('Cancel request:', cancelRequest);
      await AppointmentService.cancelAppointment(selectedAppointment.appointmentId, cancelRequest);

      toast.success('Đã hủy lịch hẹn thành công');
      setCancelModal(false);
      setCancelReason('');
      setCancelReasonError('');
      setRefundAmount(0);
      setNotifyCustomer(true);
      setNotifyTechnician(true);
      setPenalizeTechnician(false);
      setSelectedAppointment(null);

      // Reload appointments
      const params: GetAppointmentsParams = { page: currentPage, pageSize: 20 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const response = await AppointmentService.getAllAppointments(params);
      setAppointments(response.items);
    } catch (error: any) {
      console.error('Error cancelling appointment:', error);
      const errorMsg = error?.response?.data?.reason || error?.message || 'Không thể hủy lịch hẹn';
      toast.error(errorMsg);
    } finally {
      setIsCancelling(false);
    }
  };

  // Reassign handler
  const [isReassigning, setIsReassigning] = useState(false);
  const handleReassignAppointment = async () => {
    if (!selectedAppointment) {
      return;
    }

    // Reset errors
    setReassignReasonError('');
    setNewTechnicianIdError('');

    // Validate
    let hasError = false;
    if (newTechnicianId.trim() === '') {
      setNewTechnicianIdError('ID thợ mới không được để trống');
      hasError = true;
    }
    if (reassignReason.length < 10) {
      setReassignReasonError('Lý do đổi thợ phải có ít nhất 10 ký tự');
      hasError = true;
    }

    if (hasError) {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    try {
      setIsReassigning(true);
      await AppointmentService.reassignAppointment(selectedAppointment.appointmentId, {
        newTechnicianId,
        reason: reassignReason,
        notifyOldTechnician,
        notifyNewTechnician,
        notifyCustomer: notifyCustomerReassign,
        adjustPrice,
        newEstimatedCost: adjustPrice && newEstimatedCost > 0 ? newEstimatedCost : undefined,
      });

      toast.success('Đã chuyển thợ thành công');
      setReassignModal(false);
      setNewTechnicianId('');
      setNewTechnicianIdError('');
      setReassignReason('');
      setReassignReasonError('');
      setNotifyOldTechnician(true);
      setNotifyNewTechnician(true);
      setNotifyCustomerReassign(true);
      setAdjustPrice(false);
      setNewEstimatedCost(0);
      setSelectedAppointment(null);

      // Reload appointments
      const params: GetAppointmentsParams = { page: currentPage, pageSize: 20 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const response = await AppointmentService.getAllAppointments(params);
      setAppointments(response.items);
    } catch (error: any) {
      console.error('Error reassigning appointment:', error);
      const errorMsg = error?.response?.data?.reason || error?.message || 'Không thể chuyển thợ';
      toast.error(errorMsg);
    } finally {
      setIsReassigning(false);
    }
  };

  // Update status handler
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const handleUpdateStatus = async () => {
    if (!selectedAppointment) {
      return;
    }

    // Reset errors
    setNewStatusError('');
    setUpdateReasonError('');

    // Validate
    let hasError = false;
    if (!newStatus) {
      setNewStatusError('Vui lòng chọn trạng thái mới');
      hasError = true;
    }
    if (updateReason.length < 10) {
      setUpdateReasonError('Lý do cập nhật phải có ít nhất 10 ký tự');
      hasError = true;
    }

    if (hasError) {
      toast.error('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    try {
      setIsUpdatingStatus(true);

      // Convert status to PascalCase format that backend expects
      const statusToPascalCase: Record<AppointmentStatus, string> = {
        SCHEDULED: 'Scheduled',
        EN_ROUTE: 'EnRoute',
        ARRIVED: 'Arrived',
        CHECKING: 'Checking',
        PRICE_REVIEW: 'PriceReview',
        REPAIRING: 'Repairing',
        REPAIRED: 'Repaired',
        CANCELLED: 'Cancelled',
        ABSENT: 'Absent',
        DISPUTE: 'Dispute',
      };

      const requestData = {
        newStatus: statusToPascalCase[newStatus as AppointmentStatus],
        reason: updateReason,
        skipValidation,
      };
      console.warn('Update status request:', requestData);
      await AppointmentService.updateStatus(selectedAppointment.appointmentId, requestData as any);

      toast.success('Đã cập nhật trạng thái thành công');
      setUpdateStatusModal(false);
      setNewStatus('');
      setNewStatusError('');
      setUpdateReason('');
      setUpdateReasonError('');
      setSkipValidation(true);
      setSelectedAppointment(null);

      // Reload appointments
      const params: GetAppointmentsParams = { page: currentPage, pageSize: 20 };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const response = await AppointmentService.getAllAppointments(params);
      setAppointments(response.items);
    } catch (error: any) {
      console.error('Error updating status:', error);
      console.error('Response data:', error?.response?.data);
      console.error('Full error details:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });
      const errorMsg = error?.response?.data?.reason
        || error?.response?.data?.message
        || error?.message
        || 'Không thể cập nhật trạng thái';
      toast.error(errorMsg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Calculate stats
  const stats = {
    total: totalItems,
    scheduled: appointments.filter(a => normalizeStatus(a.status) === 'SCHEDULED').length,
    enRoute: appointments.filter(a => normalizeStatus(a.status) === 'EN_ROUTE').length,
    repairing: appointments.filter(a => normalizeStatus(a.status) === 'REPAIRING').length,
    completed: appointments.filter(a => normalizeStatus(a.status) === 'REPAIRED').length,
    issues: appointments.filter(a => a.hasDispute || a.issueFlags.length > 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h2>
          <p className="mt-1 text-sm text-gray-600">
            Theo dõi và can thiệp vào tất cả appointments trong hệ thống
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng số</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đã lên lịch</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang di chuyển</p>
              <p className="text-2xl font-bold text-purple-600">{stats.enRoute}</p>
            </div>
            <Navigation className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang sửa</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.repairing}</p>
            </div>
            <Wrench className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Có vấn đề</p>
              <p className="text-2xl font-bold text-red-600">{stats.issues}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, địa chỉ, ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as AppointmentStatus | 'ALL')}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SCHEDULED">Đã đặt</option>
            <option value="EN_ROUTE">Đang đến</option>
            <option value="ARRIVED">Đã đến</option>
            <option value="CHECKING">Đang kiểm tra</option>
            <option value="PRICE_REVIEW">Đang báo giá</option>
            <option value="REPAIRING">Đang sửa</option>
            <option value="REPAIRED">Đã sửa xong</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="ABSENT">Vắng mặt</option>
            <option value="DISPUTE">Tranh chấp</option>
          </select>

          {/* Issues filter */}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2">
            <input
              type="checkbox"
              checked={showOnlyIssues}
              onChange={e => setShowOnlyIssues(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Chỉ xem có vấn đề</span>
          </label>

          {/* Results count */}
          <div className="flex items-center justify-end text-sm text-gray-600">
            Hiển thị
            {' '}
            {appointments.length}
            {' '}
            /
            {' '}
            {totalItems}
            {' '}
            lịch hẹn
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3 overflow-x-auto">
        {isLoading
          ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-blue-500" />
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            )
          : appointments.length === 0
            ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="text-gray-500">Không tìm thấy lịch hẹn nào</p>
                </div>
              )
            : appointments.map(appointment => (
                <div
                  key={appointment.appointmentId}
                  className="grid min-w-max grid-cols-[90px_150px_minmax(220px,1fr)_200px_220px_160px_200px] items-center gap-6 rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
                >
                  {/* Status Icon with Badge */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                    </div>
                    <span className="text-center text-xs font-medium text-gray-600">
                      {getStatusText(appointment.status)}
                    </span>
                  </div>

                  {/* ID & Status Flags */}
                  <div className="flex flex-col gap-1.5">
                    <p className="font-mono text-xs text-gray-500">
                      ID:
                      {' '}
                      {appointment.appointmentId.slice(0, 8)}
                      ...
                    </p>
                    <div className="flex flex-col gap-1">
                      {appointment.hasDispute && (
                        <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          <AlertTriangle className="h-3 w-3" />
                          Tranh chấp
                        </span>
                      )}
                      {appointment.issueFlags.map((flag) => {
                        const isOverdue = flag.toUpperCase() === 'OVERDUE';
                        return (
                          <span
                            key={flag}
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              isOverdue
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {flag}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="truncate font-medium text-gray-900">
                        {appointment.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {appointment.customerPhone}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {appointment.serviceAddress}
                      </p>
                    </div>
                  </div>

                  {/* Technician Info */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span className="truncate font-medium text-gray-900">
                        {appointment.technicianName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                      <span className="text-sm text-gray-600">
                        {appointment.technicianPhone}
                      </span>
                    </div>
                  </div>

                  {/* Schedule & GPS */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Hẹn:
                        {' '}
                        {new Date(appointment.scheduledDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {appointment.actualStartTime && (
                      <p className="text-xs text-gray-500">
                        Bắt đầu:
                        {' '}
                        {new Date(appointment.actualStartTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' '}
                        {new Date(appointment.actualStartTime).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </p>
                    )}
                    {appointment.lastGpsUpdate && (
                      <div className="flex items-center gap-1.5">
                        <Navigation className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs text-green-600">
                          GPS:
                          {' '}
                          {new Date(appointment.lastGpsUpdate).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-xs text-gray-500">Giá dự kiến</p>
                    <p className="font-semibold text-gray-700">
                      {formatCurrency(appointment.estimatedCost)}
                    </p>
                    {appointment.finalCost !== appointment.estimatedCost && (
                      <>
                        <p className="text-xs text-gray-500">Giá cuối cùng</p>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(appointment.finalCost)}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewDetails(appointment)}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {['CANCELLED', 'REPAIRED', 'DISPUTE'].includes(normalizeStatus(appointment.status) || '')
                        ? (
                            <>
                              <div />
                              <div />
                            </>
                          )
                        : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setNewStatus('');
                                  setUpdateReason('');
                                  setSkipValidation(true);
                                  setNewStatusError('');
                                  setUpdateReasonError('');
                                  setUpdateStatusModal(true);
                                }}
                                className="rounded-lg border border-green-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-green-600 transition-colors hover:bg-green-50"
                              >
                                Đổi trạng thái
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setReassignModal(true);
                                }}
                                className="rounded-lg border border-blue-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-50"
                              >
                                Đổi thợ
                              </button>
                            </>
                          )}
                    </div>

                    {!['CANCELLED', 'REPAIRED', 'ABSENT', 'DISPUTE'].includes(normalizeStatus(appointment.status) || '') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setCancelModal(true);
                        }}
                        className="w-full rounded-lg border border-red-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-red-600 transition-colors hover:bg-red-50"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              ))}
      </div>

      {/* View Details Modal */}
      {viewDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Chi tiết Lịch Hẹn</h2>
              <button
                type="button"
                onClick={() => setViewDetailsModal(false)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingDetails
              ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
                      <p className="text-gray-600">Đang tải chi tiết...</p>
                    </div>
                  </div>
                )
              : appointmentDetails && (
                <div className="space-y-6">
                  {/* Customer & Technician */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">Khách hàng</h3>
                      <div className="flex items-start gap-3">
                        {appointmentDetails.customer.avatarLink
                          ? (
                              <Image
                                src={appointmentDetails.customer.avatarLink}
                                alt={appointmentDetails.customer.fullName}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full"
                                unoptimized
                              />
                            )
                          : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                {appointmentDetails.customer.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                        <div>
                          <p className="font-medium text-gray-800">{appointmentDetails.customer.fullName}</p>
                          <p className="text-sm text-gray-500">{appointmentDetails.customer.email}</p>
                          <p className="text-sm text-gray-500">{appointmentDetails.customer.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">Thợ sửa chữa</h3>
                      <div className="flex items-start gap-3">
                        {appointmentDetails.technician.avatarLink
                          ? (
                              <Image
                                src={appointmentDetails.technician.avatarLink}
                                alt={appointmentDetails.technician.fullName}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full"
                                unoptimized
                              />
                            )
                          : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                                {appointmentDetails.technician.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                        <div>
                          <p className="font-medium text-gray-800">{appointmentDetails.technician.fullName}</p>
                          <p className="text-sm text-gray-500">{appointmentDetails.technician.email}</p>
                          <p className="text-sm text-gray-500">{appointmentDetails.technician.phone}</p>
                          <p className="text-sm text-yellow-600">
                            ⭐
                            {' '}
                            {appointmentDetails.technician.rating}
                            {' '}
                            (
                            {appointmentDetails.technician.totalJobs}
                            {' '}
                            việc)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Request */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">Yêu cầu dịch vụ</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Dịch vụ:</span>
                        {' '}
                        {appointmentDetails.serviceRequest.serviceName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Mô tả:</span>
                        {' '}
                        {appointmentDetails.serviceRequest.serviceDescription}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Địa chỉ:</span>
                        {' '}
                        {appointmentDetails.serviceRequest.requestAddress}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">Ghi chú địa chỉ:</span>
                        {' '}
                        {appointmentDetails.serviceRequest.addressNote}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">Giá cả</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Giá dự kiến:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(appointmentDetails.pricing.estimatedCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Giá cuối cùng:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(appointmentDetails.pricing.finalCost)}</span>
                      </div>
                      {appointmentDetails.pricing.priceAdjustmentReason && (
                        <p className="text-sm text-orange-600">
                          Lý do điều chỉnh:
                          {' '}
                          {appointmentDetails.pricing.priceAdjustmentReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  {appointmentDetails.payment && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="mb-3 text-sm font-semibold text-gray-700">Thanh toán</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Phương thức:</span>
                          <span className="font-medium text-gray-800">{appointmentDetails.payment.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Trạng thái:</span>
                          <span className="font-medium text-green-600">{appointmentDetails.payment.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Số tiền:</span>
                          <span className="font-bold text-gray-800">{formatCurrency(appointmentDetails.payment.amount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Logs (Timeline) */}
                  <div className="rounded-lg border border-gray-200 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">Lịch sử trạng thái</h3>
                    <div className="space-y-3">
                      {appointmentDetails.activityLogs && appointmentDetails.activityLogs.length > 0
                        ? (
                            appointmentDetails.activityLogs
                              .sort((a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime())
                              .map(item => (
                                <div key={item.logId} className="flex items-start gap-3">
                                  <div className={`rounded-full p-2 ${getStatusColor(normalizeStatus(item.newValue || ''))}`}>
                                    {getStatusIcon(normalizeStatus(item.newValue || ''))}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <span className="font-medium text-gray-800">{item.newValue}</span>
                                        {item.oldValue && (
                                          <span className="ml-2 text-xs text-gray-500">
                                            (từ
                                            {' '}
                                            {item.oldValue}
                                            )
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-gray-500">{formatDate(item.performedAt)}</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      {item.action}
                                      {' '}
                                      bởi
                                      {' '}
                                      {item.performedBy}
                                    </p>
                                  </div>
                                </div>
                              ))
                          )
                        : (
                            <p className="text-sm text-gray-500">Chưa có lịch sử trạng thái</p>
                          )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setViewDetailsModal(false)}
                      className="rounded-lg bg-gray-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Hủy Lịch Hẹn</h2>
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-800">
                Bạn đang hủy lịch hẹn của khách hàng
                {' '}
                <strong>{selectedAppointment.customerName}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Lý do hủy
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (cancelReasonError) {
                      setCancelReasonError('');
                    }
                  }}
                  placeholder="Nhập lý do hủy (tối thiểu 10 ký tự)"
                  rows={3}
                  className={`w-full rounded-lg border p-3 focus:outline-none ${
                    cancelReasonError
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {cancelReasonError && (
                  <p className="mt-1 text-xs text-red-600">{cancelReasonError}</p>
                )}
              </div>

              <div>
                <label htmlFor="refund-amount" className="mb-1 block text-sm font-medium text-gray-700">
                  Số tiền hoàn lại (VND)
                </label>
                <input
                  id="refund-amount"
                  type="number"
                  value={refundAmount}
                  onChange={e => setRefundAmount(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyCustomer}
                    onChange={e => setNotifyCustomer(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Thông báo khách hàng</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyTechnician}
                    onChange={e => setNotifyTechnician(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Thông báo thợ sửa</span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={penalizeTechnician}
                    onChange={e => setPenalizeTechnician(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Phạt thợ (ghi nhận vi phạm)</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                disabled={isCancelling}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleCancelAppointment}
                disabled={isCancelling}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                {isCancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {reassignModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Chỉ định Thợ Mới</h2>
              <button
                type="button"
                onClick={() => setReassignModal(false)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Thợ hiện tại:
                {' '}
                <strong>{selectedAppointment.technicianName}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  ID Thợ mới
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTechnicianId}
                  onChange={(e) => {
                    setNewTechnicianId(e.target.value);
                    if (newTechnicianIdError) {
                      setNewTechnicianIdError('');
                    }
                  }}
                  placeholder="Nhập ID thợ mới (GUID)"
                  className={`w-full rounded-lg border p-3 focus:outline-none ${
                    newTechnicianIdError
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {newTechnicianIdError && (
                  <p className="mt-1 text-xs text-red-600">{newTechnicianIdError}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Lý do đổi thợ
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reassignReason}
                  onChange={(e) => {
                    setReassignReason(e.target.value);
                    if (reassignReasonError) {
                      setReassignReasonError('');
                    }
                  }}
                  placeholder="Nhập lý do đổi thợ (tối thiểu 10 ký tự)"
                  rows={3}
                  className={`w-full rounded-lg border p-3 focus:outline-none ${
                    reassignReasonError
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {reassignReasonError && (
                  <p className="mt-1 text-xs text-red-600">{reassignReasonError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyOldTechnician}
                    onChange={e => setNotifyOldTechnician(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Thông báo thợ cũ
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyNewTechnician}
                    onChange={e => setNotifyNewTechnician(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Thông báo thợ mới
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyCustomerReassign}
                    onChange={e => setNotifyCustomerReassign(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Thông báo khách hàng
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={adjustPrice}
                    onChange={e => setAdjustPrice(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Điều chỉnh giá ước tính
                  </span>
                </label>
              </div>

              {adjustPrice && (
                <div>
                  <label
                    htmlFor="newEstimatedCost"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Giá ước tính mới (VND)
                  </label>
                  <input
                    id="newEstimatedCost"
                    type="number"
                    value={newEstimatedCost}
                    onChange={e => setNewEstimatedCost(Number(e.target.value))}
                    placeholder="Nhập giá ước tính mới"
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReassignModal(false)}
                disabled={isReassigning}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleReassignAppointment}
                disabled={isReassigning}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReassigning && <Loader2 className="h-4 w-4 animate-spin" />}
                {isReassigning ? 'Đang xử lý...' : 'Xác nhận đổi thợ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {updateStatusModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Cập nhật trạng thái</h2>
              <button
                type="button"
                onClick={() => setUpdateStatusModal(false)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Appointment ID:
                {' '}
                <strong>
                  {selectedAppointment.appointmentId.slice(0, 16)}
                  ...
                </strong>
              </p>
              <p className="text-sm text-blue-800">
                Trạng thái hiện tại:
                {' '}
                <strong>{getStatusText(selectedAppointment.status)}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="new-status" className="mb-1 block text-sm font-medium text-gray-700">
                  Trạng thái mới
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="new-status"
                  value={newStatus}
                  onChange={(e) => {
                    setNewStatus(e.target.value as AppointmentStatus | '');
                    if (newStatusError) {
                      setNewStatusError('');
                    }
                  }}
                  className={`w-full rounded-lg border p-3 focus:outline-none ${
                    newStatusError
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="" disabled>-- Chọn trạng thái --</option>
                  {getValidNextStatuses(selectedAppointment.status).map(status => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
                {newStatusError && (
                  <p className="mt-1 text-xs text-red-600">{newStatusError}</p>
                )}
                {getValidNextStatuses(selectedAppointment.status).length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    Không có trạng thái tiếp theo hợp lệ. Vui lòng bật "Bỏ qua kiểm tra" để cập nhật.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Lý do thay đổi
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={updateReason}
                  onChange={(e) => {
                    setUpdateReason(e.target.value);
                    if (updateReasonError) {
                      setUpdateReasonError('');
                    }
                  }}
                  placeholder="Nhập lý do thay đổi trạng thái (tối thiểu 10 ký tự)"
                  rows={3}
                  className={`w-full rounded-lg border p-3 focus:outline-none ${
                    updateReasonError
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {updateReasonError && (
                  <p className="mt-1 text-xs text-red-600">{updateReasonError}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={skipValidation}
                  onChange={e => setSkipValidation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Bỏ qua kiểm tra luồng trạng thái</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setUpdateStatusModal(false)}
                disabled={isUpdatingStatus}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
                {isUpdatingStatus ? 'Đang cập nhật...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
