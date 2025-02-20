export interface ProductImage {
  id: string;
  url: string;
  imageOrder: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: ProductImage[];
}

export interface ProductResponse {
  message: string;
  product: Product;
}

export interface ProductsResponse {
  message: string;
  products: Product[];
}

// New request interfaces based on product.yaml
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: any[]; // Adjust type as needed for file uploads
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  images?: any[]; // New images to add
  removedImageIds?: string[];
  imagesOrder?: { id: string; order: number }[];
}
