'use client';

import {
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

import { mockSupportConversations } from '@/libs/admin-data';

export default function ChatPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredConversations = statusFilter === 'All'
    ? mockSupportConversations
    : mockSupportConversations.filter(c => c.Status === statusFilter);

  const statusCounts = {
    All: mockSupportConversations.length,
    Waiting: mockSupportConversations.filter(c => c.Status === 'Waiting').length,
    InProgress: mockSupportConversations.filter(c => c.Status === 'InProgress').length,
    Resolved: mockSupportConversations.filter(c => c.Status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hỗ trợ Chat</h2>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý các cuộc trò chuyện hỗ trợ
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(['All', 'Waiting', 'InProgress', 'Resolved'] as const).map(status => (
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
            {status === 'All' && `Tất cả (${statusCounts.All})`}
            {status === 'Waiting' && `Chờ phản hồi (${statusCounts.Waiting})`}
            {status === 'InProgress' && `Đang xử lý (${statusCounts.InProgress})`}
            {status === 'Resolved' && `Đã xong (${statusCounts.Resolved})`}
          </button>
        ))}
      </div>

      {/* Conversations Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredConversations.map(conv => (
          <div
            key={conv.ConversationId}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {conv.CustomerAvatar
                    ? (
                        <img
                          src={conv.CustomerAvatar}
                          alt={conv.CustomerName}
                          className="h-12 w-12 rounded-full"
                        />
                      )
                    : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                          {conv.CustomerName[0]}
                        </div>
                      )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{conv.CustomerName}</h3>
                    <p className="text-sm text-gray-600">{conv.Subject}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${
                    conv.Status === 'Waiting'
                      ? 'bg-orange-100 text-orange-700'
                      : conv.Status === 'InProgress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {conv.Status === 'Waiting' ? 'Chờ phản hồi' : conv.Status === 'InProgress' ? 'Đang xử lý' : 'Đã xong'}
                </span>
                {conv.UnreadCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                    {conv.UnreadCount}
                    {' '}
                    tin mới
                  </span>
                )}
              </div>
            </div>

            <div className="flex min-h-[180px] flex-col p-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(conv.LastMessageAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {conv.AssignedTo && (
                  <div className="text-sm text-gray-600">
                    <span className="text-xs">
                      Phụ trách:
                      {' '}
                      <span className="font-medium text-gray-900">{conv.AssignedTo}</span>
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <MessageSquare className="h-4 w-4" />
                Mở chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
