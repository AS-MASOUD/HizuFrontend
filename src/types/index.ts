export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  address?: Address;
  roles: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  code: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  parentCategoryId?: number;
  parentCategoryName?: string;
  productCount: number;
  subCategories: Category[];
}

export interface ProductListDto {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  material?: string;
  technique?: string;
  tolerance?: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
  technique?: string;
  tolerance?: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  images: ProductImage[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  sku: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  availableStock: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  totalItemCount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  imageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  status: number;
  statusText: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: number;
  statusText: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface SpecialOrderImage {
  id: string;
  imageUrl: string;
  originalFileName?: string;
  fileSizeBytes: number;
}

export interface SpecialOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  title: string;
  category?: string;
  description: string;
  materialPreference?: string;
  estimatedBudget?: number;
  quotedPrice?: number;
  status: number;
  statusText: string;
  adminReply?: string;
  adminRepliedAt?: string;
  createdAt: string;
  images: SpecialOrderImage[];
}

export interface AdminDashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  totalSpecialOrders: number;
  pendingSpecialOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  roles: string[];
  createdAt: string;
  ordersCount: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
