import api from "../api/axios";

// Get All Products
export const getProducts = async (page = 1, perPage = 20) => 
    {
  try
   {
    const response = await api.get("/api/admin/products", 
        {
      params: 
      {
        page,
        per_page: perPage,
      },
    });

    return response.data;

  } catch (error)
   {

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