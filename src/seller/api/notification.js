import apiClient from './apiClient';

export const getNotifications = async () => {
    try {
        const response = await apiClient.get('/get-notifications');
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};