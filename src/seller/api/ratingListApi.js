// ratingListApi.js
import apiClient from './apiClient';

export const getSellerRatings = async () => {
  try {
    // CHANGE THIS: Remove '/api' from the start
    const response = await apiClient.get('/seller/all/rating'); 
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};