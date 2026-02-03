import axios from './axiosConfig';

export interface OrderData {
    name: string;
    email: string;
    phone: string;
    cakeType: string;
    weight: string;
    flavour?: string;
    occasion?: string;
    preferredDate: string;
    message?: string;
}

export const orderService = {
    placeOrder: async (orderData: OrderData) => {
        try {
            const response = await axios.post('/api/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        }
    }
};
