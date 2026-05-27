import apiClient from './apiClient';

export const addProduct = async (formData) => {
    const response = await apiClient.post('/seller/add-product', formData);
    return response.data;
};

export const fetchCategories = async () => {
    const response = await apiClient.get('/seller/Categories');
    return response.data;
};

export const fetchColors = async () => {
    const response = await apiClient.get('/seller/colour');
    return response.data;
};

export const fetchSizes = async () => {
    const response = await apiClient.get('/seller/size');
    return response.data;
};

export const fetchSpecifications = async () => {
    const response = await apiClient.get('/seller/Specification');
    return response.data;
};