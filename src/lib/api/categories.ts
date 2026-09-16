import { apiClient } from "./client";
import { Category } from "@/types";

export const categoriesApi = {
  async getCategories(onlyActive = true): Promise<Category[]> {
    return apiClient<Category[]>(`/api/categories?onlyActive=${onlyActive}`);
  },

  async createCategory(payload: Partial<Category>): Promise<Category> {
    return apiClient<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateCategory(id: number, payload: Partial<Category>): Promise<Category> {
    return apiClient<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteCategory(id: number): Promise<void> {
    return apiClient<void>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  },
};
