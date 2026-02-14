import api from './axios'; // Ensure this points to your axios config file

/**
 * Fetch all coupons
 * GET {{baseURL}}/api/admin/coupons
 */
export const getCoupons = async () => {
  try {
    const response = await api.get('/api/admin/coupons');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new coupon
 * POST {{baseURL}}/api/admin/createCoupon
 */
export const addCoupon = async (payload) => {
  try {
    const response = await api.post('/api/admin/createCoupon', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a coupon
 * GET {{baseURL}}/api/admin/coupons/delete/{id}
 */
export const deleteCouponApi = async (id) => {
  try {
    // Updated to match your specific endpoint
    const response = await api.delete(`/api/admin/coupons/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};