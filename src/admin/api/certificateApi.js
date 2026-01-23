// certificateApi.js
import api from './axios';

// GET API
export const getKalkiCertificates = async () => {
  try {
    const response = await api.get('/api/admin/kalkicertificate-requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST API - NEW
export const updateKalkiCertificate = async (payload) => {
  try {
    // payload: { product_uid, status, reason }
    const response = await api.post('/api/admin/kalkicertificate-update', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};