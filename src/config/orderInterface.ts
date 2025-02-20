export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// New request interfaces based on order.yaml
export interface OrderCreateRequest {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface OrderUpdateRequest {
  // Include any updatable order fields as needed
  status?: OrderStatus;
  // items?: { id: string; quantity?: number; price?: number }[]; // Uncomment if order items updates are supported
}
