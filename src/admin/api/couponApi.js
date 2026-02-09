import api from './axios'; // Import your configured axios instance

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
 * Note: You didn't provide the specific delete endpoint, 
 * but standard practice for your API structure would be:
 */
export const deleteCouponApi = async (id) => {
  try {
    // Assuming the endpoint is /deleteCoupon/{id} or similar
    const response = await api.get(`/api/admin/deleteCoupon/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};