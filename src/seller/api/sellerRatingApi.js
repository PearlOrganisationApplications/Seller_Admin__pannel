import apiClient from './apiClient';

// Submit a new rating
export const submitSellerRating = async (data) => {
    try {
        const response = await apiClient.post('/seller/rating', data);
        return response.data;
    } catch (error) { throw error; }
};

// Update an existing rating
export const updateSellerRating = async (id, data) => {
    try {
        // Trying POST first as per your previous mention, change to .put if it fails
        const response = await apiClient.post(`/seller/rating/${id}`, data);
        return response.data;
    } catch (error) { throw error; }
};

// Delete a rating
export const deleteSellerRating = async (id) => {
    try {
        // Updated to use the ID in the URL as you specified
        const response = await apiClient.delete(`/seller/rating/${id}`);
        return response.data;
    } catch (error) { throw error; }
};

// Fetch all ratings - UPDATED ENDPOINT
export const getMyRatings = async () => {
    try {
        const response = await apiClient.get('/seller/getall/rating');
        return response.data;
    } catch (error) { throw error; }
};