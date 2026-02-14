import apiClient from './apiClient'; 

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

export const requestKalkiCertificate = async (payload) => {
    try {
        const response = await apiClient.post('/seller/request-kalkicertificate', payload);
        return response.data;
    } catch (error) {
        console.error("Error requesting certificate:", error);
        throw error;
    }
};