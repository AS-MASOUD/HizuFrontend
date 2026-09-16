import { apiClient } from "./client";
import { Order, OrderSummary, Address } from "@/types";

export const ordersApi = {
  async createOrder(shippingAddress: Address): Promise<Order> {
    return apiClient<Order>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress }),
    });
  },

  async getMyOrders(): Promise<OrderSummary[]> {
    return apiClient<OrderSummary[]>("/api/orders");
  },

  async getOrderById(id: string): Promise<Order> {
    return apiClient<Order>(`/api/orders/${id}`);
  },
};
