import api from './axios'; 

// Fetch all customers
export const getCustomers = async () => {
  const response = await api.get('/api/admin/Customers');
  return response.data;
};

// Updated Delete User endpoint
export const deleteCustomerApi = async (id) => {
  const response = await api.get(`/api/admin/delete/user/${id}`);
  return response.data;
};

// Get User Order History
export const getUserOrderHistory = async (userId) => {
  const response = await api.get(`/api/admin/see/orders?user_id=${userId}`);
  return response.data;
};

// Get User Return History
export const getUserReturnHistory = async (userId) => {
  const response = await api.get(`/api/admin/return/history?user_id=${userId}`);
  return response.data;
};