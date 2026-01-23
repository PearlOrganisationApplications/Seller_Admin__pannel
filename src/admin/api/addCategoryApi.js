import api from "../api/axios";


const handleApiError = (error) => {
    // 1. Check if the server sent a specific error message
    const message = error.response?.data?.message || 
                    error.response?.data?.error || 
                    "An unexpected error occurred. Please try again.";

    console.error("API Error Response:", error.response?.data);
    
    throw message; 
};

// --- GET ALL ---
export const getCategories = () => 
    api.get("/api/admin/categories").catch(handleApiError);

export const getColors = () => 
    api.get("/api/admin/colors").catch(handleApiError);

export const getSizes = () => 
    api.get("/api/admin/sizes").catch(handleApiError);

export const getSpecifications = () => 
    api.get("/api/admin/specifications").catch(handleApiError);


// --- ADD ---
export const addCategory = (data) => 
    api.post("/api/admin/add-category", data).catch(handleApiError);

export const addColor = (data) => 
    api.post("/api/admin/add-color", data).catch(handleApiError);

export const addSize = (data) => 
    api.post("/api/admin/add-size", data).catch(handleApiError);

export const addSpecification = (data) => 
    api.post("/api/admin/add-specification", data).catch(handleApiError);


// --- DELETE ---
export const deleteCategory = (id) => 
    api.delete(`/api/admin/delete-category/${id}`).catch(handleApiError);

export const deleteColor = (id) => 
    api.delete(`/api/admin/delete-color/${id}`).catch(handleApiError);

export const deleteSize = (id) => 
    api.delete(`/api/admin/delete-size/${id}`).catch(handleApiError);

export const deleteSpecification = (id) => 
    api.delete(`/api/admin/delete-specification/${id}`).catch(handleApiError);


// --- UPDATE ---
export const updateCategory = (id, data) => 
    api.post(`/api/admin/update-category/${id}`, data).catch(handleApiError);

export const updateColor = (id, data) => 
    api.post(`/api/admin/update-color/${id}`, data).catch(handleApiError);

export const updateSize = (id, data) => 
    api.post(`/api/admin/update-size/${id}`, data).catch(handleApiError);

export const updateSpecification = (id, data) => 
    api.post(`/api/admin/update-specification/${id}`, data).catch(handleApiError);