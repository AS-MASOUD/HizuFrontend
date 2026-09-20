import { apiClient } from "./client";
import {
  ProductDto,
  ProductListDto,
  PagedResult,
  ProductComment,
  ProductCommentSummary,
  CreateCommentPayload,
} from "@/types";

export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  technique?: string;
  isFeatured?: boolean;
  onlyActive?: boolean;
  sort?: string;
}

export const productsApi = {
  async getProducts(params: GetProductsParams = {}): Promise<PagedResult<ProductListDto>> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());
    if (params.categoryId) query.append("categoryId", params.categoryId.toString());
    if (params.categorySlug) query.append("categorySlug", params.categorySlug);
    if (params.search) query.append("search", params.search);
    if (params.minPrice) query.append("minPrice", params.minPrice.toString());
    if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
    if (params.material) query.append("material", params.material);
    if (params.technique) query.append("technique", params.technique);
    if (params.isFeatured !== undefined) query.append("isFeatured", params.isFeatured.toString());
    if (params.onlyActive !== undefined) query.append("onlyActive", params.onlyActive.toString());
    if (params.sort) query.append("sort", params.sort);

    return apiClient<PagedResult<ProductListDto>>(`/api/products?${query.toString()}`);
  },

  async getFeaturedProducts(count = 4): Promise<ProductListDto[]> {
    return apiClient<ProductListDto[]>(`/api/products/featured?count=${count}`);
  },

  async getProductById(id: string): Promise<ProductDto> {
    return apiClient<ProductDto>(`/api/products/${id}`);
  },

  async getProductBySlug(slug: string): Promise<ProductDto> {
    return apiClient<ProductDto>(`/api/products/slug/${encodeURIComponent(slug)}`);
  },

  async createProduct(payload: any): Promise<ProductDto> {
    return apiClient<ProductDto>("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(id: string, payload: any): Promise<ProductDto> {
    return apiClient<ProductDto>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    return apiClient<void>(`/api/products/${id}`, {
      method: "DELETE",
    });
  },

  async uploadImage(
    file: File | Blob,
    originalFileName?: string
  ): Promise<{ imageUrl: string; fileName: string; fileSizeBytes: number }> {
    const formData = new FormData();
    const name = originalFileName || (file instanceof File ? file.name : "product-image.webp");
    formData.append("file", file, name);

    return apiClient<{ imageUrl: string; fileName: string; fileSizeBytes: number }>(
      "/api/products/upload-image",
      {
        method: "POST",
        body: formData,
      }
    );
  },

  async getComments(productId: string): Promise<ProductCommentSummary> {
    return apiClient<ProductCommentSummary>(`/api/products/${productId}/comments`);
  },

  async submitComment(productId: string, payload: CreateCommentPayload): Promise<ProductComment> {
    return apiClient<ProductComment>(`/api/products/${productId}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
