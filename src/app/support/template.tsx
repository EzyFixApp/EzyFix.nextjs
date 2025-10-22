/**
 * Support Template
 * Wraps all support pages (except login) with PortalLayoutClient and ProtectedRoute
 */

'use client';

import { usePathname } from 'next/navigation';

import PortalLayoutClient from '@/components/PortalLayoutClient';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SupportTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page doesn't need the portal layout or protection
  if (pathname === '/support/login') {
    return <>{children}</>;
  }

  // All other support pages are protected and use the portal layout
  return (
    <ProtectedRoute>
      <PortalLayoutClient>{children}</PortalLayoutClient>
    </ProtectedRoute>
  );
}
