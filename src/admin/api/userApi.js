import api from './axios'; 
// Fetch all customers
export const getCustomers = async () => {
  try {
    const response = await api.get('/api/admin/Customers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a customer by ID
export const deleteCustomerApi = async (id) => {
  try {
    const response = await api.delete(`/api/admin/DeleteCustomer/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};