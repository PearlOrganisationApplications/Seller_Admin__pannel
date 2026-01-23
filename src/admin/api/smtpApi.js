// src/api/smtpApi.js
import api from './axios';

// GET API
export const getSmtpSettings = async () => {
  try {
    const response = await api.get('/api/admin/getsmtp');
    return response.data; 
  } catch (error) {
    throw error;
  }
};

// POST API - Updated with correct endpoint
export const updateSmtpSettings = async (payload) => {
  try {
    // payload: { mail_host, mail_port, mail_username, mail_password, mail_encryption }
    const response = await api.post('/api/admin/updatesmtp', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};