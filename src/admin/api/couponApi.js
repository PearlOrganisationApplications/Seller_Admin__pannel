import api from "./axios";

// Fetch all coupons
export const getCoupons = async () => {
  const response = await api.get("/api/admin/coupons");

  return response.data;
};

// Create a new coupon
export const addCoupon = async (payload) => {
  const response = await api.post(
    "/api/admin/createCoupon",
    payload
  );

  return response.data;
};

// Delete a coupon
export const deleteCouponApi = async (id) => {
  const response = await api.delete(
    `/api/admin/coupons/delete/${id}`
  );

  return response.data;
};