import api from './api';
import { 
  Sweet, 
  CreateSweetData, 
  UpdateSweetData, 
  PurchaseData, 
  RestockData, 
  SearchFilters,
  PurchaseResponse 
} from '../types/sweet';
import { ApiResponse } from '../types/api';

export class SweetService {
  static async getAllSweets(): Promise<Sweet[]> {
    const response = await api.get<ApiResponse<Sweet[]>>('/api/sweets');
    return response.data.data;
  }

  static async searchSweets(filters: SearchFilters): Promise<Sweet[]> {
    const params = new URLSearchParams();
    
    if (filters.name) params.append('name', filters.name);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await api.get<ApiResponse<Sweet[]>>(`/api/sweets/search?${params.toString()}`);
    return response.data.data;
  }

  static async getSweetById(id: string): Promise<Sweet> {
    const response = await api.get<ApiResponse<Sweet>>(`/api/sweets/${id}`);
    return response.data.data;
  }

  static async createSweet(data: CreateSweetData): Promise<Sweet> {
    const response = await api.post<ApiResponse<Sweet>>('/api/sweets', data);
    return response.data.data;
  }

  static async updateSweet(id: string, data: UpdateSweetData): Promise<Sweet> {
    const response = await api.put<ApiResponse<Sweet>>(`/api/sweets/${id}`, data);
    return response.data.data;
  }

  static async deleteSweet(id: string): Promise<void> {
    await api.delete(`/api/sweets/${id}`);
  }

  static async purchaseSweet(id: string, data: PurchaseData): Promise<PurchaseResponse> {
    const response = await api.post<ApiResponse<PurchaseResponse>>(`/api/sweets/${id}/purchase`, data);
    return response.data.data;
  }

  static async restockSweet(id: string, data: RestockData): Promise<Sweet> {
    const response = await api.post<ApiResponse<Sweet>>(`/api/sweets/${id}/restock`, data);
    return response.data.data;
  }

  static async getCategories(): Promise<string[]> {
    // Get unique categories from all sweets
    const sweets = await this.getAllSweets();
    const categories = [...new Set(sweets.map(sweet => sweet.category))];
    return categories.sort();
  }
}