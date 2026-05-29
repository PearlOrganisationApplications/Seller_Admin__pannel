import api from "./axios";

// Get All Ratings
export const getAllRatings = async () => {
  const response = await api.get("/api/admin/get/seller/raiting");
  return response.data;
};

// Update Rating
export const updateRating = async (id, ratingData) => {
  const response = await api.post(
    `/api/admin/seller/rating/${id}`,
    ratingData
  );

  return response.data;
};

// Delete Rating
export const deleteRating = async (id) => {
  const response = await api.delete(
    `/api/admin/seller/rating/${id}`
  );

  return response.data;
};