export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
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

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image?: string;
}

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

export interface ICartItem {
  _id: string;
  productId: IProduct;
  qty: number;
  price: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
}

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

export interface IReview {
  _id: string;
  productId: string;
  userId: IUser | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: IOrder[];
  ordersByStatus: Record<OrderStatus, number>;
  revenueByDay: { date: string; revenue: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
