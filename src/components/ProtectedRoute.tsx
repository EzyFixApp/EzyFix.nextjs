/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

'use client';

import type { ReactNode } from 'react';

import { Loader2, ShieldAlert, ShieldX } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const loginPath = pathname.startsWith('/support') ? '/support/login' : '/admin/login';
      router.push(loginPath);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#609CEF]" />
          <p className="text-lg font-medium text-gray-700">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Authenticating your access</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access BEFORE rendering children
  if (user) {
    const userRole = user.role?.toLowerCase();
    const isAdmin = pathname.startsWith('/admin');
    const isSupport = pathname.startsWith('/support');

    // Admin portal - only allow Admin role
    if (isAdmin && userRole !== 'admin') {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <ShieldX className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mb-2 text-lg text-gray-700">You don't have permission to access the Admin Portal.</p>
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <div className="flex items-center justify-center gap-2 text-red-700">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-semibold">Admin role required</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admin/login')}
              className="w-full rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-6 py-3 font-bold text-white transition-all hover:shadow-lg"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }

    // Support portal - only allow Support role (NOT Admin)
    if (isSupport && userRole !== 'supporter') {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <ShieldX className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-gray-900">Access Denied</h1>
            <p className="mb-2 text-lg text-gray-700">You don't have permission to access the Support Portal.</p>
            <div className="mb-6 rounded-lg bg-red-50 p-4">
              <div className="flex items-center justify-center gap-2 text-red-700">
                <ShieldAlert className="h-5 w-5" />
                <span className="font-semibold">Support role required</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/support/login')}
              className="w-full rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-6 py-3 font-bold text-white transition-all hover:shadow-lg"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
