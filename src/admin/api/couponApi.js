import api from './axios';

// Fetch all coupons
export const getCoupons = async () => {
  try {
    const response = await api.get('/api/admin/coupons');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new coupon - EXACT ENDPOINT UPDATE
export const addCoupon = async (couponData) => {
  try {
    const response = await api.post('/api/admin/createCoupon', couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a coupon
export const deleteCouponApi = async (id) => {
  try {
    const response = await api.delete(`/api/admin/coupons/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};