'use client';

import type {
  Appointment,
  AppointmentDetails,
  AppointmentStatus,
} from '@/types/appointment';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
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
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

// Mock data theo đúng structure API từ AppointmentManagement.md
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    appointmentId: '1fa85f64-5717-4562-b3fc-2c963f66afa6',
    offerId: '2fa85f64-5717-4562-b3fc-2c963f66afa6',
    serviceRequestId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    customerId: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    technicianId: '5fa85f64-5717-4562-b3fc-2c963f66afa6',
    technicianName: 'Trần Văn B',
    technicianPhone: '0912345678',
    serviceAddress: '123 Nguyễn Huệ, Q.1, TP.HCM',
    scheduledDate: '2025-11-18',
    actualStartTime: '2025-11-18T09:15:00Z',
    actualEndTime: null,
    status: 'REPAIRING',
    createdDate: '2025-11-17T10:00:00Z',
    estimatedCost: 500000,
    finalCost: 650000,
    hasPayment: false,
    paymentStatus: null,
    hasDispute: false,
    lastGpsUpdate: '2025-11-18T09:10:00Z',
    issueFlags: [],
  },
  {
    appointmentId: '2fa85f64-5717-4562-b3fc-2c963f66afa7',
    offerId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    serviceRequestId: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    customerId: '5fa85f64-5717-4562-b3fc-2c963f66afa7',
    customerName: 'Lê Thị C',
    customerPhone: '0923456789',
    technicianId: '6fa85f64-5717-4562-b3fc-2c963f66afa7',
    technicianName: 'Phạm Văn D',
    technicianPhone: '0934567890',
    serviceAddress: '456 Lê Lợi, Q.1, TP.HCM',
    scheduledDate: '2025-11-18',
    actualStartTime: '2025-11-18T08:30:00Z',
    actualEndTime: null,
    status: 'EN_ROUTE',
    createdDate: '2025-11-17T14:00:00Z',
    estimatedCost: 300000,
    finalCost: 300000,
    hasPayment: false,
    paymentStatus: null,
    hasDispute: false,
    lastGpsUpdate: '2025-11-18T08:45:00Z',
    issueFlags: [],
  },
  {
    appointmentId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
    offerId: '4fa85f64-5717-4562-b3fc-2c963f66afa8',
    serviceRequestId: '5fa85f64-5717-4562-b3fc-2c963f66afa8',
    customerId: '6fa85f64-5717-4562-b3fc-2c963f66afa8',
    customerName: 'Hoàng Văn E',
    customerPhone: '0945678901',
    technicianId: '7fa85f64-5717-4562-b3fc-2c963f66afa8',
    technicianName: 'Võ Thị F',
    technicianPhone: '0956789012',
    serviceAddress: '789 Hai Bà Trưng, Q.3, TP.HCM',
    scheduledDate: '2025-11-19',
    actualStartTime: null,
    actualEndTime: null,
    status: 'SCHEDULED',
    createdDate: '2025-11-17T16:00:00Z',
    estimatedCost: 750000,
    finalCost: 750000,
    hasPayment: false,
    paymentStatus: null,
    hasDispute: false,
    lastGpsUpdate: null,
    issueFlags: [],
  },
  {
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afa9',
    offerId: '5fa85f64-5717-4562-b3fc-2c963f66afa9',
    serviceRequestId: '6fa85f64-5717-4562-b3fc-2c963f66afa9',
    customerId: '7fa85f64-5717-4562-b3fc-2c963f66afa9',
    customerName: 'Trương Thị G',
    customerPhone: '0967890123',
    technicianId: '8fa85f64-5717-4562-b3fc-2c963f66afa9',
    technicianName: 'Đặng Văn H',
    technicianPhone: '0978901234',
    serviceAddress: '321 Võ Văn Tần, Q.3, TP.HCM',
    scheduledDate: '2025-11-17',
    actualStartTime: '2025-11-17T10:00:00Z',
    actualEndTime: '2025-11-17T12:30:00Z',
    status: 'REPAIRED',
    createdDate: '2025-11-16T09:00:00Z',
    estimatedCost: 450000,
    finalCost: 450000,
    hasPayment: true,
    paymentStatus: 'ESCROW',
    hasDispute: false,
    lastGpsUpdate: '2025-11-17T10:00:00Z',
    issueFlags: [],
  },
  {
    appointmentId: '5fa85f64-5717-4562-b3fc-2c963f66afaa',
    offerId: '6fa85f64-5717-4562-b3fc-2c963f66afaa',
    serviceRequestId: '7fa85f64-5717-4562-b3fc-2c963f66afaa',
    customerId: '8fa85f64-5717-4562-b3fc-2c963f66afaa',
    customerName: 'Bùi Văn I',
    customerPhone: '0989012345',
    technicianId: '9fa85f64-5717-4562-b3fc-2c963f66afaa',
    technicianName: 'Mai Thị J',
    technicianPhone: '0990123456',
    serviceAddress: '654 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
    scheduledDate: '2025-11-16',
    actualStartTime: null,
    actualEndTime: null,
    status: 'CANCELLED',
    createdDate: '2025-11-15T15:00:00Z',
    estimatedCost: 600000,
    finalCost: 0,
    hasPayment: false,
    paymentStatus: null,
    hasDispute: false,
    lastGpsUpdate: null,
    issueFlags: [],
  },
  {
    appointmentId: '6fa85f64-5717-4562-b3fc-2c963f66afab',
    offerId: '7fa85f64-5717-4562-b3fc-2c963f66afab',
    serviceRequestId: '8fa85f64-5717-4562-b3fc-2c963f66afab',
    customerId: '9fa85f64-5717-4562-b3fc-2c963f66afab',
    customerName: 'Ngô Thị K',
    customerPhone: '0901234568',
    technicianId: 'afa85f64-5717-4562-b3fc-2c963f66afab',
    technicianName: 'Lý Văn L',
    technicianPhone: '0912345679',
    serviceAddress: '987 Cách Mạng Tháng 8, Q.10, TP.HCM',
    scheduledDate: '2025-11-15',
    actualStartTime: '2025-11-15T14:00:00Z',
    actualEndTime: null,
    status: 'DISPUTE',
    createdDate: '2025-11-14T11:00:00Z',
    estimatedCost: 800000,
    finalCost: 950000,
    hasPayment: true,
    paymentStatus: 'ESCROW',
    hasDispute: true,
    lastGpsUpdate: '2025-11-15T14:00:00Z',
    issueFlags: ['PRICE_MISMATCH'],
  },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  // Modals
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [reassignModal, setReassignModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);

  // Cancel form
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [penalizeTechnician, setPenalizeTechnician] = useState(false);

  // Reassign form
  const [newTechnicianId, setNewTechnicianId] = useState('');
  const [reassignReason, setReassignReason] = useState('');

  // Filter appointments using useMemo
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Issues filter
    if (showOnlyIssues) {
      filtered = filtered.filter(apt => apt.hasDispute || apt.issueFlags.length > 0);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        apt =>
          apt.customerName.toLowerCase().includes(searchTerm.toLowerCase())
          || apt.technicianName.toLowerCase().includes(searchTerm.toLowerCase())
          || apt.serviceAddress.toLowerCase().includes(searchTerm.toLowerCase())
          || apt.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [appointments, statusFilter, showOnlyIssues, searchTerm]);

  // Status badge color
  const getStatusColor = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, string> = {
      SCHEDULED: 'bg-blue-50 text-blue-700',
      EN_ROUTE: 'bg-yellow-50 text-yellow-700',
      ARRIVED: 'bg-cyan-50 text-cyan-700',
      CHECKING: 'bg-indigo-50 text-indigo-700',
      PRICE_REVIEW: 'bg-orange-50 text-orange-700',
      REPAIRING: 'bg-purple-50 text-purple-700',
      REPAIRED: 'bg-green-50 text-green-700',
      CANCELLED: 'bg-gray-50 text-gray-700',
      ABSENT: 'bg-red-50 text-red-700',
      DISPUTE: 'bg-pink-50 text-pink-700',
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  // Status icon
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case 'SCHEDULED': return <Calendar className="h-4 w-4" />;
      case 'EN_ROUTE': return <Navigation className="h-4 w-4" />;
      case 'ARRIVED': return <MapPin className="h-4 w-4" />;
      case 'CHECKING': return <Search className="h-4 w-4" />;
      case 'PRICE_REVIEW': return <AlertCircle className="h-4 w-4" />;
      case 'REPAIRING': return <Wrench className="h-4 w-4" />;
      case 'REPAIRED': return <CheckCircle2 className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      case 'ABSENT': return <UserCog className="h-4 w-4" />;
      case 'DISPUTE': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Status text in Vietnamese
  const getStatusText = (status: AppointmentStatus): string => {
    const texts: Record<AppointmentStatus, string> = {
      SCHEDULED: 'Đã lên lịch',
      EN_ROUTE: 'Đang di chuyển',
      ARRIVED: 'Đã đến nơi',
      CHECKING: 'Đang kiểm tra',
      PRICE_REVIEW: 'Duyệt giá',
      REPAIRING: 'Đang sửa',
      REPAIRED: 'Đã sửa xong',
      CANCELLED: 'Đã hủy',
      ABSENT: 'Vắng mặt',
      DISPUTE: 'Tranh chấp',
    };
    return texts[status] || status;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // View details handler
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // Mock detailed data (would fetch from API)
    setAppointmentDetails({
      appointmentId: appointment.appointmentId,
      offerId: appointment.offerId,
      serviceRequest: {
        requestId: appointment.serviceRequestId,
        serviceName: 'Sửa điều hòa',
        serviceDescription: 'Điều hòa không lạnh',
        requestAddress: appointment.serviceAddress,
        addressNote: 'Tầng 3, căn 301',
      },
      customer: {
        customerId: appointment.customerId,
        fullName: appointment.customerName,
        email: `customer${appointment.customerId.slice(0, 4)}@email.com`,
        phone: appointment.customerPhone,
        avatarLink: 'https://i.pravatar.cc/150?img=1',
      },
      technician: {
        technicianId: appointment.technicianId,
        fullName: appointment.technicianName,
        email: `tech${appointment.technicianId.slice(0, 4)}@email.com`,
        phone: appointment.technicianPhone,
        rating: 4.5,
        totalJobs: 120,
        avatarLink: 'https://i.pravatar.cc/150?img=2',
      },
      scheduledDate: appointment.scheduledDate,
      actualStartTime: appointment.actualStartTime,
      actualEndTime: appointment.actualEndTime,
      status: appointment.status,
      createdDate: appointment.createdDate,
      pricing: {
        estimatedCost: appointment.estimatedCost,
        finalCost: appointment.finalCost,
        priceAdjustmentReason: appointment.finalCost !== appointment.estimatedCost ? 'Cần thay thêm linh kiện' : null,
      },
      timeline: [
        { status: 'SCHEDULED', timestamp: appointment.createdDate, note: null },
        { status: 'EN_ROUTE', timestamp: '2025-11-18T08:30:00Z', note: null, gpsLat: 10.7769, gpsLng: 106.7009 },
      ],
      media: [],
      notes: [],
      gpsLogs: [],
      payment: appointment.hasPayment
        ? {
            paymentId: 'payment-id',
            amount: appointment.finalCost,
            paymentMethod: 'MOMO',
            status: appointment.paymentStatus || 'PENDING',
            transactionDate: '2025-11-18T10:00:00Z',
            invoiceRequested: false,
          }
        : null,
      disputes: [],
      activityLogs: [],
      walletTransactions: [],
    });
    setViewDetailsModal(true);
  };

  // Cancel handler
  const handleCancelAppointment = async () => {
    if (!selectedAppointment || cancelReason.length < 10) {
      toast.error('Vui lòng nhập lý do hủy (tối thiểu 10 ký tự)');
      return;
    }

    try {
      // Mock cancel logic
      setAppointments(prev =>
        prev.map(apt =>
          apt.appointmentId === selectedAppointment.appointmentId
            ? { ...apt, status: 'CANCELLED' }
            : apt,
        ),
      );

      toast.success('Đã hủy lịch hẹn thành công');
      setCancelModal(false);
      setCancelReason('');
      setRefundAmount(0);
      setPenalizeTechnician(false);
      setSelectedAppointment(null);
    } catch {
      toast.error('Không thể hủy lịch hẹn');
    }
  };

  // Reassign handler
  const handleReassignAppointment = async () => {
    if (!selectedAppointment || !newTechnicianId || reassignReason.length < 10) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      // Mock reassign logic
      toast.success('Đã chỉ định thợ mới thành công');
      setReassignModal(false);
      setNewTechnicianId('');
      setReassignReason('');
      setSelectedAppointment(null);
    } catch {
      toast.error('Không thể chỉ định thợ mới');
    }
  };

  // Calculate stats
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
    inProgress: appointments.filter(a => ['EN_ROUTE', 'ARRIVED', 'CHECKING', 'PRICE_REVIEW', 'REPAIRING'].includes(a.status)).length,
    completed: appointments.filter(a => a.status === 'REPAIRED').length,
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
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
              <p className="text-sm text-gray-500">Đã đặt</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang thực hiện</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
            </div>
            <Wrench className="h-8 w-8 text-purple-500" />
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
            {filteredAppointments.length}
            {' '}
            /
            {' '}
            {appointments.length}
            {' '}
            lịch hẹn
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0
          ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <p className="text-gray-500">Không tìm thấy lịch hẹn nào</p>
              </div>
            )
          : filteredAppointments.map(appointment => (
              <div
                key={appointment.appointmentId}
                className="grid grid-cols-[90px_150px_minmax(220px,1fr)_200px_220px_160px_200px] items-center gap-6 rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
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
                    {appointment.issueFlags.map(flag => (
                      <span
                        key={flag}
                        className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700"
                      >
                        {flag}
                      </span>
                    ))}
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
                    {['CANCELLED', 'REPAIRED', 'DISPUTE'].includes(appointment.status)
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
                                setReassignModal(true);
                              }}
                              className="rounded-lg border border-blue-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-50"
                            >
                              Đổi thợ
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setCancelModal(true);
                              }}
                              className="rounded-lg border border-red-600 px-2 py-1.5 text-xs font-medium whitespace-nowrap text-red-600 transition-colors hover:bg-red-50"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* View Details Modal */}
      {viewDetailsModal && appointmentDetails && (
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

            <div className="space-y-6">
              {/* Customer & Technician */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Khách hàng</h3>
                  <div className="flex items-start gap-3">
                    <Image
                      src={appointmentDetails.customer.avatarLink}
                      alt={appointmentDetails.customer.fullName}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full"
                    />
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
                    <Image
                      src={appointmentDetails.technician.avatarLink}
                      alt={appointmentDetails.technician.fullName}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full"
                    />
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

              {/* Timeline */}
              <div className="rounded-lg border border-gray-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Lịch sử trạng thái</h3>
                <div className="space-y-3">
                  {appointmentDetails.timeline.map(item => (
                    <div key={item.timestamp} className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{item.status}</span>
                          <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                        </div>
                        {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
                        {item.gpsLat && item.gpsLng && (
                          <p className="text-xs text-gray-500">
                            GPS:
                            {' '}
                            {item.gpsLat}
                            ,
                            {' '}
                            {item.gpsLng}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy (tối thiểu 10 ký tự)"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {selectedAppointment.hasPayment && (
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
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

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

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleCancelAppointment}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Xác nhận hủy
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
                  onChange={e => setNewTechnicianId(e.target.value)}
                  placeholder="Nhập ID thợ mới (GUID)"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Lý do đổi thợ
                  {' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  placeholder="Nhập lý do đổi thợ (tối thiểu 10 ký tự)"
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReassignModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleReassignAppointment}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Xác nhận đổi thợ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
