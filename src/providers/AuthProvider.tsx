"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Address } from "@/types";
import { authApi, LoginPayload, RegisterPayload, OtpSendResult, VerifyOtpLoginPayload } from "@/lib/api/auth";
import { getAuthToken } from "@/lib/api/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSysManager: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  loginWithOtp: (payload: VerifyOtpLoginPayload) => Promise<User>;
  sendOtp: (recipient: string, purpose?: string) => Promise<OtpSendResult>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: { firstName: string; lastName: string; phoneNumber?: string; address?: Address }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload): Promise<User> => {
    const res = await authApi.login(payload);
    setUser(res.user);
    return res.user;
  };

  const loginWithOtp = async (payload: VerifyOtpLoginPayload): Promise<User> => {
    const res = await authApi.verifyOtpLogin(payload);
    setUser(res.user);
    return res.user;
  };

  const sendOtp = async (recipient: string, purpose: string = "login") => {
    return await authApi.sendOtp(recipient, purpose);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    setUser(res.user);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (payload: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: Address;
  }) => {
    const updated = await authApi.updateProfile(payload);
    setUser(updated);
  };

  const isAuthenticated = !!user;
  const isSysManager = user?.roles?.includes("SysManager") ?? false;
  const isAdmin = (user?.roles?.includes("Admin") || isSysManager) ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isSysManager,
        login,
        loginWithOtp,
        sendOtp,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
