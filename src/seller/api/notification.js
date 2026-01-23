import apiClient from './apiClient'; // Ensure this points to the file we fixed above

export const getNotifications = async () => {
    try {
        // Note: Do NOT add /api here if BASE_URL already has /api
        const response = await apiClient.get('/get-notifications'); 
        return response.data;
    } catch (error) {
        throw error;
    }
};