import apiClient from './apiClient';

/**
 * Fetches the list of products for the seller
 * including summary counts for active and inactive status.
 */
export const fetchListedProducts = async () => {
    try {
        const response = await apiClient.get('/seller/products');
        return response.data;
    } catch (error) {
        console.error("Error fetching listed products:", error);
        throw error;
    }
};