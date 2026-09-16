import { apiClient } from "./client";
import { SpecialOrder, SpecialOrderImage } from "@/types";

export interface CreateSpecialOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  title: string;
  category?: string;
  description: string;
  materialPreference?: string;
  estimatedBudget?: number;
  uploadedFiles?: { imageUrl: string; originalFileName?: string; fileSizeBytes: number }[];
}

export const specialOrdersApi = {
  async create(payload: CreateSpecialOrderPayload): Promise<SpecialOrder> {
    return apiClient<SpecialOrder>("/api/specialorders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMy(): Promise<SpecialOrder[]> {
    return apiClient<SpecialOrder[]>("/api/specialorders/my");
  },

  async getById(id: string): Promise<SpecialOrder> {
    return apiClient<SpecialOrder>(`/api/specialorders/${id}`);
  },

  async uploadFile(file: File): Promise<{ imageUrl: string; originalFileName: string; fileSizeBytes: number }> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient<{ imageUrl: string; originalFileName: string; fileSizeBytes: number }>(
      "/api/specialorders/upload",
      {
        method: "POST",
        body: formData,
      }
    );
  },
};
