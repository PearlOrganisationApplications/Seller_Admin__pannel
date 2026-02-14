// certificateApi.js
import api from './axios';

export const getKalkiCertificates = async () => {
  try {
    const response = await api.get('/api/admin/kalkicertificate-requests');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateKalkiCertificate = async (payload) => {
  try {
    // We send the ID now to ensure the correct record is updated
    const response = await api.post('/api/admin/kalkicertificate-update', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};