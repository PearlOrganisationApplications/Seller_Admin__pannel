import api from "./axios";

// Login Function
export const loginAdmin = async (email, password) => {
  const response = await api.post("/api/admin/login", {
    email,
    password,
  });

  return response.data;
};

// Register Function
export const registerAdmin = async (adminData) => {
  const response = await api.post(
    "/api/admin/register",
    adminData
  );

  return response.data;
};