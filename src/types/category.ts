/**
 * Category Types
 */

export type CategoryResponse = {
  categoryId: string;
  categoryName: string;
  services?: any[];
};

export type CreateCategoryRequest = {
  categoryName: string;
};

export type UpdateCategoryRequest = {
  categoryName?: string;
};
