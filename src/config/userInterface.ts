export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  // Exclude sensitive fields such as password, reset_code, etc.
  createdAt: string;
  updatedAt: string;
}

// New request interfaces based on user.yaml
export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: Role;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  role?: Role;
}
