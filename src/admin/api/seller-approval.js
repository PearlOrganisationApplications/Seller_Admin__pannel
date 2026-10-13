// src/admin/api/seller-approval.js
import api from "./axios";

// Axios error ko readable Error me convert karta hai
// (taaki component me err.message se server ka message dikhe)
const handleError = (err, fallbackMessage) => {
  throw new Error(err?.response?.data?.message || err?.message || fallbackMessage);
};

// Fetch all products (seller approval list)
export const getProductsController = async () => {
  try {
    const response = await api.get("/api/admin/products");
    const result = response.data;

    if (result?.status) {
      return {
        success: true,
        products: result?.data?.data || [],
        message: result?.message || "",
      };
    }

    return {
      success: false,
      products: [],
      message: result?.message || "Something went wrong",
    };
  } catch (err) {
    handleError(err, "Failed to fetch products");
  }
};

// Approve a product
export const approveProductController = async (productId) => {
  try {
    const response = await api.patch(
      `/api/admin/products/${productId}/approve`,
      { is_approved: true }
    );

    if (!response.data?.status) {
      throw new Error(response.data?.message || "Failed to approve product");
    }

    return response.data;
  } catch (err) {
    handleError(err, "Failed to approve product");
  }
};

export const rejectProductController = async (
  productId,
  rejectReason,
  resubmit = false
) => {
  try {
    const response = await api.patch(
      `/api/admin/products/${productId}/reject`,
      {
        reject_reason: String(rejectReason || "").trim(),
        resubmit: resubmit ? 1 : 0,
      }
    );

    if (!response.data?.status) {
      throw new Error(
        response.data?.message || "Failed to reject product"
      );
    }

    return response.data;
  } catch (err) {
    handleError(err, "Failed to reject product");
  }
};

