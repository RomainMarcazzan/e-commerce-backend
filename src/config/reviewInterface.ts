export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// New request interfaces based on review.yaml
export interface ReviewCreateRequest {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewUpdateRequest {
  rating?: number;
  comment?: string;
}
