import apiClient from './apiClient';

export const addProduct = async (formData) => {
    try {
        const response = await apiClient.post('/seller/add-product', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/seller/Categories');
        return response.data; 
    } catch (error) {
        throw error;
    }
};

export const fetchColors = async () => {
    try {
        const response = await apiClient.get('/seller/colour');
        return response.data; 
    } catch (error) {
        throw error;
    }
};

export const fetchSizes = async () => {
    try {
        const response = await apiClient.get('/seller/size');
        return response.data; 
    } catch (error) {
        throw error;
    }
};

export const fetchSpecifications = async () => {
    try {
        const response = await apiClient.get('/seller/Specification');
        return response.data; 
    } catch (error) {
        throw error;
    }
};