// LoginApi.js
import api from './axios'; // Import your configured axios instance

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