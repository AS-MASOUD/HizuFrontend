"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Cart } from "@/types";
import { cartApi } from "@/lib/api/cart";
import { useAuth } from "./AuthProvider";
import { useToast } from "./ToastProvider";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  subtotal: number;
  total: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  addCourseToCart: (courseId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
      error("برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.");
      return;
    }
    try {
      setLoading(true);
      const updated = await cartApi.addItem(productId, quantity);
      setCart(updated);
      success("محصول با موفقیت به سبد خرید افزوده شد.");
    } catch (err: any) {
      error(err.message || "خطا در افزودن به سبد خرید.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCourseToCart = async (courseId: string) => {
    if (!isAuthenticated) {
      error("برای ثبت‌نام و افزودن دوره به سبد خرید، لطفاً ابتدا وارد حساب کاربری خود شوید.");
      return;
    }
    try {
      setLoading(true);
      const updated = await cartApi.addCourseItem(courseId);
      setCart(updated);
      success("دوره آموزشی با موفقیت به سبد خرید افزوده شد.");
    } catch (err: any) {
      error(err.message || "خطا در افزودن دوره به سبد خرید.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setLoading(true);
      const updated = await cartApi.updateItem(cartItemId, quantity);
      setCart(updated);
    } catch (err: any) {
      error(err.message || "خطا در بروزرسانی تعداد.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      setLoading(true);
      const updated = await cartApi.removeItem(cartItemId);
      setCart(updated);
      success("محصول از سبد خرید حذف شد.");
    } catch (err: any) {
      error(err.message || "خطا در حذف محصول.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartApi.clearCart();
      setCart(null);
      success("سبد خرید خالی شد.");
    } catch (err: any) {
      error(err.message || "خطا در پاک‌سازی سبد خرید.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.totalItemCount ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  const total = cart?.total ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        subtotal,
        total,
        addToCart,
        addCourseToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
