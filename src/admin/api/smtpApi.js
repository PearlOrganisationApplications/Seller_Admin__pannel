// src/api/smtpApi.js
import api from './axios';

export const getSmtpSettings = async () => {
  const response = await api.get('/api/admin/getsmtp');
  return response.data;
};


export const updateSmtpSettings = async (payload) => {
  const response = await api.post('/api/admin/updatesmtp', payload);
  return response.data;
};