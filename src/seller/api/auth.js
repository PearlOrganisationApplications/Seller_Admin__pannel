import apiClient from './apiClient';


export const loginSeller = async (loginData) => {
  const response = await apiClient.post("/user/login", loginData);

  return response.data;
};