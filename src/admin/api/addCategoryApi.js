import api from "../api/axios";


const handleApiError = (error) => {
    // 1. Check if the server sent a specific error message
    const message = error.response?.data?.message || 
                    error.response?.data?.error || 
                    "An unexpected error occurred. Please try again.";

    console.error("API Error Response:", error.response?.data);
    
    throw message; 
};

// Get Categories
export const getCategories = async () => {
  try {
    const response = await api.get("/api/admin/categories");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getColors = () => 
    api.get("/api/admin/colors").catch(handleApiError);

export const getSizes = () => 
    api.get("/api/admin/sizes").catch(handleApiError);

export const getSpecifications = () => 
    api.get("/api/admin/specifications").catch(handleApiError);


// Add Category
export const addCategory = async (data) => {

  try {

    const response = await api.post("/api/admin/add-category", data, {

      headers: {

        "Content-Type": "multipart/form-data",

      },
    });

    return response.data;

  } catch (error) {

    handleApiError(error);

  }
};

export const addColor = (data) => 
    api.post("/api/admin/add-color", data).catch(handleApiError);

export const addSize = (data) => 
    api.post("/api/admin/add-size", data).catch(handleApiError);

export const addSpecification = (data) => 
    api.post("/api/admin/add-specification", data).catch(handleApiError);


// Delete Category
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/api/admin/catgeory/delete/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteColor = (id) => 
    api.delete(`/api/admin/delete-color/${id}`).catch(handleApiError);

export const deleteSize = (id) => 
    api.delete(`/api/admin/delete-size/${id}`).catch(handleApiError);

export const deleteSpecification = (id) => 
    api.delete(`/api/admin/delete-specification/${id}`).catch(handleApiError);


// Update Category
export const updateCategory = async (id, data) => 
  { 
  try 
  {
    const response = await api.post(

      `/api/admin/category/${id}/update`,
      data,

      {
        headers: {

          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateColor = (id, data) => 
    api.post(`/api/admin/update-color/${id}`, data).catch(handleApiError);

export const updateSize = (id, data) => 
    
    api.post(`/api/admin/update-size/${id}`, data).catch(handleApiError);

export const updateSpecification = (id, data) => 
    api.post(`/api/admin/update-specification/${id}`, data).catch(handleApiError);


// Get Subcategories by Category ID
export const getSubCategoriesByCategory = async (categoryId) =>
   {
  try {
    const response = await api.get(`/api/admin/subcategory/${categoryId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const getSubCategories = async () => 
  {

  try 
  {
    const response = await api.get("/api/admin/subcategories");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

  export const addSubCategory = async (data) => {

  try {

    const response = await api.post("/api/admin/add-subcategory", data, {

      headers: {

        "Content-Type": "multipart/form-data",

      },
    });

    return response.data;

  } catch (error) {

    handleApiError(error);

  }
};