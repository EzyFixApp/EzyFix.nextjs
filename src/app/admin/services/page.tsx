'use client';

import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Loader2,
  MapPin,
  Package,
  Search,
  Trash2,
  TrendingUp,
  User,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';

import { useServices } from '@/hooks/useServices';
import { mockTechnicians } from '@/libs/admin-data';

// Mock Appointments data
const mockAppointments = [
  {
    AppointmentID: '1',
    ServiceName: 'Sửa điều hòa',
    CustomerName: 'Nguyễn Văn An',
    TechnicianName: 'Trần Văn Thợ',
    ScheduledDate: '2025-10-21',
    ActualStartTime: '2025-10-21T08:00:00',
    ActualEndTime: '2025-10-21T10:30:00',
    Status: 'Completed',
    FinalCost: 500000,
    Address: '123 Nguyễn Huệ, Q.1, TP.HCM',
  },
  {
    AppointmentID: '2',
    ServiceName: 'Sửa ống nước',
    CustomerName: 'Trần Thị Bình',
    TechnicianName: 'Phạm Văn Công',
    ScheduledDate: '2025-10-21',
    ActualStartTime: '2025-10-21T14:00:00',
    ActualEndTime: null,
    Status: 'InProgress',
    FinalCost: 300000,
    Address: '456 Lê Lợi, Q.3, TP.HCM',
  },
  {
    AppointmentID: '3',
    ServiceName: 'Sửa điện',
    CustomerName: 'Lê Văn Cường',
    TechnicianName: 'Hoàng Văn Đức',
    ScheduledDate: '2025-10-22',
    ActualStartTime: null,
    ActualEndTime: null,
    Status: 'Scheduled',
    FinalCost: 450000,
    Address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
  },
  {
    AppointmentID: '4',
    ServiceName: 'Sửa TV',
    CustomerName: 'Phạm Thị Dung',
    TechnicianName: 'Nguyễn Văn Em',
    ScheduledDate: '2025-10-20',
    ActualStartTime: '2025-10-20T16:00:00',
    ActualEndTime: '2025-10-20T18:00:00',
    Status: 'Completed',
    FinalCost: 250000,
    Address: '321 Võ Văn Tần, Q.10, TP.HCM',
  },
];

export default function ServicesPage() {
  // Use custom hook to fetch services from API
  const { services, isLoading, error, updateService } = useServices();

  const [activeTab, setActiveTab] = useState<'services' | 'appointments'>(
    'services',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('All');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    serviceName: '',
    description: '',
    basePrice: 0,
    isActive: true,
  });

  // Handle view service
  const handleViewService = (service: typeof services[0]) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: typeof services[0]) => {
    setSelectedService(service);
    setEditForm({
      serviceName: service.serviceName,
      description: service.description,
      basePrice: service.basePrice,
      isActive: service.isActive,
    });
    setEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!selectedService) {
      return;
    }

    try {
      await updateService(selectedService.id, editForm);
      setEditModalOpen(false);
      setSelectedService(null);
    } catch {
      // Error already handled by hook with toast
    }
  };

  // Handle toggle active
  const handleToggleActive = async (service: typeof services[0]) => {
    try {
      await updateService(service.id, { isActive: !service.isActive });
    } catch {
      // Error already handled by hook with toast
    }
  };

  const getTechnicianCountForSkill = (serviceName: string): number => {
    const matchingTechs = mockTechnicians.filter(tech =>
      tech.Skills?.some(
        skill => skill.SkillName?.toLowerCase() === serviceName.toLowerCase(),
      ),
    );
    return matchingTechs.length;
  };

  const filteredServices = services.filter(
    service =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      || service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredAppointments
    = appointmentFilter === 'All'
      ? mockAppointments
      : mockAppointments.filter(apt => apt.Status === appointmentFilter);

  const activeServices = services.filter(s => s.isActive).length;
  const totalRevenue = mockAppointments
    .filter(a => a.Status === 'Completed')
    .reduce((sum, a) => sum + a.FinalCost, 0);

  const appointmentCounts = {
    All: mockAppointments.length,
    Scheduled: mockAppointments.filter(a => a.Status === 'Scheduled').length,
    InProgress: mockAppointments.filter(a => a.Status === 'InProgress')
      .length,
    Completed: mockAppointments.filter(a => a.Status === 'Completed').length,
    Cancelled: mockAppointments.filter(a => a.Status === 'Cancelled').length,
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors closeButton />

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600">Loading services...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">
              Error loading services:
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h2>
              <p className="mt-1 text-sm text-gray-600">
                {activeTab === 'services'
                  ? 'Quản lý các dịch vụ sửa chữa và danh mục'
                  : 'Xem và quản lý các đơn hàng dịch vụ'}
              </p>
            </div>
            {activeTab === 'services' && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
              >
                <Wrench className="h-4 w-4" />
                Thêm dịch vụ
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Quản lý dịch vụ
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('appointments')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Đơn hàng dịch vụ
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {activeTab === 'services' ? 'Tổng dịch vụ' : 'Tổng đơn hàng'}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {activeTab === 'services'
                      ? services.length
                      : mockAppointments.length}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {activeTab === 'services'
                      ? `${activeServices} đang hoạt động`
                      : `${appointmentCounts.Completed} đã hoàn thành`}
                  </p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  {activeTab === 'services'
                    ? (
                        <Wrench className="h-6 w-6 text-blue-600" />
                      )
                    : (
                        <Calendar className="h-6 w-6 text-blue-600" />
                      )}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {totalRevenue.toLocaleString('vi-VN')}
                    {' '}
                    đ
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      Từ
                      {' '}
                      {appointmentCounts.Completed}
                      {' '}
                      đơn hoàn thành
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-green-50 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {activeTab === 'services' ? 'Thợ sẵn sàng' : 'Đang xử lý'}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {activeTab === 'services'
                      ? mockTechnicians.length
                      : appointmentCounts.InProgress}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {activeTab === 'services'
                      ? 'Có thể nhận việc'
                      : 'Đơn đang thực hiện'}
                  </p>
                </div>
                <div className="rounded-full bg-purple-50 p-3">
                  {activeTab === 'services'
                    ? (
                        <Users className="h-6 w-6 text-purple-600" />
                      )
                    : (
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                      )}
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
                placeholder="Tìm kiếm dịch vụ theo tên, mô tả hoặc danh mục..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'services' && (
            <>
              {/* Services Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => {
                  const techCount = getTechnicianCountForSkill(service.serviceName);
                  const canEnable = techCount > 0;

                  return (
                    <div
                      key={service.id}
                      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                    >
                      {/* Header */}
                      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {service.serviceName}
                              </h3>
                              {service.isActive
                                ? (
                                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                      <Check className="h-3 w-3" />
                                      đang hoạt động
                                    </span>
                                  )
                                : (
                                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                      <X className="h-3 w-3" />
                                      không hoạt động
                                    </span>
                                  )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex min-h-[240px] flex-col p-6">
                        <div className="flex-1">
                          <p className="line-clamp-2 text-sm text-gray-600">
                            {service.description}
                          </p>

                          <div className="mt-4 space-y-3">
                            {/* Price */}
                            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                              <span className="text-sm font-medium text-blue-600">
                                Giá cơ bản
                              </span>
                              <span className="text-lg font-bold text-blue-700">
                                {service.basePrice?.toLocaleString('vi-VN')}
                                {' '}
                                đ
                              </span>
                            </div>

                            {/* Technicians */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>Thợ có kỹ năng</span>
                              </div>
                              <span
                                className={`font-semibold ${techCount > 0 ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {techCount}
                                {' '}
                                thợ
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer with buttons */}
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewService(service)}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" />
                              Xem
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditService(service)}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                            >
                              <Edit className="h-4 w-4" />
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleActive(service)}
                              disabled={!canEnable && !service.isActive}
                              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                service.isActive
                                  ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                  : canEnable
                                    ? 'border border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                                    : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
                              }`}
                            >
                              {service.isActive
                                ? (
                                    <>
                                      <XCircle className="h-4 w-4" />
                                      Tắt
                                    </>
                                  )
                                : (
                                    <>
                                      <CheckCircle className="h-4 w-4" />
                                      Bật
                                    </>
                                  )}
                            </button>
                          </div>

                          {/* Warning below buttons */}
                          {!canEnable && (
                            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3">
                              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                              <p className="text-xs text-amber-700">
                                Không thể kích hoạt do chưa có thợ với kỹ năng này
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredServices.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                  <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Không tìm thấy dịch vụ
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Thử thay đổi từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'appointments' && (
            <>
              {/* Filter Tabs */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {['All', 'Completed', 'InProgress', 'Scheduled', 'Cancelled'].map(
                    filter => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setAppointmentFilter(filter)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          appointmentFilter === filter
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter === 'All'
                          ? 'Tất cả'
                          : filter === 'Completed'
                            ? `Hoàn thành (${appointmentCounts.Completed})`
                            : filter === 'InProgress'
                              ? `Đang xử lý (${appointmentCounts.InProgress})`
                              : filter === 'Scheduled'
                                ? `Đã lên lịch (${appointmentCounts.Scheduled})`
                                : `Đã hủy (${appointmentCounts.Cancelled})`}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Appointments List */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredAppointments.map(appointment => (
                  <div
                    key={appointment.AppointmentID}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex min-h-[140px] flex-col p-6">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Package className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {appointment.ServiceName}
                            </h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                appointment.Status === 'Completed'
                                  ? 'bg-green-100 text-green-700'
                                  : appointment.Status === 'InProgress'
                                    ? 'bg-blue-100 text-blue-700'
                                    : appointment.Status === 'Scheduled'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {appointment.Status === 'Completed'
                                ? 'Hoàn thành'
                                : appointment.Status === 'InProgress'
                                  ? 'Đang xử lý'
                                  : appointment.Status === 'Scheduled'
                                    ? 'Đã lên lịch'
                                    : 'Đã hủy'}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>
                                Khách:
                                {appointment.CustomerName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>
                                Thợ:
                                {appointment.TechnicianName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.ScheduledDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.Address}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="text-xl font-bold text-blue-600">
                            {appointment.FinalCost.toLocaleString('vi-VN')}
                            {' '}
                            đ
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 border-t border-gray-100 pt-4">
                        <button
                          type="button"
                          className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          Xem chi tiết
                        </button>
                        {appointment.Status !== 'Completed' && (
                          <button
                            type="button"
                            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                          >
                            <Trash2 className="mr-1 inline h-4 w-4" />
                            Xóa khẩn cấp
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredAppointments.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Không có đơn hàng
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Không tìm thấy đơn hàng nào với bộ lọc này
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* View Service Modal */}
      {viewModalOpen && selectedService && (
        <div className="modal-backdrop-enter fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="modal-content-enter w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết dịch vụ</h3>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-700">
                    Tên dịch vụ
                  </div>
                  <p className="mt-1 text-base text-gray-900">
                    {selectedService.serviceName}
                  </p>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </div>
                  <p className="mt-1 text-base text-gray-900">
                    {selectedService.description}
                  </p>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700">
                    Giá cơ bản
                  </div>
                  <p className="mt-1 text-lg font-semibold text-blue-600">
                    {selectedService.basePrice?.toLocaleString('vi-VN')}
                    {' '}
                    đ
                  </p>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </div>
                  <div className="mt-1">
                    {selectedService.isActive
                      ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                            <Check className="h-4 w-4" />
                            Đang hoạt động
                          </span>
                        )
                      : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                            <X className="h-4 w-4" />
                            Không hoạt động
                          </span>
                        )}
                  </div>
                </div>

                {selectedService.createdAt && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedService.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}

                {selectedService.updatedAt && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Cập nhật lần cuối
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedService.updatedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editModalOpen && selectedService && (
        <div className="modal-backdrop-enter fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="modal-content-enter w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa dịch vụ</h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
                    Tên dịch vụ
                  </label>
                  <input
                    id="serviceName"
                    type="text"
                    value={editForm.serviceName}
                    onChange={e => setEditForm({ ...editForm, serviceName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập tên dịch vụ"
                  />
                </div>

                <div>
                  <label htmlFor="serviceDesc" className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    id="serviceDesc"
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập mô tả dịch vụ"
                  />
                </div>

                <div>
                  <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                    Giá cơ bản (đ)
                  </label>
                  <input
                    id="basePrice"
                    type="number"
                    value={editForm.basePrice}
                    onChange={e => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập giá cơ bản"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="isActive" className="flex items-center gap-2">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Kích hoạt dịch vụ
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
