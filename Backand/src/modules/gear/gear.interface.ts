export interface GearFilters {
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  available?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateGearInput {
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  quantity: number;
  specifications?: Record<string, unknown>;
  images?: string[];
}

export interface UpdateGearInput {
  categoryId?: string;
  name?: string;
  description?: string;
  brand?: string;
  pricePerDay?: number;
  quantity?: number;
  availableQuantity?: number;
  specifications?: Record<string, unknown>;
  images?: string[];
  status?: "ACTIVE" | "INACTIVE";
}
