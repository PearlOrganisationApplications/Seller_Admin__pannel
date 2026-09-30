import apiClient from './apiClient';

export const addProduct = async (formData) => 
    {

    const response = await apiClient.post('/seller/add-product', formData,
         {

        headers: {

            'Content-Type': 'multipart/form-data',
        },

    });

    return response.data;

};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/products/categories"); // apna actual endpoint check karo
    return response.data;
  } catch (error) {
    console.error("fetchCategories error:", error);
    return { status: false, data: [] };
  }
};


export const getSubcategoriesByCategory = async (categoryId) => 
    {
  try {
    const response = await apiClient.get(

      `/products/categories/${categoryId}/subcategories`
    );

    return response.data;
  } 
  catch (error) 
  {
    handleApiError(error);
  }
};
export const fetchColors = async () => {
  try {
    const response = await apiClient.get("/seller/colour");
    return response.data;
  } catch (error) {
    console.error("fetchColors error:", error);
    return { status: false, colors: [] };
  }
};

export const fetchSizes = async () => {
  try {
    const response = await apiClient.get("/seller/size");
    return response.data;
  } catch (error) {
    console.error("fetchSizes error:", error);
    return { status: false, sizes: [] };
  }
};

export const fetchSpecifications = async () => {
  try {
    const response = await apiClient.get("/seller/Specification");
    return response.data;
  } catch (error) {
    console.error("fetchSpecifications error:", error);
    return { status: false, specifications: [] };
  }
};