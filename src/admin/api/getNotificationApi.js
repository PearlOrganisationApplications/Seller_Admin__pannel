import api from "./axios";

// Fetch all admin notifications
export const getNotifications = async () => {
  const response = await api.get(
    "/api/admin/send/get-notifications"
  );

  return response.data;
};