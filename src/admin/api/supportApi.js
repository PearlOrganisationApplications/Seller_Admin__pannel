import api from './axios';

// GET API - Fetch all support requests
export const getSupportRequests = async () => {
  try {
    const response = await api.get('/api/support');
    return response.data; // Returns { status: true, data: [...] }
  } catch (error) {
    throw error;
  }
};

// POST API - Create a new support request
export const createSupportRequest = async (payload) => {
  try {
    // payload: { name, email, phone, message }
    const response = await api.post('/api/support', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};