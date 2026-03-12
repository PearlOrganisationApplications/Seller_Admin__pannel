import api from './axios';

export const getSellers = async () => {
    try {
        const response = await api.get('/api/admin/Sellers');
        return response.data;
    } catch (error) { throw error; }
};

export const toggleSellerStatus = async (id) => {
    try {
        // According to your image: PUT https://kalkideals.com/api/seller/{id}/toggle-status
        const response = await api.put(`/api/seller/${id}/toggle-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// --- NEW APIS ---

// Get Listed Products
export const getSellerProducts = async (sellerId) => {
    try {
        // Changed "products" to "product"
        const response = await api.get(`/api/admin/get/product/${sellerId}`);
        return response.data;
    } catch (error) { throw error; }
};

// Get Order Management
export const getSellerOrders = async (sellerId) => {
    try {
        const response = await api.get(`/api/admin/get/orders/${sellerId}`);
        return response.data;
    } catch (error) { throw error; }
};

// Get Pending Requests (Pending Orders)
export const getSellerPendingOrders = async (sellerId) => {
    try {
        const response = await api.get(`/api/admin/get/pending-orders/${sellerId}`);
        return response.data;
    } catch (error) { throw error; }
};

export const deleteSellerById = async (id) => {
    try {
        // Updated URL to match: /api/admin/delete/seller/{id}
        const response = await api.delete(`/api/admin/delete/seller/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProductStatus = async (product_uid, status) => {
    const formData = new FormData();
    formData.append('product_uid', product_uid);
    formData.append('status', status);

    const response = await api.post('/api/admin/get/seller/product/update', formData);
    return response.data;
};