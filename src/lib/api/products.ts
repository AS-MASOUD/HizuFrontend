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

export const DEFAULT_FEATURED_PRODUCTS: ProductListDto[] = [
  {
    id: "708e22c8-74dc-4046-9bca-94bcad9e7b8c",
    name: "پاویون دکوراتیو پارامتریک بلوط طبیعی",
    slug: "parametric-oak-pavilion-sculpture",
    shortDescription: "اتصالات چوبی پنهان و برش ترکیبی الگوریتمیک CNC و لیزر",
    sku: "HZ-PVN-OAK-01",
    price: 12500000,
    compareAtPrice: 14000000,
    stockQuantity: 4,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    isFeatured: true,
    material: "Solid Oak Wood & Eco Wax",
    technique: "Parametric CNC & Laser Cutting",
    tolerance: "±0.1 mm",
    categoryId: 3,
    categoryName: "برش و حکاکی لیزر",
    categorySlug: "laser-cutting",
  },
  {
    id: "d1c2c2aa-a88e-4822-a3ea-1fcb27a56dda",
    name: "پایه نگهدارنده ارگونومیک مانیتور هیزو",
    slug: "hizu-ergonomic-monitor-stand",
    shortDescription: "شاسی یکپارچه آلومینیوم آنودایز شده با چوب گردوی طبیعی",
    sku: "HZ-DSK-MNT-02",
    price: 3850000,
    compareAtPrice: 4200000,
    stockQuantity: 14,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    isFeatured: true,
    material: "Anodized Aluminum 6061 & Solid Walnut",
    technique: "Laser Sheet Bending & CNC Mill",
    tolerance: "±0.05 mm",
    categoryId: 4,
    categoryName: "اکسسوری و ابزار کارگاهی",
    categorySlug: "tools-accessories",
  },
  {
    id: "f21c4608-fe63-4564-856d-c58add7c420a",
    name: "گریپر سبک‌سازی بازوی رباتیک AL-7075",
    slug: "robotic-gripper-al7075",
    shortDescription: "سبک‌سازی مکانیکی توپولوژیک با آلیاژ هوایی و تلورانس ابعادی ±0.02mm",
    sku: "HZ-GRP-7075",
    price: 4600000,
    compareAtPrice: 5200000,
    stockQuantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    isFeatured: true,
    material: "Aerospace Aluminum 7075-T6",
    technique: "High-Speed CNC Milling",
    tolerance: "±0.02 mm",
    categoryId: 5,
    categoryName: "قطعات سفارشی مکاترونیک",
    categorySlug: "custom-parts",
  },
];

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
    try {
      const res = await apiClient<any>(`/api/products/featured?count=${count}`);
      if (Array.isArray(res) && res.length > 0) return res;
      if (Array.isArray(res?.value) && res.value.length > 0) return res.value;
      if (Array.isArray(res?.items) && res.items.length > 0) return res.items;

      const paged = await apiClient<any>(`/api/products?pageSize=${count}&onlyActive=true`).catch(() => null);
      if (Array.isArray(paged?.items) && paged.items.length > 0) return paged.items;

      return DEFAULT_FEATURED_PRODUCTS.slice(0, count);
    } catch (err) {
      console.warn("Failed to fetch featured products from backend:", err);
      return DEFAULT_FEATURED_PRODUCTS.slice(0, count);
    }
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
