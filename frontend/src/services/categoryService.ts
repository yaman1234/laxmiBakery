import axios from 'axios';
import { API_BASE_URL } from '../config/index';

export interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
  };
}

const categoryService = {
  getCategories: async (): Promise<{ items: Category[]; total: number }> => {
    const response = await axios.get<{ items: Category[]; total: number }>(`${API_BASE_URL}/api/categories`);
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await axios.get<Category>(`${API_BASE_URL}/api/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: Omit<Category, '_id'> & { image?: File }) : Promise<Category> => {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('slug', category.slug);
    // Handle image as File or base64 string
    if (category.image && category.image instanceof File) {
      formData.append('image', category.image, category.image.name);
    } else if (category.images && category.images[0] && typeof category.images[0] === 'string' && category.images[0].startsWith('data:')) {
      const response = await fetch(category.images[0]);
      const blob = await response.blob();
      formData.append('image', blob, 'category-image.jpg');
    }
    const response = await axios.post<Category>(`${API_BASE_URL}/api/categories`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateCategory: async (id: string, category: Omit<Category, '_id'> & { image?: File }): Promise<Category> => {
    const formData = new FormData();
    if (category.name !== undefined) formData.append('name', category.name);
    if (category.description !== undefined) formData.append('description', category.description);
    if (category.slug !== undefined) formData.append('slug', category.slug);
    // Handle image as File or base64 string
    if (category.image && category.image instanceof File) {
      formData.append('image', category.image, category.image.name);
    } else if (category.images && category.images[0] && typeof category.images[0] === 'string' && category.images[0].startsWith('data:')) {
      const response = await fetch(category.images[0]);
      const blob = await response.blob();
      formData.append('image', blob, 'category-image.jpg');
    }
    const response = await axios.put<Category>(`${API_BASE_URL}/api/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
  },
};

export default categoryService; 