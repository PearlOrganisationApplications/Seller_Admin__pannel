import apiClient from './apiClient';

/**
 * Fetch reviews for a specific product
 * URL: /product/{id}/ratings
 */
export const getReviewDetail = async (productId) => {
  try {
    const response = await apiClient.get(`/product/${productId}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching review details:", error);
    throw error;
  }
};

      
export const deleteReview = async (productId, reviewId) => {
  try {
    // Using .delete method based on the RESTful URL structure provided
    const response = await apiClient.delete(`/product/${productId}/ratings/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};