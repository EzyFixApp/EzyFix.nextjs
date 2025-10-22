/**
 * Admin Template
 * Wraps all admin pages (except login) with PortalLayoutClient and ProtectedRoute
 */

'use client';

import { usePathname } from 'next/navigation';

import PortalLayoutClient from '@/components/PortalLayoutClient';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page doesn't need the portal layout or protection
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // All other admin pages are protected and use the portal layout
  return (
    <ProtectedRoute>
      <PortalLayoutClient>{children}</PortalLayoutClient>
    </ProtectedRoute>
  );
}
