// API Configuration
export const API_BASE_URL = 'http://localhost:8000';

// Authentication Configuration
export const AUTH_TOKEN_KEY = 'auth_token';

// Image Upload Configuration
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const MAX_IMAGE_DIMENSIONS = {
  width: 2048,
  height: 2048,
};

// Pagination Configuration
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50; 