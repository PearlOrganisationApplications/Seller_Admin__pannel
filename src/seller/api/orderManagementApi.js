import apiClient from './apiClient';

// Helper to handle API errors consistently
const handleApiError = (error, defaultMessage) => {
    const message = error.response?.data?.message || defaultMessage;
    console.error(defaultMessage, error);
    throw new Error(message);
};

export const fetchAllOrders = async () => {
    try {
        const res = await apiClient.get('/seller/orders');
        return res.data;
    } catch (error) {
        handleApiError(error, "Failed to fetch all orders");
    }
};

export const fetchNewOrders = async () => {
    try {
        const res = await apiClient.get('/seller/order/new');
        return res.data;
    } catch (error) {
        handleApiError(error, "Failed to fetch new orders");
    }
};

export const fetchPendingOrders = async () => {
    try {
        const res = await apiClient.get('/seller/order/pending');
        return res.data;
    } catch (error) {
        handleApiError(error, "Failed to fetch pending orders");
    }
};

export const fetchConfirmedOrders = async () => {
    try {
        const res = await apiClient.get('/seller/order/confirmed');
        return res.data;
    } catch (error) {
        handleApiError(error, "Failed to fetch confirmed orders");
    }
};

export const fetchCancelledOrders = async () => {
    try {
        const res = await apiClient.get('/seller/order/cancelled');
        return res.data;
    } catch (error) {
        handleApiError(error, "Failed to fetch cancelled orders");
    }
};

export const processOrderAction = async (payload) => {
    try {
        const response = await apiClient.post('/seller/order/accept-reject', payload);
        return response.data;
    } catch (error) {
        handleApiError(error, "Failed to process order action");
    }
};