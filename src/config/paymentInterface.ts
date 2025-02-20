export type PaymentMethod = "CARD";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

// New request interfaces based on payment.yaml
export interface PaymentCreateRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  stripePaymentIntentId?: string;
  stripePaymentMethodId?: string;
}

export interface PaymentUpdateRequest {
  amount?: number;
  method?: PaymentMethod;
}
