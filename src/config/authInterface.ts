export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LostEmailRequest {
  email: string;
}

export interface LostCodeRequest {
  email: string;
  reset_code: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface LostEmailResponse {
  message: string;
  success: boolean;
  code: string;
}

export interface LostCodeResponse {
  message: string;
  success: boolean;
}
