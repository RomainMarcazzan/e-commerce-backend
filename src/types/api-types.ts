// Auth types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// Cart types
export interface CartResponse {
  message: string;
  cart: object;
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface AddCartItemResponse {
  message: string;
  cartItem: object;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface UpdateCartItemResponse {
  message: string;
  cartItem: object;
}

export interface RemoveCartItemResponse {
  message: string;
  cartItem: object;
}

export interface ClearCartResponse {
  message: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  message: string;
  categories: Category[];
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateCategoryResponse {
  message: string;
  category: Category;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface UpdateCategoryResponse {
  message: string;
  category: Category;
}

export interface DeleteCategoryResponse {
  message: string;
  category: Category;
}

// Order types
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  message: string;
  orders: Order[];
}

export interface CreateOrderRequest {
  userId: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface UpdateOrderRequest {
  totalPrice: number;
  status: string;
}

export interface UpdateOrderResponse {
  message: string;
  order: Order;
}

export interface DeleteOrderResponse {
  message: string;
  order: Order;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
}

export interface ProductsResponse {
  message: string;
  products: Product[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
}

export interface UpdateProductResponse {
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  message: string;
  product: Product;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface ReviewsResponse {
  message: string;
  reviews: Review[];
}

export interface CreateReviewRequest {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse {
  message: string;
  review: Review;
}

export interface UpdateReviewRequest {
  rating: number;
  comment: string;
}

export interface UpdateReviewResponse {
  message: string;
  review: Review;
}

export interface DeleteReviewResponse {
  message: string;
  review: Review;
}

// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UsersResponse {
  message: string;
  users: User[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface CreateUserResponse {
  message: string;
  user: User;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  message: string;
  user: User;
}
