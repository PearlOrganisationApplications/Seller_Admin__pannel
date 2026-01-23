import api from './axios'; // Ensure this path is correct

// Get All Buyers/Customers
export const getDashboardBuyers = async () => {
  try {
    const response = await api.get('/api/admin/Customers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get All Sellers
export const getDashboardSellers = async () => {
  try {
    const response = await api.get('/api/admin/Sellers');
    return response.data;
  } catch (error) {
    throw error;
  }
};