import api from './axios';

// Get All Ratings
export const getAllRatings = async () => {
    try {
        const response = await api.get('/api/admin/get/seller/raiting'); // URL as per screenshot
        return response.data;
    } catch (error) { throw error; }
};

// Update Rating
export const updateRating = async (id, ratingData) => {
    try {
        // ratingData should be { rating: number, comment: string }
        const response = await api.post(`/api/admin/seller/rating/${id}`, ratingData);
        return response.data;
    } catch (error) { throw error; }
};

// Delete Rating
export const deleteRating = async (id) => {
    try {
        const response = await api.delete(`/api/admin/seller/rating/${id}`);
        return response.data;
    } catch (error) { throw error; }
};