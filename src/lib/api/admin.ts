import { apiClient } from "./client";
import {
  AdminDashboardStats,
  AdminUser,
  Order,
  SpecialOrder,
  PagedResult,
  ProductComment,
  Course,
} from "@/types";

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

  async getComments(
    isApproved?: boolean,
    page = 1,
    pageSize = 50
  ): Promise<PagedResult<ProductComment>> {
    const query = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (isApproved !== undefined) query.append("isApproved", isApproved.toString());
    return apiClient<PagedResult<ProductComment>>(`/api/admin/comments?${query.toString()}`);
  },

  async toggleCommentApproval(id: string, isApproved: boolean): Promise<void> {
    return apiClient<void>(`/api/admin/comments/${id}/approval`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
  },

  async replyComment(id: string, replyText: string): Promise<ProductComment> {
    return apiClient<ProductComment>(`/api/admin/comments/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ replyText }),
    });
  },

  async deleteComment(id: string): Promise<void> {
    return apiClient<void>(`/api/admin/comments/${id}`, {
      method: "DELETE",
    });
  },

  // Courses Management
  async getCourses(search = ""): Promise<Course[]> {
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    const queryString = query.toString();
    return apiClient<Course[]>(`/api/admin/courses${queryString ? `?${queryString}` : ""}`);
  },

  async createCourse(courseData: any): Promise<Course> {
    return apiClient<Course>("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  },

  async updateCourse(id: string, courseData: any): Promise<Course> {
    return apiClient<Course>(`/api/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
  },

  async deleteCourse(id: string): Promise<void> {
    return apiClient<void>(`/api/admin/courses/${id}`, {
      method: "DELETE",
    });
  },

  async toggleCoursePublish(id: string): Promise<boolean> {
    return apiClient<boolean>(`/api/admin/courses/${id}/publish`, {
      method: "PATCH",
    });
  },
};

