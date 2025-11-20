'use client';

import type {
  CreateVoucherRequest,
  DiscountType,
  UpdateVoucherRequest,
  Voucher,
  VoucherDetails,
  VoucherUsageReport,
} from '@/types/voucher';
import {
  BarChart3,
  Calendar,
  Copy,
  Edit,
  Eye,
  Plus,
  Power,
  Search,
  Tag,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';
import { useServices } from '@/hooks/useServices';
import VoucherService from '@/libs/VoucherService';

export default function VouchersPage() {
  // State for vouchers data
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [filterExpired, setFilterExpired] = useState(false);

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [usageModal, setUsageModal] = useState(false);

  // Selected data
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voucherDetails, setVoucherDetails] = useState<VoucherDetails | null>(null);
  const [usageReport, setUsageReport] = useState<VoucherUsageReport | null>(null);

  // Use hooks for categories and services
  const { categories } = useCategories();
  const { services } = useServices();

  // Form states
  const [formData, setFormData] = useState<CreateVoucherRequest>({
    voucherCode: '',
    voucherDescription: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    maxDiscountAmount: 0,
    minimumOrderAmount: 0,
    validFrom: '',
    validTo: '',
    isActive: true,
    maxUsageCount: 0,
    maxUsagePerUserCount: 0,
    categoryIds: [],
    serviceIds: [],
    paymentMethodIds: [],
  });

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingUsage, setLoadingUsage] = useState(false);

  // Validation error states
  const [errors, setErrors] = useState({
    voucherCode: false,
    voucherDescription: false,
    discountValue: false,
    validFrom: false,
    validTo: false,
    maxUsageCount: false,
    maxUsagePerUserCount: false,
  });

  // Fetch vouchers
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await VoucherService.getVouchers({
        keyword: searchTerm || undefined,
        isActive: filterActive,
        includeExpired: filterExpired,
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });

      setVouchers(data.items);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  // Fetch voucher details
  const fetchVoucherDetails = async (voucherId: string) => {
    try {
      setLoadingDetails(true);
      const details = await VoucherService.getVoucherById(voucherId);
      setVoucherDetails(details);
      setDetailsModal(true);
    } catch (error) {
      console.error('Error fetching voucher details:', error);
      toast.error('Không thể tải thông tin voucher');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch usage report
  const fetchUsageReport = async (voucherId: string, _voucherCode: string) => {
    try {
      setLoadingUsage(true);
      const report = await VoucherService.getUsageReport(voucherId);
      setUsageReport(report);
      setUsageModal(true);
    } catch (error) {
      console.error('Error fetching usage report:', error);
      toast.error('Không thể tải báo cáo sử dụng');
    } finally {
      setLoadingUsage(false);
    }
  };

  // Create voucher
  const handleCreate = () => {
    setFormData({
      voucherCode: '',
      voucherDescription: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      maxDiscountAmount: 0,
      minimumOrderAmount: 0,
      validFrom: '',
      validTo: '',
      isActive: true,
      maxUsageCount: 0,
      maxUsagePerUserCount: 0,
      categoryIds: [],
      serviceIds: [],
      paymentMethodIds: [],
    });
    setErrors({
      voucherCode: false,
      voucherDescription: false,
      discountValue: false,
      validFrom: false,
      validTo: false,
      maxUsageCount: false,
      maxUsagePerUserCount: false,
    });
    setCreateModal(true);
  };

  const submitCreate = async () => {
    // Reset errors
    const newErrors = {
      voucherCode: false,
      voucherDescription: false,
      discountValue: false,
      validFrom: false,
      validTo: false,
      maxUsageCount: false,
      maxUsagePerUserCount: false,
    };

    let hasError = false;

    // Validation
    if (!formData.voucherCode.trim()) {
      newErrors.voucherCode = true;
      hasError = true;
    }

    if (!formData.voucherDescription.trim()) {
      newErrors.voucherDescription = true;
      hasError = true;
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = true;
      hasError = true;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      newErrors.discountValue = true;
      hasError = true;
      toast.error('Giá trị giảm phần trăm không được vượt quá 100%');
    }

    if (!formData.validFrom || !formData.validTo) {
      if (!formData.validFrom) {
        newErrors.validFrom = true;
      }
      if (!formData.validTo) {
        newErrors.validTo = true;
      }
      hasError = true;
    }

    if (formData.validFrom && formData.validTo) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(formData.validFrom);
      const endDate = new Date(formData.validTo);

      if (startDate < today) {
        newErrors.validFrom = true;
        hasError = true;
        toast.error('Ngày bắt đầu phải từ hôm nay trở đi');
      }

      if (endDate <= startDate) {
        newErrors.validTo = true;
        hasError = true;
        toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      }
    }

    if (formData.maxUsageCount <= 0) {
      newErrors.maxUsageCount = true;
      hasError = true;
    }

    if (formData.maxUsagePerUserCount <= 0) {
      newErrors.maxUsagePerUserCount = true;
      hasError = true;
    }

    if (formData.maxUsagePerUserCount > formData.maxUsageCount) {
      newErrors.maxUsagePerUserCount = true;
      hasError = true;
      toast.error('Giới hạn mỗi người không được vượt quá tổng số lần sử dụng');
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setIsCreating(true);
      await VoucherService.createVoucher(formData);
      toast.success('Tạo voucher thành công');
      setCreateModal(false);
      fetchVouchers();
    } catch (error) {
      console.error('Error creating voucher:', error);
      toast.error('Không thể tạo voucher');
    } finally {
      setIsCreating(false);
    }
  };

  // Edit voucher
  const handleEdit = async (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setErrors({
      voucherCode: false,
      voucherDescription: false,
      discountValue: false,
      validFrom: false,
      validTo: false,
      maxUsageCount: false,
      maxUsagePerUserCount: false,
    });
    try {
      setLoadingDetails(true);
      const details = await VoucherService.getVoucherById(voucher.voucherId);

      setFormData({
        voucherCode: details.voucherCode,
        voucherDescription: details.voucherDescription,
        discountType: details.discountType,
        discountValue: details.discountValue,
        maxDiscountAmount: details.maxDiscountAmount,
        minimumOrderAmount: details.minimumOrderAmount,
        validFrom: details.validFrom,
        validTo: details.validTo,
        isActive: details.isActive,
        maxUsageCount: details.maxUsageCount,
        maxUsagePerUserCount: details.maxUsagePerUserCount,
        categoryIds: details.categoryIds,
        serviceIds: details.serviceIds,
        paymentMethodIds: details.paymentMethodIds,
      });

      setEditModal(true);
    } catch (error) {
      console.error('Error loading voucher for edit:', error);
      toast.error('Không thể tải thông tin voucher');
    } finally {
      setLoadingDetails(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedVoucher) {
      return;
    }

    // Reset errors
    const newErrors = {
      voucherCode: false,
      voucherDescription: false,
      discountValue: false,
      validFrom: false,
      validTo: false,
      maxUsageCount: false,
      maxUsagePerUserCount: false,
    };

    let hasError = false;

    // Validation
    if (!formData.voucherCode.trim()) {
      newErrors.voucherCode = true;
      hasError = true;
    }

    if (!formData.voucherDescription.trim()) {
      newErrors.voucherDescription = true;
      hasError = true;
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = true;
      hasError = true;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      newErrors.discountValue = true;
      hasError = true;
      toast.error('Giá trị giảm phần trăm không được vượt quá 100%');
    }

    if (!formData.validFrom || !formData.validTo) {
      if (!formData.validFrom) {
        newErrors.validFrom = true;
      }
      if (!formData.validTo) {
        newErrors.validTo = true;
      }
      hasError = true;
    }

    if (formData.validFrom && formData.validTo) {
      const startDate = new Date(formData.validFrom);
      const endDate = new Date(formData.validTo);

      if (endDate <= startDate) {
        newErrors.validTo = true;
        hasError = true;
        toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      }
    }

    if (formData.maxUsageCount <= 0) {
      newErrors.maxUsageCount = true;
      hasError = true;
    }

    if (formData.maxUsagePerUserCount <= 0) {
      newErrors.maxUsagePerUserCount = true;
      hasError = true;
    }

    if (formData.maxUsagePerUserCount > formData.maxUsageCount) {
      newErrors.maxUsagePerUserCount = true;
      hasError = true;
      toast.error('Giới hạn mỗi người không được vượt quá tổng số lần sử dụng');
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setIsUpdating(true);
      const updateData: UpdateVoucherRequest = {
        voucherCode: formData.voucherCode,
        voucherDescription: formData.voucherDescription,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        maxDiscountAmount: formData.maxDiscountAmount,
        minimumOrderAmount: formData.minimumOrderAmount,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        isActive: formData.isActive,
        maxUsageCount: formData.maxUsageCount,
        maxUsagePerUserCount: formData.maxUsagePerUserCount,
        categoryIds: formData.categoryIds,
        serviceIds: formData.serviceIds,
        paymentMethodIds: formData.paymentMethodIds,
      };

      await VoucherService.updateVoucher(selectedVoucher.voucherId, updateData);
      toast.success('Cập nhật voucher thành công');
      setEditModal(false);
      setSelectedVoucher(null);
      fetchVouchers();
    } catch (error) {
      console.error('Error updating voucher:', error);
      toast.error('Không thể cập nhật voucher');
    } finally {
      setIsUpdating(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      setIsToggling(true);
      await VoucherService.toggleStatus(voucher.voucherId, {
        isActive: !voucher.isActive,
      });
      toast.success(`${voucher.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} voucher thành công`);
      fetchVouchers();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Không thể thay đổi trạng thái voucher');
    } finally {
      setIsToggling(false);
    }
  };

  // Copy voucher code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Đã copy mã voucher');
  };

  // Initial load
  useEffect(() => {
    fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterActive, filterExpired, pagination.currentPage]);

  // Calculate stats
  const activeVouchers = vouchers.filter(v => v.isActive).length;
  const totalUsage = vouchers.reduce((sum, v) => sum + v.confirmedUsages, 0);
  const expiredVouchers = vouchers.filter(v => new Date(v.validTo) < new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Voucher</h2>
          <p className="mt-1 text-sm text-gray-600">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Tạo voucher mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng voucher</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{pagination.totalItems}</p>
              <p className="mt-2 text-sm text-gray-500">
                {activeVouchers}
                {' '}
                đang hoạt động
              </p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vouchers hết hạn</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {expiredVouchers}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-orange-600">
                <XCircle className="h-3 w-3" />
                <span>Cần xem xét</span>
              </div>
            </div>
            <div className="rounded-full bg-orange-50 p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-orange-600" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lượt sử dụng</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{totalUsage}</p>
              <p className="mt-2 text-sm text-gray-500">Đã xác nhận</p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600" />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm voucher theo mã hoặc mô tả..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setFilterActive(undefined)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                filterActive === undefined
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterActive(true)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                filterActive === true
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Đang hoạt động
            </button>
            <button
              type="button"
              onClick={() => setFilterActive(false)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                filterActive === false
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Không hoạt động
            </button>
            <button
              type="button"
              onClick={() => setFilterExpired(!filterExpired)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                filterExpired
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filterExpired ? 'Ẩn hết hạn' : 'Hiện hết hạn'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      )}

      {/* Vouchers Grid */}
      {!loading && vouchers.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vouchers.map((voucher) => {
            const usagePercent = voucher.maxUsageCount
              ? (voucher.confirmedUsages / voucher.maxUsageCount) * 100
              : 0;
            const isExpired = new Date(voucher.validTo) < new Date();

            return (
              <div
                key={voucher.voucherId}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Header with gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                  <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white opacity-10" />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Tag className="h-5 w-5" />
                          <span className="text-sm font-medium opacity-90">Mã giảm giá</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <h3 className="text-2xl font-bold tracking-wider">
                            {voucher.voucherCode}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(voucher.voucherCode)}
                            className="rounded-lg bg-white/20 p-1.5 transition-colors hover:bg-white/30"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {voucher.isActive
                        ? (
                            <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-semibold">
                              Active
                            </span>
                          )
                        : (
                            <span className="rounded-full bg-gray-400 px-3 py-1 text-xs font-semibold">
                              Inactive
                            </span>
                          )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex min-h-[350px] flex-col p-6">
                  <div className="flex-1">
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {voucher.voucherDescription}
                    </p>

                    <div className="mt-4 space-y-3">
                      {/* Discount */}
                      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 p-3">
                        <span className="text-sm font-medium text-orange-700">Giảm giá</span>
                        <span className="text-lg font-bold text-orange-800">
                          {voucher.discountValue.toLocaleString('vi-VN')}
                          {' '}
                          {voucher.discountType === 'PERCENTAGE' ? '%' : 'đ'}
                        </span>
                      </div>

                      {/* Discount Type Badge */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Loại giảm giá</span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            voucher.discountType === 'PERCENTAGE'
                              ? 'bg-purple-100 text-purple-700'
                              : voucher.discountType === 'FIXED_AMOUNT'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {voucher.discountType === 'PERCENTAGE'
                            ? 'Phần trăm'
                            : voucher.discountType === 'FIXED_AMOUNT'
                              ? 'Số tiền cố định'
                              : 'Miễn phí kiểm tra'}
                        </span>
                      </div>

                      {/* Usage */}
                      <div>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-600">Lượt sử dụng</span>
                          <span className="font-semibold text-gray-900">
                            {voucher.confirmedUsages}
                            {' '}
                            /
                            {' '}
                            {voucher.maxUsageCount}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Còn lại:
                          {' '}
                          {voucher.remainingGlobalCount}
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Bắt đầu</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {new Date(voucher.validFrom).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Kết thúc</span>
                          </div>
                          <span
                            className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}
                          >
                            {new Date(voucher.validTo).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with buttons */}
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fetchVoucherDetails(voucher.voucherId)}
                        disabled={loadingDetails}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(voucher)}
                        disabled={loadingDetails}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4" />
                        Sửa
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fetchUsageReport(voucher.voucherId, voucher.voucherCode)}
                        disabled={loadingUsage}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-100 disabled:opacity-50"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Báo cáo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(voucher)}
                        disabled={isToggling}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                          voucher.isActive
                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                            : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        <Power className="h-4 w-4" />
                        {voucher.isActive ? 'Tắt' : 'Bật'}
                      </button>
                    </div>

                    {/* Warning below buttons */}
                    {isExpired && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        <XCircle className="h-4 w-4 flex-shrink-0" />
                        <span>Voucher đã hết hạn</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && vouchers.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Không tìm thấy voucher</h3>
          <p className="mt-2 text-sm text-gray-600">Thử thay đổi bộ lọc hoặc tạo voucher mới</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(createModal || editModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">
                {createModal ? 'Tạo voucher mới' : 'Chỉnh sửa voucher'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCreateModal(false);
                  setEditModal(false);
                  setSelectedVoucher(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Voucher Code */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mã voucher
                    {' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.voucherCode}
                    onChange={(e) => {
                      setFormData({ ...formData, voucherCode: e.target.value.toUpperCase() });
                      if (e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, voucherCode: false }));
                      }
                    }}
                    className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                      errors.voucherCode
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    placeholder="VD: SAVE10"
                  />
                  {errors.voucherCode && (
                    <p className="mt-1 text-sm text-red-600">Vui lòng nhập mã voucher</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mô tả
                    {' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.voucherDescription}
                    onChange={(e) => {
                      setFormData({ ...formData, voucherDescription: e.target.value });
                      if (e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, voucherDescription: false }));
                      }
                    }}
                    rows={3}
                    className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                      errors.voucherDescription
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
                    placeholder="Mô tả chi tiết về voucher..."
                  />
                  {errors.voucherDescription && (
                    <p className="mt-1 text-sm text-red-600">Vui lòng nhập mô tả</p>
                  )}
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Loại giảm giá
                      {' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={e => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                    >
                      <option value="PERCENTAGE">Phần trăm (%)</option>
                      <option value="FIXED_AMOUNT">Số tiền cố định (đ)</option>
                      <option value="FREE_CHECKING">Miễn phí kiểm tra</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Giá trị giảm
                      {' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => {
                        setFormData({ ...formData, discountValue: Number(e.target.value) });
                        if (Number(e.target.value) > 0) {
                          setErrors(prev => ({ ...prev, discountValue: false }));
                        }
                      }}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                        errors.discountValue
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '50000'}
                    />
                    {errors.discountValue && (
                      <p className="mt-1 text-sm text-red-600">
                        {formData.discountType === 'PERCENTAGE' && formData.discountValue > 100
                          ? 'Giá trị không vượt quá 100%'
                          : 'Vui lòng nhập giá trị > 0'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Max Discount & Min Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maxDiscountAmount" className="mb-2 block text-sm font-medium text-gray-700">
                      Giảm tối đa (đ)
                    </label>
                    <input
                      id="maxDiscountAmount"
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={e => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      placeholder="200000"
                    />
                  </div>

                  <div>
                    <label htmlFor="minimumOrderAmount" className="mb-2 block text-sm font-medium text-gray-700">
                      Đơn hàng tối thiểu (đ)
                    </label>
                    <input
                      id="minimumOrderAmount"
                      type="number"
                      value={formData.minimumOrderAmount}
                      onChange={e => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                      placeholder="300000"
                    />
                  </div>
                </div>

                {/* Valid From & Valid To */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                      {' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validFrom ? new Date(formData.validFrom).toISOString().slice(0, 16) : ''}
                      min={createModal ? new Date().toISOString().slice(0, 16) : undefined}
                      onChange={(e) => {
                        setFormData({ ...formData, validFrom: new Date(e.target.value).toISOString() });
                        if (e.target.value) {
                          setErrors(prev => ({ ...prev, validFrom: false }));
                        }
                      }}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                        errors.validFrom
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.validFrom && (
                      <p className="mt-1 text-sm text-red-600">
                        {createModal ? 'Ngày bắt đầu phải từ hôm nay' : 'Vui lòng chọn ngày bắt đầu'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                      {' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validTo ? new Date(formData.validTo).toISOString().slice(0, 16) : ''}
                      onChange={(e) => {
                        setFormData({ ...formData, validTo: new Date(e.target.value).toISOString() });
                        if (e.target.value) {
                          setErrors(prev => ({ ...prev, validTo: false }));
                        }
                      }}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                        errors.validTo
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                    />
                    {errors.validTo && (
                      <p className="mt-1 text-sm text-red-600">Ngày kết thúc phải sau ngày bắt đầu</p>
                    )}
                  </div>
                </div>

                {/* Max Usage Count & Per User */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Số lần sử dụng tối đa
                      {' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxUsageCount}
                      onChange={(e) => {
                        setFormData({ ...formData, maxUsageCount: Number(e.target.value) });
                        if (Number(e.target.value) > 0) {
                          setErrors(prev => ({ ...prev, maxUsageCount: false }));
                        }
                      }}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                        errors.maxUsageCount
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      placeholder="100"
                    />
                    {errors.maxUsageCount && (
                      <p className="mt-1 text-sm text-red-600">
                        Vui lòng nhập số lần
                        {'>'}
                        {' '}
                        0
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Giới hạn mỗi người
                      {' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxUsagePerUserCount}
                      onChange={(e) => {
                        setFormData({ ...formData, maxUsagePerUserCount: Number(e.target.value) });
                        if (Number(e.target.value) > 0) {
                          setErrors(prev => ({ ...prev, maxUsagePerUserCount: false }));
                        }
                      }}
                      className={`w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none ${
                        errors.maxUsagePerUserCount
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      placeholder="1"
                    />
                    {errors.maxUsagePerUserCount && (
                      <p className="mt-1 text-sm text-red-600">
                        {formData.maxUsagePerUserCount > formData.maxUsageCount
                          ? 'Không được vượt quá tổng số lần'
                          : 'Vui lòng nhập giới hạn > 0'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Kích hoạt ngay
                  </label>
                </div>

                {/* Categories Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Danh mục áp dụng
                    {' '}
                    <span className="text-xs font-normal text-gray-500">(Không chọn = áp dụng tất cả)</span>
                  </label>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {categories.length > 0
                      ? (
                          categories.map(cat => (
                            <label
                              key={cat.categoryId}
                              className="flex cursor-pointer items-center gap-3 rounded-md bg-white p-2.5 transition-colors hover:bg-blue-50"
                            >
                              <input
                                type="checkbox"
                                checked={formData.categoryIds.includes(cat.categoryId)}
                                onChange={(e) => {
                                  const newIds = e.target.checked
                                    ? [...formData.categoryIds, cat.categoryId]
                                    : formData.categoryIds.filter(id => id !== cat.categoryId);
                                  setFormData({ ...formData, categoryIds: newIds });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="flex-1 text-sm text-gray-700">{cat.categoryName}</span>
                            </label>
                          ))
                        )
                      : (
                          <p className="text-center text-sm text-gray-400 italic">Đang tải danh mục...</p>
                        )}
                  </div>
                  {formData.categoryIds.length > 0 && (
                    <p className="mt-2 text-xs text-blue-600">
                      Đã chọn:
                      {' '}
                      {formData.categoryIds.length}
                      {' '}
                      danh mục
                    </p>
                  )}
                </div>

                {/* Services Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Dịch vụ áp dụng
                    {' '}
                    <span className="text-xs font-normal text-gray-500">(Không chọn = áp dụng tất cả)</span>
                  </label>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {services.length > 0
                      ? (
                          services.map(service => (
                            <label
                              key={service.id}
                              className="flex cursor-pointer items-center gap-3 rounded-md bg-white p-2.5 transition-colors hover:bg-green-50"
                            >
                              <input
                                type="checkbox"
                                checked={formData.serviceIds.includes(service.id)}
                                onChange={(e) => {
                                  const newIds = e.target.checked
                                    ? [...formData.serviceIds, service.id]
                                    : formData.serviceIds.filter(id => id !== service.id);
                                  setFormData({ ...formData, serviceIds: newIds });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                              />
                              <span className="flex-1 text-sm text-gray-700">{service.serviceName}</span>
                            </label>
                          ))
                        )
                      : (
                          <p className="text-center text-sm text-gray-400 italic">Đang tải dịch vụ...</p>
                        )}
                  </div>
                  {formData.serviceIds.length > 0 && (
                    <p className="mt-2 text-xs text-green-600">
                      Đã chọn:
                      {' '}
                      {formData.serviceIds.length}
                      {' '}
                      dịch vụ
                    </p>
                  )}
                </div>

                {/* Payment Methods Info */}
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-2">
                      <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">Phương thức thanh toán</p>
                      <p className="mt-1 text-sm text-purple-700">
                        Voucher tự động áp dụng cho mọi phương thức thanh toán
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setCreateModal(false);
                  setEditModal(false);
                  setSelectedVoucher(null);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={createModal ? submitCreate : submitEdit}
                disabled={isCreating || isUpdating}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Đang xử lý...' : createModal ? 'Tạo voucher' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal && voucherDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết Voucher</h3>
              <button
                type="button"
                onClick={() => {
                  setDetailsModal(false);
                  setVoucherDetails(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Code */}
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                  <p className="text-sm text-blue-700">Mã Voucher</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">{voucherDetails.voucherCode}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600">Mô tả</p>
                  <p className="mt-1 text-gray-900">{voucherDetails.voucherDescription}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Loại giảm giá</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {voucherDetails.discountType === 'PERCENTAGE'
                        ? 'Phần trăm'
                        : voucherDetails.discountType === 'FIXED_AMOUNT'
                          ? 'Số tiền cố định'
                          : 'Miễn phí kiểm tra'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá trị giảm</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {voucherDetails.discountValue.toLocaleString('vi-VN')}
                      {' '}
                      {voucherDetails.discountType === 'PERCENTAGE' ? '%' : 'đ'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giảm tối đa</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {voucherDetails.maxDiscountAmount.toLocaleString('vi-VN')}
                      {' '}
                      đ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Đơn hàng tối thiểu</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {voucherDetails.minimumOrderAmount.toLocaleString('vi-VN')}
                      {' '}
                      đ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số lần dùng tối đa</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {voucherDetails.maxUsageCount.toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giới hạn mỗi người</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {voucherDetails.maxUsagePerUserCount}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {new Date(voucherDetails.validFrom).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày kết thúc</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {new Date(voucherDetails.validTo).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ngày tạo</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {new Date(voucherDetails.createdDate).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <p className="mt-1">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            voucherDetails.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {voucherDetails.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Summary */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 font-semibold text-gray-900">Thống kê sử dụng</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Đang chờ</p>
                      <p className="mt-1 text-xl font-bold text-yellow-600">
                        {voucherDetails.usageSummary.pending}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Đã xác nhận</p>
                      <p className="mt-1 text-xl font-bold text-green-600">
                        {voucherDetails.usageSummary.confirmed}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Đã hủy</p>
                      <p className="mt-1 text-xl font-bold text-red-600">
                        {voucherDetails.usageSummary.released}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hết hạn</p>
                      <p className="mt-1 text-xl font-bold text-gray-600">
                        {voucherDetails.usageSummary.expired}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tổng giảm giá đã cấp</span>
                      <span className="font-bold text-green-600">
                        {voucherDetails.usageSummary.totalDiscountGranted.toLocaleString('vi-VN')}
                        {' '}
                        đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tổng giá trị đơn hàng gốc</span>
                      <span className="font-bold text-gray-900">
                        {voucherDetails.usageSummary.totalOriginalAmount.toLocaleString('vi-VN')}
                        {' '}
                        đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="mb-2 text-sm text-gray-600">Danh mục áp dụng</p>
                  {voucherDetails.categoryNames.length > 0
                    ? (
                        <div className="flex flex-wrap gap-2">
                          {voucherDetails.categoryNames.map(cat => (
                            <span
                              key={cat}
                              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )
                    : (
                        <p className="text-sm text-gray-500 italic">Áp dụng cho tất cả danh mục</p>
                      )}
                </div>

                {/* Services */}
                <div>
                  <p className="mb-2 text-sm text-gray-600">Dịch vụ áp dụng</p>
                  {voucherDetails.serviceNames.length > 0
                    ? (
                        <div className="flex flex-wrap gap-2">
                          {voucherDetails.serviceNames.map(srv => (
                            <span
                              key={srv}
                              className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      )
                    : (
                        <p className="text-sm text-gray-500 italic">Áp dụng cho tất cả dịch vụ</p>
                      )}
                </div>

                {/* Payment Methods */}
                <div>
                  <p className="mb-2 text-sm text-gray-600">Phương thức thanh toán</p>
                  {voucherDetails.paymentMethodNames.length > 0
                    ? (
                        <div className="flex flex-wrap gap-2">
                          {voucherDetails.paymentMethodNames.map(pm => (
                            <span
                              key={pm}
                              className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                            >
                              {pm}
                            </span>
                          ))}
                        </div>
                      )
                    : (
                        <p className="text-sm text-gray-500 italic">Áp dụng cho tất cả phương thức thanh toán</p>
                      )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setDetailsModal(false);
                  setVoucherDetails(null);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Usage Report Modal */}
      {usageModal && usageReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-900">Báo cáo sử dụng Voucher</h3>
              <button
                type="button"
                onClick={() => {
                  setUsageModal(false);
                  setUsageReport(null);
                }}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Voucher Code */}
                <div className="rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4">
                  <p className="text-sm text-purple-700">Mã Voucher</p>
                  <p className="mt-1 text-2xl font-bold text-purple-900">{usageReport.voucherCode}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-700">Đang chờ xử lý</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-800">
                      {usageReport.pendingReservations}
                    </p>
                  </div>

                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-sm text-green-700">Đã xác nhận</p>
                    <p className="mt-2 text-3xl font-bold text-green-800">
                      {usageReport.confirmedCount}
                    </p>
                  </div>

                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">Đã hủy/Trả lại</p>
                    <p className="mt-2 text-3xl font-bold text-red-800">
                      {usageReport.releasedCount}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">Hết hạn</p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">
                      {usageReport.expiredCount}
                    </p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-3 font-semibold text-blue-900">Tổng kết tài chính</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Tổng giảm giá đã cấp</span>
                      <span className="text-lg font-bold text-blue-900">
                        {usageReport.totalDiscountGranted.toLocaleString('vi-VN')}
                        {' '}
                        đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Tổng giá trị đơn hàng gốc</span>
                      <span className="text-lg font-bold text-blue-900">
                        {usageReport.totalOriginalAmount.toLocaleString('vi-VN')}
                        {' '}
                        đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-blue-200 pt-2">
                      <span className="text-sm text-blue-700">Tỷ lệ giảm giá</span>
                      <span className="text-lg font-bold text-blue-900">
                        {usageReport.totalOriginalAmount > 0
                          ? (
                              (usageReport.totalDiscountGranted / usageReport.totalOriginalAmount)
                              * 100
                            ).toFixed(2)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Generated Time */}
                <p className="text-center text-xs text-gray-500">
                  Báo cáo được tạo lúc:
                  {' '}
                  {new Date(usageReport.generatedAtUtc).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setUsageModal(false);
                  setUsageReport(null);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
