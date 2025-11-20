'use client';

import {
  AlertCircle,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Loader2,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';

export default function ServicesPage() {
  // Use custom hooks to fetch data from API
  const {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
  } = useServices();

  const { categories } = useCategories();

  const [activeTab] = useState<'services' | 'requests'>(
    'services',
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<
    (typeof services)[0] | null
  >(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    categoryId: '',
    serviceName: '',
    description: '',
    basePrice: 0,
    serviceIconUrl: null as File | null,
  });

  const [editForm, setEditForm] = useState({
    serviceName: '',
    description: '',
    basePrice: 0,
    categoryId: '',
    serviceIconUrl: null as File | null,
  });

  // Handle view service
  const handleViewService = (service: (typeof services)[0]) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  // Handle edit service
  const handleEditService = (service: (typeof services)[0]) => {
    setSelectedService(service);
    setEditForm({
      serviceName: service.serviceName,
      description: service.description,
      basePrice: service.basePrice,
      categoryId: service.categoryId,
      serviceIconUrl: null,
    });
    setEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (service: (typeof services)[0]) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  // Handle create service
  const handleCreateService = async () => {
    if (
      !createForm.serviceName
      || !createForm.description
      || !createForm.categoryId
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      // Filter out null serviceIconUrl
      const serviceData = {
        ...createForm,
        serviceIconUrl: createForm.serviceIconUrl || undefined,
      };
      await createService(serviceData);
      setCreateModalOpen(false);
      setCreateForm({
        categoryId: '',
        serviceName: '',
        description: '',
        basePrice: 0,
        serviceIconUrl: null,
      });
    } catch (err) {
      console.error('Create service error:', err);
      // Error already handled by hook with toast
    }
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!selectedService) {
      toast.error('Không tìm thấy thông tin dịch vụ');
      return;
    }

    if (!selectedService.id) {
      toast.error('ID dịch vụ không hợp lệ');
      return;
    }

    try {
      const updateData = {
        ...editForm,
        serviceIconUrl: editForm.serviceIconUrl || undefined,
      };
      await updateService(selectedService.id, updateData);
      setEditModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Save edit error:', error);
      // Error already handled by hook with toast
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedService?.id) {
      toast.error('ID dịch vụ không hợp lệ');
      return;
    }

    try {
      await deleteService(selectedService.id);
      setDeleteModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Delete service error:', error);
      // Error already handled by hook with toast
    }
  };

  const filteredServices = services
    .filter(
      service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        || service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Sort by createdAt descending (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors closeButton />

      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginTop: -23 }}>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Quản lý dịch vụ
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý các dịch vụ sửa chữa trong hệ thống
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Thêm dịch vụ
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600">Đang tải dịch vụ...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">
              Lỗi khi tải dịch vụ:
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng dịch vụ
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {services.length}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Dịch vụ trong hệ thống
                  </p>
                </div>
                <div className="rounded-full bg-blue-50 p-3">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Giá trung bình
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {services.length > 0
                      ? Math.round(
                          services.reduce((sum, s) => sum + s.basePrice, 0)
                          / services.length,
                        ).toLocaleString('vi-VN')
                      : '0'}
                    {' '}
                    đ
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Giá cơ bản trung bình
                  </p>
                </div>
                <div className="rounded-full bg-purple-50 p-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
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
                placeholder={
                  activeTab === 'services'
                    ? 'Tìm kiếm dịch vụ theo tên hoặc mô tả...'
                    : 'Tìm kiếm yêu cầu dịch vụ...'
                }
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
                {filteredServices.map(service => (
                  <div
                    key={service.id}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6">
                      <div className="flex items-start gap-4">
                        {/* Service Icon */}
                        {service.serviceIconUrl && (
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
                            <Image
                              src={service.serviceIconUrl}
                              alt={service.serviceName || 'Service icon'}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        )}
                        {/* Service Name */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {service.serviceName}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex min-h-[180px] flex-col p-6">
                      <div className="flex-1">
                        <p className="line-clamp-3 text-sm text-gray-600">
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
                        </div>
                      </div>

                      {/* Footer with buttons */}
                      <div className="mt-4 flex gap-2">
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
                          onClick={() => handleDeleteClick(service)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                  <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Không tìm thấy dịch vụ
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {searchTerm
                      ? 'Thử thay đổi từ khóa tìm kiếm'
                      : 'Chưa có dịch vụ nào trong hệ thống'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Service Requests Tab */}
          {activeTab === 'requests' && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Yêu cầu dịch vụ
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Tính năng xem danh sách yêu cầu dịch vụ từ khách hàng và thợ
                đang được phát triển.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                API endpoint: GET /api/v1/service-requests
              </p>
            </div>
          )}
        </>
      )}

      {/* View Service Modal */}
      {viewModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết dịch vụ
              </h3>
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
                {/* Service Icon */}
                {selectedService.serviceIconUrl && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Hình ảnh dịch vụ
                    </div>
                    <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                      <Image
                        src={selectedService.serviceIconUrl}
                        alt={selectedService.serviceName || 'Service icon'}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  </div>
                )}

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

                {selectedService.categoryId && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Danh mục
                    </div>
                    <p className="mt-1 text-sm text-gray-900">
                      {categories.find(c => c.categoryId === selectedService.categoryId)?.categoryName || selectedService.categoryId}
                    </p>
                  </div>
                )}

                {selectedService.createdAt && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Ngày tạo
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedService.createdAt).toLocaleString(
                        'vi-VN',
                      )}
                    </p>
                  </div>
                )}

                {selectedService.updatedAt && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Cập nhật lần cuối
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(selectedService.updatedAt).toLocaleString(
                        'vi-VN',
                      )}
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

      {/* Create Service Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Thêm dịch vụ mới
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="createCategoryId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Danh mục dịch vụ
                    {' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="createCategoryId"
                    value={createForm.categoryId}
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        categoryId: e.target.value,
                      })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.filter(c => c.categoryId).map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="createServiceName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên dịch vụ
                    {' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="createServiceName"
                    type="text"
                    value={createForm.serviceName}
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        serviceName: e.target.value,
                      })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập tên dịch vụ"
                  />
                </div>

                <div>
                  <label
                    htmlFor="createServiceDesc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mô tả
                    {' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="createServiceDesc"
                    value={createForm.description}
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập mô tả dịch vụ"
                  />
                </div>

                <div>
                  <label
                    htmlFor="createBasePrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giá cơ bản (đ)
                    {' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="createBasePrice"
                    type="number"
                    value={createForm.basePrice}
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        basePrice: Number(e.target.value),
                      })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập giá cơ bản"
                    min="0"
                  />
                </div>

                <div>
                  <label
                    htmlFor="createServiceIcon"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service Icon (tùy chọn)
                  </label>
                  <input
                    id="createServiceIcon"
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      setCreateForm({
                        ...createForm,
                        serviceIconUrl: e.target.files?.[0] || null,
                      })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCreateService}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Tạo dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Chỉnh sửa dịch vụ
              </h3>
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
                {/* Current Service Icon Preview */}
                {selectedService?.serviceIconUrl && !editForm.serviceIconUrl && (
                  <div>
                    <div className="block text-sm font-medium text-gray-700">
                      Hình ảnh hiện tại
                    </div>
                    <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
                      <Image
                        src={selectedService.serviceIconUrl}
                        alt={selectedService.serviceName || 'Service icon'}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  </div>
                )}

                {/* Service Icon Upload */}
                <div>
                  <label
                    htmlFor="editServiceIcon"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {editForm.serviceIconUrl || selectedService?.serviceIconUrl
                      ? 'Thay đổi hình ảnh dịch vụ'
                      : 'Thêm hình ảnh dịch vụ'}
                  </label>
                  <input
                    id="editServiceIcon"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditForm({ ...editForm, serviceIconUrl: file });
                      }
                    }}
                    className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editForm.serviceIconUrl && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ Đã chọn:
                      {' '}
                      {editForm.serviceIconUrl.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="editCategoryId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Danh mục dịch vụ
                  </label>
                  <select
                    id="editCategoryId"
                    value={editForm.categoryId}
                    onChange={e =>
                      setEditForm({ ...editForm, categoryId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.filter(c => c.categoryId).map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="editServiceName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tên dịch vụ
                  </label>
                  <input
                    id="editServiceName"
                    type="text"
                    value={editForm.serviceName}
                    onChange={e =>
                      setEditForm({ ...editForm, serviceName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập tên dịch vụ"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editServiceDesc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="editServiceDesc"
                    value={editForm.description}
                    onChange={e =>
                      setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập mô tả dịch vụ"
                  />
                </div>

                <div>
                  <label
                    htmlFor="editBasePrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Giá cơ bản (đ)
                  </label>
                  <input
                    id="editBasePrice"
                    type="number"
                    value={editForm.basePrice}
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        basePrice: Number(e.target.value),
                      })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    placeholder="Nhập giá cơ bản"
                    min="0"
                  />
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Bạn có chắc chắn muốn xóa dịch vụ
                    {' '}
                    <span className="font-semibold">
                      &quot;
                      {selectedService.serviceName}
                      &quot;
                    </span>
                    ?
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Xóa dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
