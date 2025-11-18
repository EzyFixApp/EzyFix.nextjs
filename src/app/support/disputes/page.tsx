'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Mock data theo API structure từ DisputeManagement.md
const MOCK_DISPUTES = [
  {
    disputeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afa7',
    customerName: 'Nguyễn Văn A',
    technicianName: 'Trần Văn B',
    reason: 'Thợ không sửa được, yêu cầu hoàn tiền',
    status: 'IN_REVIEW' as const,
    amount: 650000.0,
    createdDate: '2025-11-16T12:00:00Z',
    daysOpen: 2,
    raisedBy: 'CUSTOMER',
  },
  {
    disputeId: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afa8',
    customerName: 'Lê Thị C',
    technicianName: 'Phạm Văn D',
    reason: 'Khách hàng không thanh toán đủ',
    status: 'OPEN' as const,
    amount: 450000.0,
    createdDate: '2025-11-17T08:30:00Z',
    daysOpen: 1,
    raisedBy: 'TECHNICIAN',
  },
  {
    disputeId: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afa9',
    customerName: 'Hoàng Văn E',
    technicianName: 'Ngô Văn F',
    reason: 'Dịch vụ không đúng như mô tả',
    status: 'RESOLVED' as const,
    amount: 800000.0,
    createdDate: '2025-11-10T14:20:00Z',
    daysOpen: 8,
    raisedBy: 'CUSTOMER',
    resolvedDate: '2025-11-15T16:45:00Z',
    resolution: 'PARTIAL_REFUND',
    resolutionNotes: 'Hoàn tiền 50% vì dịch vụ thực hiện một phần',
  },
  {
    disputeId: '3fa85f64-5717-4562-b3fc-2c963f66afa9',
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afb0',
    customerName: 'Đỗ Thị G',
    technicianName: 'Vũ Văn H',
    reason: 'Thiết bị bị hỏng thêm sau khi sửa',
    status: 'OPEN' as const,
    amount: 1200000.0,
    createdDate: '2025-11-18T10:15:00Z',
    daysOpen: 0,
    raisedBy: 'CUSTOMER',
  },
  {
    disputeId: '3fa85f64-5717-4562-b3fc-2c963f66afb0',
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afb1',
    customerName: 'Bùi Văn I',
    technicianName: 'Đinh Thị K',
    reason: 'Tranh chấp về giá phụ kiện',
    status: 'IN_REVIEW' as const,
    amount: 350000.0,
    createdDate: '2025-11-15T11:00:00Z',
    daysOpen: 3,
    raisedBy: 'TECHNICIAN',
  },
  {
    disputeId: '3fa85f64-5717-4562-b3fc-2c963f66afb1',
    appointmentId: '4fa85f64-5717-4562-b3fc-2c963f66afb2',
    customerName: 'Mai Văn L',
    technicianName: 'Lý Văn M',
    reason: 'Yêu cầu hoàn tiền toàn bộ do chất lượng kém',
    status: 'RESOLVED' as const,
    amount: 950000.0,
    createdDate: '2025-11-08T09:30:00Z',
    daysOpen: 10,
    raisedBy: 'CUSTOMER',
    resolvedDate: '2025-11-14T14:20:00Z',
    resolution: 'FAVOR_CUSTOMER',
    resolutionNotes: 'Xác nhận chất lượng không đạt. Hoàn tiền toàn bộ cho khách hàng.',
  },
];

type DisputeStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export default function DisputesPage() {
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [_selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [_showResolveModal, setShowResolveModal] = useState(false);
  const [_showNoteModal, setShowNoteModal] = useState(false);

  // Handle actions
  const handleStartReview = async (disputeId: string) => {
    // TODO: Call API PATCH /api/admin/disputes/{id}/review
    // eslint-disable-next-line no-console
    console.log('Starting review for dispute:', disputeId);
    // Example API call:
    // const response = await axios.patch(`/api/admin/disputes/${disputeId}/review`, {
    //   adminNotes: 'Bắt đầu xem xét tranh chấp',
    //   status: 'IN_REVIEW'
    // });
    // if (response.data.isSuccess) {
    //   // Refresh dispute list or update state
    //   window.location.reload();
    // }

    // Temporary: Show alert for demo
    // eslint-disable-next-line no-alert
    window.alert(`Đã bắt đầu xem xét tranh chấp\n\nDispute ID: ${disputeId}\n\nTODO: Integrate với API:\nPATCH /api/admin/disputes/${disputeId}/review`);
  };

  const handleResolve = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    setShowResolveModal(true);
    // TODO: Show modal với các options:
    // - Resolution type: FAVOR_CUSTOMER, FAVOR_TECHNICIAN, PARTIAL_REFUND, NO_ACTION
    // - Resolution notes (textarea)
    // - Refund amount (if applicable)
    // - Adjust technician commission (checkbox)
    // - Apply technician penalty (checkbox)
    // Sau đó call API PATCH /api/admin/disputes/{id}/resolve
    // eslint-disable-next-line no-console
    console.log('Opening resolve modal for dispute:', disputeId);

    // Temporary: Show alert for demo
    // eslint-disable-next-line no-alert
    window.alert(`Giải quyết tranh chấp\n\nDispute ID: ${disputeId}\n\nTODO: Tạo modal với form:\n- Resolution type\n- Notes\n- Refund amount\n\nAPI: PATCH /api/admin/disputes/${disputeId}/resolve`);
  };

  const handleAddNote = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    setShowNoteModal(true);
    // TODO: Show modal với textarea để nhập admin message
    // Sau đó call API POST /api/admin/disputes/{id}/messages
    // Example:
    // const response = await axios.post(`/api/admin/disputes/${disputeId}/messages`, {
    //   message: 'Admin note here...'
    // });
    // eslint-disable-next-line no-console
    console.log('Opening note modal for dispute:', disputeId);

    // Temporary: Show alert for demo
    // eslint-disable-next-line no-alert
    window.alert(`Thêm ghi chú admin\n\nDispute ID: ${disputeId}\n\nTODO: Tạo modal với textarea\n\nAPI: POST /api/admin/disputes/${disputeId}/messages`);
  };

  const handleViewDetails = (disputeId: string) => {
    // TODO: Navigate to detail page hoặc show modal với full details
    // Call API GET /api/admin/disputes/{id} để lấy:
    // - Full dispute info
    // - Customer & Technician details với phone
    // - Evidence URLs (images)
    // - Activity history timeline
    // - Payment status
    // eslint-disable-next-line no-console
    console.log('Viewing details for dispute:', disputeId);

    // Temporary: Show alert for demo
    // eslint-disable-next-line no-alert
    window.alert(`Xem chi tiết tranh chấp\n\nDispute ID: ${disputeId}\n\nTODO: Tạo trang chi tiết với:\n- Full info\n- Evidence photos\n- Activity timeline\n- Customer & Technician contact\n\nAPI: GET /api/admin/disputes/${disputeId}`);
  };

  // Filter disputes
  const filteredDisputes = useMemo(() => {
    let filtered = MOCK_DISPUTES;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.customerName.toLowerCase().includes(search)
          || d.technicianName.toLowerCase().includes(search)
          || d.reason.toLowerCase().includes(search),
      );
    }

    return filtered;
  }, [statusFilter, searchTerm]);

  // Calculate summary
  const summary = useMemo(() => {
    return {
      totalDisputes: MOCK_DISPUTES.length,
      openDisputes: MOCK_DISPUTES.filter(d => d.status === 'OPEN').length,
      inReviewDisputes: MOCK_DISPUTES.filter(d => d.status === 'IN_REVIEW').length,
      resolvedDisputes: MOCK_DISPUTES.filter(d => d.status === 'RESOLVED').length,
    };
  }, []);

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: DisputeStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Chưa xử lý
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Clock className="h-3.5 w-3.5" />
            Đang xem xét
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Đã giải quyết
          </span>
        );
      default:
        return null;
    }
  };

  // Get resolution badge
  const getResolutionBadge = (resolution?: string) => {
    switch (resolution) {
      case 'FAVOR_CUSTOMER':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            Ưu ái khách hàng
          </span>
        );
      case 'FAVOR_TECHNICIAN':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700">
            <CheckCircle className="h-3 w-3" />
            Ưu ái thợ
          </span>
        );
      case 'PARTIAL_REFUND':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700">
            <DollarSign className="h-3 w-3" />
            Hoàn tiền một phần
          </span>
        );
      case 'NO_ACTION':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
            <AlertCircle className="h-3 w-3" />
            Không xử lý
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý tranh chấp</h2>
          <p className="mt-1 text-sm text-gray-600">
            Xử lý các tranh chấp giữa khách hàng và thợ
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng tranh chấp</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{summary.totalDisputes}</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Chưa xử lý</p>
              <p className="mt-1 text-2xl font-bold text-red-900">{summary.openDisputes}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Đang xem xét</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">{summary.inReviewDisputes}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Đã giải quyết</p>
              <p className="mt-1 text-2xl font-bold text-green-900">{summary.resolvedDisputes}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng, thợ, hoặc lý do..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {(['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED'] as const).map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' && 'Tất cả'}
              {status === 'OPEN' && 'Chưa xử lý'}
              {status === 'IN_REVIEW' && 'Đang xem xét'}
              {status === 'RESOLVED' && 'Đã giải quyết'}
            </button>
          ))}
        </div>
      </div>

      {/* Disputes List */}
      {filteredDisputes.length === 0
        ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Không tìm thấy tranh chấp
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Thử thay đổi bộ lọc hoặc tìm kiếm khác
              </p>
            </div>
          )
        : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredDisputes.map(dispute => (
                <div
                  key={dispute.disputeId}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(dispute.status)}
                          <span className="text-xs text-gray-500">
                            {formatDate(dispute.createdDate)}
                            {' '}
                            •
                            {' '}
                            {dispute.daysOpen}
                            {' '}
                            ngày
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                          {dispute.reason}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Giá trị</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {formatCurrency(dispute.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Raised By Badge */}
                    <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5">
                      {dispute.raisedBy === 'CUSTOMER'
                        ? (
                            <>
                              <User className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-900">
                                Khiếu nại bởi: Khách hàng
                              </span>
                            </>
                          )
                        : (
                            <>
                              <Users className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-900">
                                Khiếu nại bởi: Thợ
                              </span>
                            </>
                          )}
                    </div>

                    {/* Participants */}
                    <div className="mt-4 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Khách hàng</p>
                          <p className="font-medium text-gray-900">{dispute.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Thợ</p>
                          <p className="font-medium text-gray-900">{dispute.technicianName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center gap-3">
                      {dispute.status === 'OPEN' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartReview(dispute.disputeId)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                          >
                            <TrendingUp className="h-4 w-4" />
                            Bắt đầu xem xét
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewDetails(dispute.disputeId)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                            Chi tiết
                          </button>
                        </>
                      )}

                      {dispute.status === 'IN_REVIEW' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleResolve(dispute.disputeId)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Giải quyết
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddNote(dispute.disputeId)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Ghi chú
                          </button>
                          <button
                            type="button"
                            onClick={() => handleViewDetails(dispute.disputeId)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                            Chi tiết
                          </button>
                        </>
                      )}

                      {dispute.status === 'RESOLVED' && (
                        <button
                          type="button"
                          onClick={() => handleViewDetails(dispute.disputeId)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                          Xem chi tiết
                        </button>
                      )}
                    </div>

                    {/* Resolution Info (if resolved) - Moved below buttons */}
                    {dispute.status === 'RESOLVED' && dispute.resolutionNotes && (
                      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          {getResolutionBadge(dispute.resolution)}
                          <span className="text-xs text-green-700">
                            Giải quyết:
                            {' '}
                            {formatDate(dispute.resolvedDate!)}
                          </span>
                        </div>
                        <p className="text-sm text-green-800">{dispute.resolutionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}
