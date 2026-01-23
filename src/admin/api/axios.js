import axios from 'axios';

export const BASE_URL = "https://kalkideals.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json', // We want JSON responses
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // localStorage.clear();
        // window.location.href = '/login';
      } else if (status === 500) {
        console.error("Internal Server Error: Check backend logs.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;