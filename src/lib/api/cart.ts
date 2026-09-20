import { apiClient } from "./client";
import { Cart } from "@/types";

export interface AddCartItemParams {
  productId?: string;
  courseId?: string;
  quantity?: number;
}

export const cartApi = {
  async getCart(): Promise<Cart> {
    return apiClient<Cart>("/api/cart");
  },

  async addItem(productId: string, quantity = 1): Promise<Cart> {
    return apiClient<Cart>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async addCourseItem(courseId: string): Promise<Cart> {
    return apiClient<Cart>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ courseId, quantity: 1 }),
    });
  },

  async addCustomItem(params: AddCartItemParams): Promise<Cart> {
    return apiClient<Cart>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  async updateItem(cartItemId: string, quantity: number): Promise<Cart> {
    return apiClient<Cart>(`/api/cart/items/${cartItemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  async removeItem(cartItemId: string): Promise<Cart> {
    return apiClient<Cart>(`/api/cart/items/${cartItemId}`, {
      method: "DELETE",
    });
  },

  async clearCart(): Promise<void> {
    return apiClient<void>("/api/cart", {
      method: "DELETE",
    });
  },
};
