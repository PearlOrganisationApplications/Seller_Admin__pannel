import api from './axios'; // Import your custom axios instance

/**
 * Fetch all admin notifications
 * Endpoint: https://kalkideals.com/api/admin/send/get-notifications
 */
export const getNotifications = async () => {
    try {
        const response = await api.get('/api/admin/send/get-notifications');
        return response.data;
    } catch (error) {
        throw error;
    }
};