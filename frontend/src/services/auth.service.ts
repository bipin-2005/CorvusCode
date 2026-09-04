import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  country?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export const authService = {
  login(data: LoginRequest) {
    return api.post<LoginResponse>("/auth/login", data);
  },

  register(data: RegisterRequest) {
    return api.post("/auth/register", data);
  },

  verifyOtp(data: VerifyOtpRequest) {
    return api.post("/auth/verify-email", data);
  },

  forgotPassword(data: ForgotPasswordRequest) {
    return api.post("/auth/forgot-password", data);
  },

  resetPassword(data: ResetPasswordRequest) {
    return api.post("/auth/reset-password", data);
  },
};