import api from './axios';

// Login Function
export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post('/api/admin/login', {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Register Function (Based on your Postman screenshot)
export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/api/admin/register', adminData);
    return response.data;
  } catch (error) {
    throw error;
  }
};