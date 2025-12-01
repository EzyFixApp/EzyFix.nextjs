'use client';

import { Construction, MessagesSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-20" />
            <div className="relative rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
              <Construction className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-center gap-2">
          <MessagesSquare className="h-6 w-6 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900">Hỗ trợ Chat</h1>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-lg font-medium text-gray-700">
            Tính năng đang được phát triển
          </p>
          <p className="text-sm text-gray-500">
            Chức năng chat hỗ trợ trực tiếp với khách hàng sẽ sớm ra mắt.
          </p>
        </div>

        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Chat thời gian thực</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Quản lý cuộc hội thoại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Thông báo tin nhắn mới</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
