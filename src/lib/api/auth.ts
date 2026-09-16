import { apiClient, setAuthToken } from "./client";
import { AuthResponse, User, Address } from "@/types";

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: Address;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
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
