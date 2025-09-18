export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export interface PurchaseData {
  quantity: number;
}

export interface RestockData {
  quantity: number;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PurchaseResponse {
  purchase: {
    id: string;
    sweetId: string;
    quantity: number;
    totalPrice: number;
    createdAt: string;
  };
  updatedSweet: {
    id: string;
    quantity: number;
  };
}