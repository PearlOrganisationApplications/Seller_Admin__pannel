import apiClient from './apiClient';


export const getSellerDashboard = async () => {
    try {
        const response = await apiClient.get('/seller/dashboard');
        return response.data; 
    } catch (error) {
        throw error;
    }
};