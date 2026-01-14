import axios from "axios";

const instance = axios.create({
  baseURL: "https://kalkideals.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
