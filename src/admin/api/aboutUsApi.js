// src/api/aboutUsApi.js
import api from './axios';

// GET API - To fetch current data
export const getAboutUs = async () => {
  try {
    const response = await api.get('/api/get_about_us');
    return response.data; 
  } catch (error) {
    throw error;
  }
};

// POST API - To update content
export const updateAboutUs = async (payload) => {
  try {
    // payload: { title, description }
    // Updated endpoint to /api/about-us as requested
    const response = await api.post('/api/about-us', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};