'use client';

import {
  AlertTriangle,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Ticket,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';

export default function PortalLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Determine portal type based on pathname
  const isSupportPortal = pathname.startsWith('/support');

  // Admin menu items
  const adminMenuItems = [
    {
      title: 'Tổng quan',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Người dùng',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Dịch vụ',
      href: '/admin/services',
      icon: Wrench,
    },
    {
      title: 'Yêu cầu dịch vụ',
      href: '/admin/service-requests',
      icon: FileText,
    },
    {
      title: 'Lịch hẹn',
      href: '/admin/appointments',
      icon: Calendar,
    },
    {
      title: 'Voucher',
      href: '/admin/vouchers',
      icon: Ticket,
    },
    {
      title: 'Tài chính',
      href: '/admin/financial',
      icon: Wallet,
    },
  ];

  // Support menu items
  const supportMenuItems = [
    {
      title: 'Tổng quan',
      href: '/support',
      icon: LayoutDashboard,
    },
    {
      title: 'Tranh chấp',
      href: '/support/disputes',
      icon: AlertTriangle,
    },
    {
      title: 'Chat hỗ trợ',
      href: '/support/chat',
      icon: MessageSquare,
    },
  ];

  const menuItems = isSupportPortal ? supportMenuItems : adminMenuItems;
  const portalTitle = isSupportPortal ? 'Support Portal' : 'Admin Portal';
  const portalSubtitle = isSupportPortal
    ? 'Hỗ trợ khách hàng và giải quyết vấn đề'
    : 'Quản lý hệ thống EzyFix';
  const accentColor = isSupportPortal ? 'orange' : 'blue';

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/support') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            {sidebarOpen
              ? (
                  <div className="flex items-center gap-3">
                    <Image
                      src="/LogoEzyFix.png"
                      alt="EzyFix Logo"
                      width={40}
                      height={40}
                      className="h-10 w-10"
                    />
                    <div>
                      <h1 className="text-lg font-bold text-gray-800">{portalTitle}</h1>
                      <p className="text-xs text-gray-500">{portalSubtitle}</p>
                    </div>
                  </div>
                )
              : (
                  <Image
                    src="/LogoEzyFix.png"
                    alt="EzyFix Logo"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? accentColor === 'orange'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${!sidebarOpen && 'justify-center'}`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 ${!sidebarOpen && 'justify-center'}`}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Cài đặt</span>}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${!sidebarOpen && 'justify-center'}`}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Đăng xuất</span>}
            </button>
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-20 -right-3 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
          >
            {sidebarOpen
              ? <ChevronLeft className="h-4 w-4 text-gray-600" />
              : <ChevronRight className="h-4 w-4 text-gray-600" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-x-auto transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800">
                {portalTitle}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
              </button>
              <div className="flex items-center gap-3">
                {/* Temporarily use fallback avatar instead of loading from potentially broken URL */}
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${isSupportPortal ? 'from-orange-500 to-red-500' : 'from-blue-500 to-purple-500'} flex items-center justify-center text-sm font-bold text-white`}>
                  {user ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'A'}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">
                    {user ? user.fullName : 'Loading...'}
                  </p>
                  <p className="text-xs text-gray-500">{isSupportPortal ? 'Support Staff' : 'Administrator'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
