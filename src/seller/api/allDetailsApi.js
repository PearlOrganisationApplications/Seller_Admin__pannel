import apiClient from './apiClient'; // This is the interceptor client created in the previous step

/**
 * Fetch all products for the logged-in seller
 */
export const getSellerProducts = async () => {
    try {
        const response = await apiClient.get('/seller/products');
        // Based on your code, the API returns { success: true, data: [...] }
        return response.data;
    } catch (error) {
        console.error("Error in getSellerProducts API:", error);
        throw error;
    }
};

/**
 * Delete a product by ID (Placeholder for your Delete button)
 */
export const deleteProduct = async (productId) => {
    try {
        const response = await apiClient.delete(`/seller/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};