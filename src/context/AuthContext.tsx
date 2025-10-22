/**
 * Authentication Context
 * Provides global auth state management
 */

'use client';

import type { ReactNode } from 'react';

import type { AuthUser, LoginRequest } from '@/types/api';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { getErrorMessage } from '@/libs/ApiClient';
import authService from '@/libs/AuthService';
import { getRoleFromJWT } from '@/utils/jwt';

// ========================================
// Types
// ========================================
export type AuthContextType = {
  // State
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
};

// ========================================
// Context
// ========================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// Provider Props
// ========================================
type AuthProviderProps = {
  children: ReactNode;
};

// ========================================
// Auth Provider Component
// ========================================
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useMemo(() => !!user, [user]);

  /**
   * Load current user from API
   */
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if token exists
      if (!authService.isAuthenticated()) {
        setUser(null);
        return;
      }

      // Fetch current user
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      // Silent fail - user will be redirected by ProtectedRoute
      setError(getErrorMessage(err));
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.is_success && response.data) {
        // Decode JWT to get role
        const role = response.data.accessToken
          ? getRoleFromJWT(response.data.accessToken)
          : null;

        // Convert login response data to AuthUser
        const authUser: AuthUser = {
          id: response.data.id,
          email: response.data.email,
          fullName: response.data.fullName,
          avatarLink: response.data.avatarLink,
          isActive: response.data.isActive,
          isPasswordExpired: response.data.isPasswordExpired,
          role: role || undefined,
        };
        setUser(authUser);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setUser(null);
      // Throw error with message so login page can catch and display it immediately
      const error = new Error(errorMessage);
      (error as any).displayMessage = errorMessage;
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch {
      // Silent fail - just clear user state
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Load user on mount
   */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Context value
   */
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
      refreshUser,
      clearError,
    }),
    [user, isAuthenticated, isLoading, error, login, logout, refreshUser, clearError],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export { AuthContext };
