import apiClient from './apiClient';

export const addProduct = async (formData) => {
    try {
        // Axios automatically sets Content-Type to multipart/form-data 
        // when it detects a FormData object.
        const response = await apiClient.post('/seller/add-product', formData);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/seller/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};