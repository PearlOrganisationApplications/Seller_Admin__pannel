import apiClient from './apiClient';

/**
 * Seller Login API
 * @param {Object} credentials - { email, password, user_type }
 */
export const loginSeller = async (credentials) => {
    try {
        const response = await apiClient.post('/login', credentials);
        return response.data;
    } catch (error) {
        // Throw error to be caught by the component
        throw error.response?.data || { message: "Network Error" };
    }
};