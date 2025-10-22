# API Integration Guide - EzyFix Platform

## 📋 Tổng quan

Document này mô tả chi tiết cách tích hợp Backend API vào EzyFix Admin Portal và Support Portal.

**Backend URL:** `https://ezyfix.up.railway.app/api/v1`
**API Documentation:** [Scalar API Docs](https://ezyfix.up.railway.app/docs)

---

## 🏗️ Kiến trúc đã triển khai

### 1. Core Infrastructure

#### **Environment Configuration** (`.env.local`)
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://ezyfix.up.railway.app
NEXT_PUBLIC_API_VERSION=v1

# Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=ezyfix_auth_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=ezyfix_refresh_token

# Development
NEXT_PUBLIC_ENABLE_API_LOGGING=true
```

#### **TypeScript Types** (`src/types/api.ts`)
Định nghĩa đầy đủ các types cho API responses:
- `ApiResponse<T>` - Generic wrapper cho tất cả responses
- `AuthResponse` - Response từ authentication endpoints
- `AuthUser` - User object structure
- `PaginationMeta` - Metadata cho paginated responses
- `ApiError` - Error response structure

#### **API Client** (`src/libs/ApiClient.ts`)
Axios instance với:
- **Request Interceptor:** Tự động attach Bearer token
- **Response Interceptor:** Xử lý 401 errors và redirect
- **Error Handler:** Extract user-friendly error messages
- **Logging:** Development mode logging

```typescript
import apiClient from '@/libs/ApiClient';

// Example usage
const response = await apiClient.get('/users');
const data = await apiClient.post('/auth/login', { email, password });
```

---

## 🔐 Authentication System

### Components

#### **AuthService** (`src/libs/AuthService.ts`)
Service class chứa các authentication methods:

```typescript
// Available methods
AuthService.login(email: string, password: string): Promise<ApiResponse<AuthResponse>>
AuthService.logout(): Promise<void>
AuthService.getCurrentUser(): Promise<ApiResponse<AuthUser>>
AuthService.refreshToken(): Promise<ApiResponse<AuthResponse>>
AuthService.isAuthenticated(): boolean
AuthService.forgotPassword(email: string): Promise<ApiResponse<void>>
AuthService.changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>>
```

#### **AuthContext** (`src/context/AuthContext.tsx`)
Global state management với:
- `user: AuthUser | null` - Current user data
- `login(email, password)` - Login function
- `logout()` - Logout function
- `isLoading: boolean` - Loading state
- `error: string | null` - Error state

#### **useAuth Hook** (`src/hooks/useAuth.ts`)
Custom hook để access auth context:

```typescript
'use client';

import { use } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

#### **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
Component bảo vệ routes với portal-aware redirect:

```typescript
// Auto redirects to /admin/login or /support/login based on pathname
<ProtectedRoute>
  <YourProtectedContent />
</ProtectedRoute>
```

---

## 🚀 Cách sử dụng trong Pages

### Admin/Support Portal Layout Structure

```
src/app/admin/
├── layout.tsx          # Wraps with AuthProvider
├── template.tsx        # Conditionally wraps with ProtectedRoute
├── login/
│   └── page.tsx       # Public login page
├── users/
│   └── page.tsx       # Protected page
└── services/
    └── page.tsx       # Protected page
```

### Example: Login Page

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const { login, isLoading, error: authError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      router.push('/admin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example: Protected Page with Data Fetching

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import apiClient from '@/libs/ApiClient';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await apiClient.get('/admin/users');
        setUsers(response.data.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {/* Display users data */}
    </div>
  );
}
```

---

## 📡 API Endpoints Status

### ✅ Đã tích hợp (Completed)

#### Authentication Endpoints
- `POST /api/v1/auth/login`
  - **Status:** ✅ Fully Integrated & Tested
  - **Used in:** `src/libs/AuthService.ts`, `src/context/AuthContext.tsx`
  - **Components:** Admin/Support login pages
  - **Request Body:**
    ```json
    {
      "email": "mai.linh.customer@ezyfix.vn",
      "password": "ezyfix123456"
    }
    ```
  - **Response Structure:**
    ```json
    {
      "status_code": 200,
      "message": "Login successful",
      "reason": null,
      "is_success": true,
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "0f2e4d7a-5b89-4c16-88be-47bffbdcc4a3",
        "id": "d6d375f6-3a8d-478d-ac84-51fb5c315743",
        "fullName": "Mai",
        "email": "mai.linh.customer@ezyfix.vn",
        "isActive": true,
        "avatarLink": "https://cdn.ezyfix.com/users/mai-linh.png",
        "isPasswordExpired": false
      }
    }
    ```
  - **Implementation Notes:**
    - Tokens are automatically stored in localStorage
    - User data is converted to `AuthUser` type and stored in AuthContext
    - Successful login redirects to appropriate portal dashboard
    - Error messages are extracted from `message` or `reason` fields

- `DELETE /api/v1/auth/delete-refresh-token`
  - **Status:** ✅ Integrated
  - **Used in:** `src/libs/AuthService.ts`
  - **Components:** Sidebar logout button
  - **Parameters:** `refreshToken` (query param)
  - **Response:** `204 No Content`
  - **Implementation Notes:**
    - Revokes the refresh token on backend to prevent reuse
    - Always clears localStorage regardless of API response
    - Called via `apiClient.delete()` with query params

- `GET /api/v1/auth/me`
  - **Status:** ✅ Integrated
  - **Used in:** `src/libs/AuthService.ts`
  - **Components:** AuthContext (load user on mount)

- `POST /api/v1/auth/refresh-token`
  - **Status:** ✅ Integrated
  - **Used in:** `src/libs/AuthService.ts`
  - **Auto-triggered:** On 401 responses

### 🔄 Đang chờ tích hợp (Pending)

#### Admin - User Management
- `GET /api/v1/admin/users`
  - **Status:** ⏳ Pending
  - **Target page:** `src/app/admin/users/page.tsx`
  - **Required params:** `page`, `limit`, `search`, `role`, `status`
  - **Required response:** User list with pagination

- `GET /api/v1/admin/users/:id`
  - **Status:** ⏳ Pending
  - **Usage:** User detail modal/page

- `PUT /api/v1/admin/users/:id`
  - **Status:** ⏳ Pending
  - **Usage:** Update user information

- `PATCH /api/v1/admin/users/:id/status`
  - **Status:** ⏳ Pending
  - **Usage:** Toggle active/inactive status

#### Admin - Service Management
- `GET /api/v1/admin/services`
  - **Status:** ⏳ Pending
  - **Target page:** `src/app/admin/services/page.tsx`

- `POST /api/v1/admin/services`
  - **Status:** ⏳ Pending
  - **Usage:** Create new service

- `PUT /api/v1/admin/services/:id`
  - **Status:** ⏳ Pending
  - **Usage:** Update service

- `DELETE /api/v1/admin/services/:id`
  - **Status:** ⏳ Pending
  - **Usage:** Delete service

#### Admin - Voucher Management
- `GET /api/v1/admin/vouchers`
  - **Status:** ⏳ Pending
  - **Target page:** `src/app/admin/vouchers/page.tsx`

- `POST /api/v1/admin/vouchers`
  - **Status:** ⏳ Pending
  - **Usage:** Create new voucher

#### Admin - Financial
- `GET /api/v1/admin/financial/transactions`
  - **Status:** ⏳ Pending
  - **Target page:** `src/app/admin/financial/page.tsx`

- `GET /api/v1/admin/financial/revenue`
  - **Status:** ⏳ Pending
  - **Usage:** Dashboard revenue stats

#### Support Portal
- `GET /api/v1/support/tickets`
  - **Status:** ⏳ Pending
  - **Target page:** `src/app/support/disputes/page.tsx`

- `GET /api/v1/support/chats`
  - **Status:** ⏳ Pending
  - **Target page:** `src/app/support/chat/page.tsx`

---

## 🛠️ Hướng dẫn tích hợp API mới

### Bước 1: Định nghĩa Types (nếu cần)

Thêm types mới vào `src/types/api.ts`:

```typescript
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'support' | 'customer' | 'technician';
  status: 'active' | 'inactive';
  createdAt: string;
};

export type UsersResponse = {
  users: User[];
  pagination: PaginationMeta;
};
```

### Bước 2: Tạo Service Class

Tạo file mới `src/libs/UserService.ts`:

```typescript
import type { ApiResponse } from '@/types/api';
import apiClient from './ApiClient';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
};

class UserServiceClass {
  async getUsers(params: GetUsersParams = {}): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
  }

  async toggleUserStatus(id: string): Promise<ApiResponse<User>> {
    const response = await apiClient.patch(`/admin/users/${id}/status`);
    return response.data;
  }
}

export const UserService = new UserServiceClass();
```

### Bước 3: Tạo Custom Hook (Optional)

Tạo `src/hooks/useUsers.ts`:

```typescript
'use client';

import type { User } from '@/libs/UserService';
import { useEffect, useState } from 'react';
import { UserService } from '@/libs/UserService';

export function useUsers(params = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await UserService.getUsers(params);
        setUsers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [JSON.stringify(params)]);

  return { users, loading, error, refetch: () => {} };
}
```

### Bước 4: Sử dụng trong Page

Update `src/app/admin/users/page.tsx`:

```typescript
'use client';

import { useUsers } from '@/hooks/useUsers';

export default function UsersPage() {
  const { users, loading, error } = useUsers({ page: 1, limit: 10 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Check if token is stored correctly in localStorage and still valid.

```typescript
// Debug auth state
console.log('Token:', localStorage.getItem('ezyfix_auth_token'));
console.log('Authenticated:', AuthService.isAuthenticated());
```

### Issue: CORS errors
**Solution:** Backend must allow `https://yourdomain.com` in CORS settings.

### Issue: useAuth must be used within AuthProvider
**Solution:** Make sure component is wrapped with `AuthProvider` in layout.tsx:

```typescript
// src/app/admin/layout.tsx
import { AuthProvider } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

---

## 📝 Best Practices

1. **Always use TypeScript types** - Define interfaces for all API responses
2. **Error handling** - Use try-catch and display user-friendly messages
3. **Loading states** - Show loading indicators during API calls
4. **Token refresh** - Already handled automatically by interceptors
5. **Logout on 401** - Already handled automatically
6. **API logging** - Use `NEXT_PUBLIC_ENABLE_API_LOGGING=true` in development

---

## 🎯 Next Steps

1. **Cung cấp API documentation** - Cần response schemas chi tiết từ Scalar docs
2. **Tạo Service classes** - UserService, ServiceService, VoucherService, etc.
3. **Implement data fetching** - Replace mock data với real API calls
4. **Add pagination** - Implement pagination controls
5. **Search & filters** - Add search and filter functionality
6. **Real-time updates** - Consider WebSocket for chat/notifications

---

## 📚 References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Backend API Docs](https://ezyfix.up.railway.app/docs)

---

**Last Updated:** October 22, 2025
**Maintained by:** EzyFix Development Team
