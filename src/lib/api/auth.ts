import { apiClient, setAuthToken } from "./client";
import { AuthResponse, User, Address } from "@/types";

export interface RegisterPayload {
  email?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  otpCode?: string;
  address?: Address;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpSendResult {
  success: boolean;
  message: string;
  expiresInSeconds: number;
  resendCooldownSeconds?: number;
}

export interface VerifyOtpLoginPayload {
  recipient: string;
  code: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export const authApi = {
  async sendOtp(recipient: string, purpose: string = "login"): Promise<OtpSendResult> {
    return apiClient<OtpSendResult>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ recipient, purpose }),
    });
  },

  async verifyOtpLogin(payload: VerifyOtpLoginPayload): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>("/api/auth/verify-otp-login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAuthToken(res.token);
    return res;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAuthToken(res.token);
    return res;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setAuthToken(res.token);
    return res;
  },

  async getMe(): Promise<User> {
    return apiClient<User>("/api/auth/me");
  },

  async updateProfile(payload: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: Address;
  }): Promise<User> {
    return apiClient<User>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  logout(): void {
    setAuthToken(null);
  },
};
