export interface Category {
  id: string;
  name: string;
}

export interface CategoryListResponse {
  message: string;
  categories: Category[];
}

export interface SingleCategoryResponse {
  message: string;
  category: Category;
}

// New request interfaces based on category.yaml
export interface CategoryCreateRequest {
  name: string;
}

export interface CategoryUpdateRequest {
  name: string;
}
