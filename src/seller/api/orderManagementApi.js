import apiClient from './apiClient';


export const fetchReturnOrders = async () => {
    try {
        const response = await apiClient.get('/seller/returns');
        return response.data;
    } catch (error) {
        console.error("Error fetching return orders:", error);
        throw error;
    }
};