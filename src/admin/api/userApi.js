import api from './axios'; 

export const getCustomers = async () => {
  const response = await api.get('/api/admin/Customers');
  return response.data;
};

export const deleteCustomerApi = async (id) => {
  const response = await api.get(`/api/admin/delete/user/${id}`);
  return response.data;
};

export const getUserOrderHistory = async (userId) => {
  const response = await api.get(`/api/admin/see/orders?user_id=${userId}`);
  return response.data;
};

export const getUserReturnHistory = async (userId) => {
  const response = await api.get(`/api/admin/return/history?user_id=${userId}`);
  return response.data;
};