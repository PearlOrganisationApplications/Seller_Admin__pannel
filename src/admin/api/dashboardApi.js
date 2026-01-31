import api from './axios';

export const getDashboardSummary = async () => {
  try {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error;
  }
};