/**
 * useCategories Hook
 * Custom hook for managing categories with API integration
 */

import type { CategoryResponse } from '@/types/category';

import { useEffect, useState } from 'react';

import CategoryService from '@/libs/CategoryService';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(errorMessage);
        console.error('Fetch categories error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
  };
}
