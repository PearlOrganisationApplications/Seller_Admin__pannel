import api from './axios';

// POST Send Notification
export const sendNotification = async (formData) => {
  try {
    const response = await api.post('/api/send-notification', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};