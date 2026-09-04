import api from "../api/axios";

// Get All Products
export const getProducts = async (page = 1, perPage = 20) => {
  try {
    const response = await api.get("/api/admin/products", {
      params: {
        page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Add Product
export const addProduct = async (data) => {
  try {
    const response = await api.post("/api/admin/products/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(
      `/api/admin/products/${productId}/delete`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (productId, data) => {
  try {
    const response = await api.post(
      `/api/admin/products/${productId}/update`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVariants = async (page = 1) => {
  try {
    const response = await api.get("/api/admin/variants", {
      params: {
        page,
      },
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addVariant = async (formData) => {
  try {
    const response = await api.post(
      "/api/admin/variants/add",

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};



export const updateVariant = async (id, formData) => {
  try {
    const response = await api.post(
      `/api/admin/variants/${id}/update`,

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};




export const deleteVariant = async (id) => {
  try {
    const response = await api.delete(
      `/api/admin/variants/${id}`,
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
