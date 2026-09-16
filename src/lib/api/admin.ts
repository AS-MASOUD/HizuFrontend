import { apiClient } from "./client";
import { AdminDashboardStats, AdminUser, Order, SpecialOrder, PagedResult } from "@/types";

export const adminApi = {
  async getStats(): Promise<AdminDashboardStats> {
    return apiClient<AdminDashboardStats>("/api/admin/stats");
  },

  async getOrders(page = 1, pageSize = 20, search = ""): Promise<PagedResult<Order>> {
    const query = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    if (search) query.append("search", search);
    return apiClient<PagedResult<Order>>(`/api/admin/orders?${query.toString()}`);
  },

  async updateOrderStatus(orderId: string, status: number): Promise<void> {
    return apiClient<void>(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async getSpecialOrders(page = 1, pageSize = 20, search = ""): Promise<PagedResult<SpecialOrder>> {
    const query = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    if (search) query.append("search", search);
    return apiClient<PagedResult<SpecialOrder>>(`/api/admin/special-orders?${query.toString()}`);
  },

  async replySpecialOrder(
    id: string,
    reply: string,
    quotedPrice?: number,
    newStatus?: number
  ): Promise<void> {
    return apiClient<void>(`/api/admin/special-orders/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ reply, quotedPrice, newStatus }),
    });
  },

  async updateSpecialOrderStatus(id: string, status: number): Promise<void> {
    return apiClient<void>(`/api/admin/special-orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async getUsers(page = 1, pageSize = 20, search = ""): Promise<PagedResult<AdminUser>> {
    const query = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    if (search) query.append("search", search);
    return apiClient<PagedResult<AdminUser>>(`/api/admin/users?${query.toString()}`);
  },

  async updateUserRoles(userId: string, roles: string[]): Promise<void> {
    return apiClient<void>(`/api/admin/users/${userId}/roles`, {
      method: "PUT",
      body: JSON.stringify({ roles }),
    });
  },
};
