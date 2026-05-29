import api from "./axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/api/admin/dashboard");

  return response.data;
};