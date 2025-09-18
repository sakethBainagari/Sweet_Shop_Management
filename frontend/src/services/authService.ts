import api from './api';
import { LoginData, RegisterData, AuthResponse, User } from '../types/auth';
import { ApiResponse } from '../types/api';

export class AuthService {
  static async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/api/auth/login',
      data
    );
    return response.data as AuthResponse;
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/api/auth/register',
      data
    );
    return response.data as AuthResponse;
  }

  static setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  static clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getUser();
    return !!(token && user);
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }
}