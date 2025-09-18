// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  SWEETS: {
    BASE: '/api/sweets',
    SEARCH: '/api/sweets/search',
    PURCHASE: (id: string) => `/api/sweets/${id}/purchase`,
    RESTOCK: (id: string) => `/api/sweets/${id}/restock`,
    BY_ID: (id: string) => `/api/sweets/${id}`,
  },
  HEALTH: '/api/health',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

// Form Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  PRICE_MIN: 0.01,
  PRICE_MAX: 999999,
  QUANTITY_MIN: 0,
  QUANTITY_MAX: 999999,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300, // milliseconds
  TOAST_DURATION: 5000, // milliseconds
  MOBILE_BREAKPOINT: 768, // pixels
  ITEMS_PER_PAGE: 12,
} as const;

// Sweet Categories (can be overridden by API data)
export const DEFAULT_CATEGORIES = [
  'Cakes',
  'Cookies',
  'Candies',
  'Ice Cream',
  'Chocolates',
  'Pastries',
  'Donuts',
  'Muffins',
] as const;

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;