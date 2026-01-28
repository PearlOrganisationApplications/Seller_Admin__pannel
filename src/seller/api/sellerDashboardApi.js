import apiClient from './apiClient';

/**
 * Fetches the seller dashboard summary, stats, and analytics
 */
export const getSellerDashboard = async () => {
    try {
        const response = await apiClient.get('/seller/dashboard');
        return response.data; 
    } catch (error) {
        throw error;
    }
};