import api from "./axios";

// Get Sellers
export const getSellers = async () => {
  try {
    const response = await api.get("/api/admin/sellers");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Toggle Seller Status
export const toggleSellerStatus = async (id) => {
  const response = await api.put(`/api/seller/${id}/toggle-status`);
  return response.data;
};

// Get Seller Products
export const getSellerProducts = async (sellerId) => {
  const response = await api.get(`/api/admin/get/product/${sellerId}`);
  return response.data;
};

// Get Seller Orders
export const getSellerOrders = async (sellerId) => {
  const response = await api.get(`/api/admin/get/orders/${sellerId}`);
  return response.data;
};

// Get Seller Pending Orders
export const getSellerPendingOrders = async (sellerId) => {
  const response = await api.get(
    `/api/admin/get/pending-orders/${sellerId}`
  );
  return response.data;
};

// Delete Seller
export const deleteSellerById = async (id) => {
  const response = await api.delete(`/api/admin/delete/seller/${id}`);
  return response.data;
};

// Update Product Status
export const updateProductStatus = async (product_uid, status) => {
  const formData = new FormData();

  formData.append("product_uid", product_uid);
  formData.append("status", status);

  const response = await api.post(
    "/api/admin/get/seller/product/update",
    formData
  );

  return response.data;
};