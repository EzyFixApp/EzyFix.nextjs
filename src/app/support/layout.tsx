import type { Metadata } from 'next';

import { AuthProvider } from '@/context/AuthContext';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'EzyFix Support Portal',
  description: 'EzyFix Customer Support Management Portal',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
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
