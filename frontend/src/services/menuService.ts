import axios from './axiosConfig';
import authService from './authService';

export interface MenuEntry {
    _id: string;
    cake_type: string;
    base_price: number;
    description?: string;
    category?: string;
    is_active: boolean;
    min_weight: number;
}

export type MenuCreate = Omit<MenuEntry, '_id'>;
export type MenuUpdate = Partial<MenuCreate>;

export const menuService = {
    getMenu: async (activeOnly: boolean = false): Promise<MenuEntry[]> => {
        try {
            const response = await axios.get<MenuEntry[]>('/api/menu', {
                params: { active_only: activeOnly }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching menu:', error);
            throw error;
        }
    },

    getMenuItem: async (id: string): Promise<MenuEntry> => {
        try {
            const response = await axios.get<MenuEntry>(`/api/menu/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching menu item:', error);
            throw error;
        }
    },

    createMenuItem: async (item: MenuCreate): Promise<MenuEntry> => {
        try {
            const response = await axios.post<MenuEntry>('/api/menu', item);
            return response.data;
        } catch (error) {
            console.error('Error creating menu item:', error);
            throw error;
        }
    },

    updateMenuItem: async (id: string, item: MenuUpdate): Promise<MenuEntry> => {
        try {
            const response = await axios.put<MenuEntry>(`/api/menu/${id}`, item);
            return response.data;
        } catch (error) {
            console.error('Error updating menu item:', error);
            throw error;
        }
    },

    deleteMenuItem: async (id: string): Promise<void> => {
        try {
            await axios.delete(`/api/menu/${id}`);
        } catch (error) {
            console.error('Error deleting menu item:', error);
            throw error;
        }
    }
};
