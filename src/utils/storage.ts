/**
 * Storage Utility
 * Provides a unified interface for storing auth data
 * Uses sessionStorage for session-only persistence (cleared when browser closes)
 */

// ========================================
// Constants
// ========================================
const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'ezyfix_admin_token';
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'ezyfix_refresh_token';
const USER_DATA_KEY = 'ezyfix_user_data';

// ========================================
// Storage Type
// ========================================
// Use sessionStorage - automatically cleared when tab/browser closes
const storage = typeof window !== 'undefined' ? sessionStorage : null;

// ========================================
// Token Management
// ========================================

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  if (!storage) {
    return null;
  }
  return storage.getItem(TOKEN_KEY);
}

/**
 * Set access token
 */
export function setAccessToken(token: string): void {
  if (!storage) {
    return;
  }
  storage.setItem(TOKEN_KEY, token);
}

/**
 * Remove access token
 */
export function removeAccessToken(): void {
  if (!storage) {
    return;
  }
  storage.removeItem(TOKEN_KEY);
}

// ========================================
// Refresh Token Management
// ========================================

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  if (!storage) {
    return null;
  }
  return storage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set refresh token
 */
export function setRefreshToken(token: string): void {
  if (!storage) {
    return;
  }
  storage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Remove refresh token
 */
export function removeRefreshToken(): void {
  if (!storage) {
    return;
  }
  storage.removeItem(REFRESH_TOKEN_KEY);
}

// ========================================
// User Data Management
// ========================================

/**
 * Get user data
 */
export function getUserData(): any | null {
  if (!storage) {
    return null;
  }
  const data = storage.getItem(USER_DATA_KEY);
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Set user data
 */
export function setUserData(data: any): void {
  if (!storage) {
    return;
  }
  storage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

/**
 * Remove user data
 */
export function removeUserData(): void {
  if (!storage) {
    return;
  }
  storage.removeItem(USER_DATA_KEY);
}

// ========================================
// Clear All Auth Data
// ========================================

/**
 * Clear all authentication data
 */
export function clearAllAuthData(): void {
  removeAccessToken();
  removeRefreshToken();
  removeUserData();
}
