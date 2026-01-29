import api from './axios'; // adjust path to your axios file

export const orderApi = {
  getPendingOrders: () => api.get('/api/admin/get/pending/order'),
  getCancelledOrders: () => api.get('/api/admin/orders/cancelled'),
  getTodayOrders: () => api.get('/api/admin/orders/today'),
  getReturnOrders: () => api.get('/api/admin/orders/returns'),
  getConfirmedOrders: () => api.get('/api/admin/orders/confirmed'),
  getAllOrders: () => api.get('/api/admin/get/all/order'), 
   getTodayOrders: () => api.get('/api/admin/orders/today'),
  getOrderSee: (orderId) => api.get(`/api/admin/order/see/${orderId}`),
};