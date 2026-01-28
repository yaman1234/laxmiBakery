import { Category } from '../services/categoryService';

export interface Product {
    _id: string;
    product_id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    available: boolean;
    discount: number;
    tags: string[];
    theme: string;
    flavour: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedProducts {
    items: Product[];
    pagination: {
        page: number;
        limit: number;
        total_items: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
} 