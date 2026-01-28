import axios from './axiosConfig';
import { Product, PaginatedProducts } from '../types/product';
import { API_BASE_URL } from '../config/index';
import authService from './authService';

/**
 * Transforms product data by ensuring image URLs are absolute.
 * If an image URL is relative, prepends the API base URL.
 * 
 * @param product - The product object to transform
 * @returns The transformed product with absolute image URLs
 */
const transformProduct = (product: Product): Product => ({
    ...product,
    images: product.images.map(image => 
        image.startsWith('http') ? image : `${API_BASE_URL}${image}`
    )
});

export const productService = {
    /**
     * Fetches a paginated list of products.
     * 
     * @param page - The page number to fetch (1-based)
     * @param limit - The number of items per page
     * @returns Promise with paginated products response
     * @throws Error if the API request fails
     */
    getProducts: async (page: number = 1, limit: number = 10): Promise<PaginatedProducts> => {
        try {
            console.log('Fetching products with params:', { page, limit });
            const response = await axios.get<PaginatedProducts>('/api/products', {
                params: { page, limit }
            });
            console.log('Products response:', response.data);
            return {
                ...response.data,
                items: response.data.items.map(transformProduct)
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Fetches a single product by its ID.
     * 
     * @param id - The product ID to fetch
     * @returns Promise with the product data
     * @throws Error if the product is not found or the request fails
     */
    getProduct: async (id: string): Promise<Product> => {
        try {
            const response = await axios.get<Product>(`/api/products/${id}`);
            return transformProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Fetches products filtered by category with pagination.
     * 
     * @param category - The category name to filter by
     * @param page - The page number to fetch (1-based)
     * @param limit - The number of items per page
     * @returns Promise with paginated products response
     * @throws Error if the API request fails
     */
    getProductsByCategory: async (category: string, page: number = 1, limit: number = 10): Promise<PaginatedProducts> => {
        try {
            const response = await axios.get<PaginatedProducts>('/api/products', {
                params: { category, page, limit }
            });
            return {
                ...response.data,
                items: response.data.items.map(transformProduct)
            };
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    /**
     * Deletes a product by its ID. Requires admin authentication.
     * 
     * @param id - The ID of the product to delete
     * @throws Error if the deletion fails or user is not authenticated
     */
    deleteProduct: async (id: string): Promise<void> => {
        try {
            await axios.delete(`/api/products/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    /**
     * Creates a new product with image upload support. Requires admin authentication.
     * 
     * @param product - The product data to create
     * @returns Promise with the created product data
     * @throws Error if creation fails, user is not authenticated, or image upload fails
     */
    createProduct: async (product: Omit<Product, '_id'>): Promise<Product> => {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', product.price.toString());
            formData.append('category', product.category);
            formData.append('discount', product.discount.toString());
            formData.append('tags', JSON.stringify(product.tags));
            formData.append('available', product.available.toString());
            formData.append('theme', product.theme);
            formData.append('flavour', product.flavour);
            
            // Handle image upload if it's a new image (base64 or data URL)
            if (product.images[0] && product.images[0].startsWith('data:')) {
                const response = await fetch(product.images[0]);
                const blob = await response.blob();
                formData.append('image', blob, 'product-image.jpg');
            }

            // Log form data for debugging
            console.log('Sending form data:', {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                discount: product.discount,
                tags: product.tags,
                available: product.available,
                hasImage: !!product.images[0]
            });

            const response = await axios.post<Product>('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            return transformProduct(response.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Please login as admin to create products');
            }
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Updates an existing product. Requires admin authentication.
     * Supports partial updates and image upload.
     * 
     * @param id - The ID of the product to update
     * @param product - The partial product data to update
     * @returns Promise with the updated product data
     * @throws Error if update fails, user is not authenticated, or image upload fails
     */
    updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
        try {
            const token = authService.getToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const formData = new FormData();
            
            // Only append fields that are present in the update
            if (product.name !== undefined) formData.append('name', product.name);
            if (product.description !== undefined) formData.append('description', product.description);
            if (product.price !== undefined) formData.append('price', product.price.toString());
            if (product.category !== undefined) formData.append('category', product.category);
            if (product.available !== undefined) formData.append('available', product.available.toString());
            if (product.discount !== undefined) formData.append('discount', product.discount.toString());
            if (product.tags !== undefined) formData.append('tags', JSON.stringify(product.tags));
            if (product.theme !== undefined) formData.append('theme', product.theme);
            if (product.flavour !== undefined) formData.append('flavour', product.flavour);
            
            // Handle image update if it's a new image
            if (product.images?.[0] && product.images[0].startsWith('data:')) {
                const response = await fetch(product.images[0]);
                const blob = await response.blob();
                formData.append('image', blob, 'product-image.jpg');
            }

            const response = await axios.put<Product>(`/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            return transformProduct(response.data);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
}; 