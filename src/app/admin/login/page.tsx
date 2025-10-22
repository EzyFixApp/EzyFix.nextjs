/**
 * Admin Login Page
 * Authentication page for EzyFix Admin Portal
 */

'use client';

import { AlertCircle, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

import { useAuth } from '@/hooks/useAuth';

// Component to handle URL error params with Suspense boundary
function ErrorHandler() {
  const searchParams = useSearchParams();

  // Check for error in URL (e.g., insufficient permissions)
  const urlError = searchParams.get('error');
  const permissionError = urlError === 'insufficient_permissions'
    ? 'You do not have permission to access Admin Portal. Admin role required.'
    : null;

  // Show permission error toast
  useEffect(() => {
    if (permissionError) {
      toast.error(permissionError, {
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  }, [permissionError]);

  return null;
}

function AdminLoginForm() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password', {
        duration: 3000,
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    try {
      await login(formData);
      // Login successful - show success toast and redirect
      toast.success('Login successful! Redirecting...', {
        duration: 2000,
        icon: <ShieldCheck className="h-5 w-5" />,
      });
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } catch (error: any) {
      // Login failed - show error toast with message from error or backend
      // Use displayMessage from error object for immediate feedback
      const errorMessage = error?.displayMessage || error?.message || authError || 'Login failed. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFFFFF] via-[#E0F2FE] to-[#93C5FD]">
      <Toaster position="top-center" richColors closeButton />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold">
            <span className="bg-gradient-to-r from-[#C3EAFA] to-[#5E9BEF] bg-clip-text text-transparent">
              EzyFix
            </span>
          </h1>
          <p className="text-sm text-gray-600">Admin Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 text-gray-900 transition-colors outline-none focus:border-[#609CEF] focus:ring-2 focus:ring-[#609CEF] disabled:cursor-not-allowed disabled:bg-gray-100"
                placeholder="admin@ezyfix.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-11 text-gray-900 transition-colors outline-none focus:border-[#609CEF] focus:ring-2 focus:ring-[#609CEF] disabled:cursor-not-allowed disabled:bg-gray-100"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-6 py-3 font-bold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </span>
                )
              : (
                  'Login'
                )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            EzyFix Admin Portal ©
            {' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AdminLoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>
      <AdminLoginForm />
    </>
  );
}
