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
  productId?: string;
  courseId?: string;
  itemType?: "Product" | "Course";
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

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  imageUrl?: string;
  material?: string;
  technique?: string;
  tolerance?: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  categoryName?: string;
  description?: string;
}

export interface RadarMetric {
  key: string;
  label: string;
  fullMark: number;
}

export interface ProductAnalysis {
  productId: string;
  metrics: { [key: string]: number }; // score 0 to 10
  goodPoints: string[];
  drawbacks: string[];
  totalScore: number;
}

export interface FeatureSectionComparison {
  key: string;
  title: string;
  description: string;
  scores: { [productId: string]: number }; // score 0 to 10
  values: { [productId: string]: string };
  winnerId: string | null; // null if tie
  winnerReason: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // rich markdown / HTML formatted content
  coverImage: string;
  category: string; // e.g., "پرینت 3بعدی", "متریال و فیلامنت", "طراحی محصول", "تکنولوژی و اخبار"
  tags: string[];
  author: string;
  authorRole?: string;
  readTimeMinutes: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
  viewsCount: number;
}

export interface CreateArticleDto {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags?: string[];
  author?: string;
  authorRole?: string;
  readTimeMinutes?: number;
  isPublished?: boolean;
}

export interface UpdateArticleDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags?: string[];
  author?: string;
  authorRole?: string;
  readTimeMinutes?: number;
  isPublished: boolean;
}

export interface ProductComment {
  id: string;
  productId: string;
  productName?: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  rating: number;
  isApproved: boolean;
  adminReply?: string;
  adminRepliedAt?: string;
  createdAt: string;
}

export interface ProductCommentSummary {
  averageRating: number;
  totalComments: number;
  comments: ProductComment[];
}

export interface CreateCommentPayload {
  authorName: string;
  authorEmail?: string;
  content: string;
  rating: number;
}

export type CourseLevel = 1 | 2 | 3 | 4;

export interface CourseEpisode {
  id: string;
  sectionId?: string;
  title: string;
  description?: string;
  durationMinutes: number;
  durationText?: string;
  videoUrl?: string;
  fileServerUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSizeBytes?: number;
  isFreePreview: boolean;
  displayOrder: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  displayOrder: number;
  episodes: CourseEpisode[];
}

export interface CourseListDto {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  coverImageUrl?: string;
  introVideoUrl?: string;
  durationMinutes: number;
  durationText?: string;
  level: CourseLevel;
  levelTitle: string;
  instructorName: string;
  totalEpisodesCount: number;
  averageRating: number;
  ratingCount: number;
  studentsCount: number;
  isFeatured: boolean;
}

export interface Course extends CourseListDto {
  description: string;
  fileServerBaseUrl?: string;
  storagePath?: string;
  downloadableFilesUrl?: string;
  language: string;
  downloadableResourcesCount: number;
  includesCertificate: boolean;
  hasLifetimeAccess: boolean;
  instructorTitle?: string;
  instructorBio?: string;
  instructorAvatarUrl?: string;
  whatYouWillLearnList: string[];
  requirementsList: string[];
  targetAudienceList: string[];
  sections: CourseSection[];
  sampleEpisodes: CourseEpisode[];
}
