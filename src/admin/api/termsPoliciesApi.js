import api from './axios';

// GET: Fetch all terms and policies
export const getTermsPolicies = async () => {
  try {
    const response = await api.get('/api/terms-policies');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST: Update a specific policy by ID (as per your Postman screenshot)
export const updateTermsPolicies = async (id, payload) => {
  try {
    // payload should contain { title, description }
    const response = await api.post(`/api/terms-policies/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};