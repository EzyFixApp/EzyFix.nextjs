/**
 * JWT Token Utilities
 * Helper functions to decode and parse JWT tokens
 */

export type JWTPayload = {
  sub?: string; // User ID
  email?: string;
  role?: string;
  name?: string;
  exp?: number; // Expiration timestamp
  iat?: number; // Issued at timestamp
  [key: string]: any;
};

/**
 * Decode JWT token without verification
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64url payload
    const payload = parts[1];
    if (!payload) {
      return null;
    }

    // Base64url decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    );

    return JSON.parse(jsonPayload) as JWTPayload;
  } catch {
    // Silent fail - invalid JWT token
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false otherwise
 */
export function isJWTExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Get role from JWT token
 * @param token - JWT token string
 * @returns Role string or null
 */
export function getRoleFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  // Try different possible role field names
  return payload.role || payload.Role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
}

/**
 * Get user ID from JWT token
 * @param token - JWT token string
 * @returns User ID or null
 */
export function getUserIdFromJWT(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  return payload.sub || payload.userId || payload.id || null;
}
