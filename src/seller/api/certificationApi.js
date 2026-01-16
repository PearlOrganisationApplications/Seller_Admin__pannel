import apiClient from './apiClient';

/**
 * Fetches the Kalki certification summary and product list
 */
export const getCertificationSummary = async () => {
    try {
        const response = await apiClient.get('/seller/kalki-certification-summary');
        return response.data;
    } catch (error) {
        console.error("Error fetching certification summary:", error);
        throw error;
    }
};      