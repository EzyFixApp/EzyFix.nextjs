/**
 * Category Service
 * Handles all category management API calls
 */

import type { ApiResponse } from '@/types/api';
import type { CategoryResponse } from '@/types/category';

import apiClient from './ApiClient';

// ========================================
// Constants
// ========================================
const CATEGORY_ENDPOINTS = {
  GET_ALL: '/categories',
  GET_BY_ID: (id: string) => `/categories/${id}`,
} as const;

// ========================================
// Category Service Class
// ========================================
class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<CategoryResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<CategoryResponse[]>>(
        CATEGORY_ENDPOINTS.GET_ALL,
      );

      if (response.data.is_success && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Get all categories error:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<CategoryResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<CategoryResponse>>(
        CATEGORY_ENDPOINTS.GET_BY_ID(id),
      );

      if (response.data.is_success && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error('Get category by ID error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new CategoryService();
