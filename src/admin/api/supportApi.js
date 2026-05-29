import api from './axios';

export const getSupportRequests = async () => {
  const response = await api.get('/api/support');
  return response.data;
};

export const createSupportRequest = async (payload) => {
  const response = await api.post('/api/support', payload);
  return response.data;
};