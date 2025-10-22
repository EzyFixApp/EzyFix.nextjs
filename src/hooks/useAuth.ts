/**
 * useAuth Hook
 * Convenient hook to access authentication context
 */

'use client';

import { use } from 'react';

import { AuthContext } from '@/context/AuthContext';

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = use(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
