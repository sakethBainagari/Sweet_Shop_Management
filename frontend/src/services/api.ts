import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types/api';

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Format error for consistent handling
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      ...(error.response?.status && { status: error.response.status }),
    };

    if (error.response?.data) {
      const errorData = error.response.data as any;
      apiError.message = errorData.message || apiError.message;
      apiError.errors = errorData.errors;
    } else if (error.message) {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

export default api;