import api from './axios'; 
export const getSellers = async () => {
    try {
        const response = await api.get('/api/admin/Sellers');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSellerById = async (id) => {
    try {
        const response = await api.delete(`/api/admin/DeleteSeller/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

