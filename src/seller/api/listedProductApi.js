import apiClient from './apiClient';

/**
 * Fetches the list of products for the seller
 * including summary counts for active and inactive status.
 */
export const fetchListedProducts = async () => {
    try {
        const response = await apiClient.get('/seller/products');
        return response.data;
    } catch (error) {
        console.error("Error fetching listed products:", error);
        throw error;
    }
};


// Delete Seller Product
export const deleteSellerProduct = async (productId) => {
  const response = await apiClient.delete(
    `/seller/delete/products/${productId}`
  );

  return response.data;
};

// Update Seller Product
export const updateSellerProduct = async (productId, formData) => {
  const response = await apiClient.post(
    `/seller/products/update/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};