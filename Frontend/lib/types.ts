export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "CANCELLED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED";

export type UserStatus = "ACTIVE" | "SUSPENDED";
export type AuthProvider = "CREDENTIALS" | "GOOGLE";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  address?: string | null;
  image?: string | null;
  status: UserStatus;
  authProvider?: AuthProvider;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  _count?: { gearItems: number };
}

export interface GearItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number | string;
  quantity: number;
  availableQuantity: number;
  specifications?: Record<string, unknown> | null;
  images: string[];
  status: "ACTIVE" | "INACTIVE";
  category?: { id: string; name: string; slug: string };
  provider?: { id: string; name: string; email: string };
  averageRating?: number | null;
  reviewCount?: number;
  reviews?: Review[];
}

export interface RentalOrderItem {
  id: string;
  quantity: number;
  pricePerDay: number | string;
  subtotal: number | string;
  gearItem: GearItem;
}

export interface RentalOrder {
  id: string;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalAmount: number | string;
  notes?: string | null;
  createdAt: string;
  customer?: { id: string; name: string; email: string };
  items: RentalOrderItem[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number | string;
  method: "STRIPE" | "SSLCOMMERZ";
  status: "PENDING" | "COMPLETED" | "FAILED";
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  rentalOrder?: Partial<RentalOrder>;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer?: { id: string; name: string };
  gearItem?: { id: string; name: string; brand: string };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
