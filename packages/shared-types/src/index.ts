// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';

export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  addresses: IAddress[];
  createdAt: string;
}

export interface IAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  access_token: string;
  user: IUser;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image?: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  categoryId: string | ICategory;
  stock: number;
  ratings: { avg: number; count: number };
  brand?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ProductListResponse {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface ICartItem {
  _id: string;
  productId: string | IProduct;
  qty: number;
  price: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  updatedAt: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
  productId: string | IProduct;
  qty: number;
  price: number;
  name: string;
  image: string;
}

export interface IOrder {
  _id: string;
  userId: string | IUser;
  items: IOrderItem[];
  shippingAddress: IAddress;
  status: OrderStatus;
  paymentMethod: 'cod';
  totalAmount: number;
  couponCode?: string;
  discount: number;
  createdAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface IReview {
  _id: string;
  productId: string;
  userId: string | IUser;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export type DiscountType = 'percent' | 'fixed';

export interface ICoupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: IOrder[];
  ordersByStatus: Record<OrderStatus, number>;
  revenueByDay: { date: string; revenue: number }[];
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
