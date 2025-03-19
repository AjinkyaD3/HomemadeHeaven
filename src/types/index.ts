export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'frame' | 'gift';
  stock: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface ProductVariation {
  id: string;
  productId: string;
  sku: string;
  attributes: {
    [key: string]: string; // e.g., { color: 'red', size: 'large' }
  };
  price?: number; // Optional override of base product price
  stock: number;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variation?: ProductVariation;
  customizations?: {
    color?: string;
    material?: string;
    engraving?: string;
    size?: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'netbanking' | 'wallet' | 'upi' | 'cod';
  paymentId?: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  status: Order['status'];
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Address {
  id?: string;
  userId?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  applicableProducts?: string[]; // Array of product IDs
  applicableCategories?: string[]; // Array of category IDs, empty means all categories
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'created' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}