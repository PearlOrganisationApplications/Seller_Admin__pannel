import apiClient from './apiClient'; // Adjust path if necessary

/**
 * Fetch pending Kalki certificate requests
 */
export const fetchKalkiCertificates = async () => {
    try {
        const response = await apiClient.get('/seller/get-kalkicertificate');
        return response.data;
    } catch (error) {
        console.error("Error fetching Kalki certificates:", error);
        throw error;
    }
};