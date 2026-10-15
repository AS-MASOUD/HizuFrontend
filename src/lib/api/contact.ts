import { apiClient } from "./client";
import { ContactMessage, PagedResult } from "@/types";

export interface SendContactMessagePayload {
  name: string;
  email: string;
  phoneNumber?: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  async sendMessage(payload: SendContactMessagePayload): Promise<ContactMessage> {
    return apiClient<ContactMessage>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getAdminMessages(params?: {
    isRead?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<ContactMessage>> {
    const searchParams = new URLSearchParams();
    if (params?.isRead !== undefined) {
      searchParams.set("isRead", String(params.isRead));
    }
    if (params?.search) {
      searchParams.set("search", params.search);
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.pageSize) {
      searchParams.set("pageSize", String(params.pageSize));
    }

    const query = searchParams.toString();
    return apiClient<PagedResult<ContactMessage>>(
      `/api/admin/contact-messages${query ? `?${query}` : ""}`
    );
  },

  async toggleMessageRead(id: string, isRead: boolean): Promise<void> {
    return apiClient<void>(`/api/admin/contact-messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ isRead }),
    });
  },

  async replyMessage(id: string, adminNotes: string): Promise<void> {
    return apiClient<void>(`/api/admin/contact-messages/${id}/reply`, {
      method: "POST",
      body: JSON.stringify({ adminNotes }),
    });
  },

  async deleteMessage(id: string): Promise<void> {
    return apiClient<void>(`/api/admin/contact-messages/${id}`, {
      method: "DELETE",
    });
  },
};
