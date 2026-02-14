import apiClient from './apiClient';

/**
 * Fetches the list of return orders for the seller
 */
export const fetchReturnOrders = async () => {
    try {
        const response = await apiClient.get('/seller/returns');
        return response.data;
    } catch (error) {
        console.error("Error fetching return orders:", error);
        throw error;
    }
};