// src/api/aboutUsApi.js
import api from './axios';

// GET API - To fetch current data
export const getAboutUs = async () => {
  const response = await api.get('/api/get_about_us');
  return response.data;
};

// POST API - To update content
export const updateAboutUs = async (payload) => {
  const response = await api.post('/api/about-us', payload);
  return response.data;
};