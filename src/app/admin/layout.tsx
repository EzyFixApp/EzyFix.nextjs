import type { Metadata } from 'next';

import { AuthProvider } from '@/context/AuthContext';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'EzyFix Admin Portal',
  description: 'EzyFix Admin Management Portal',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {/* Login page handles its own layout, other pages use PortalLayoutClient */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
