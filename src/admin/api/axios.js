import axios from 'axios';

export const BASE_URL = "https://kalkideals.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ensure this matches your login storage key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Some APIs return 200 OK but { status: false } for auth errors
    if (response.data && response.data.message === "admin token required") {
      console.error("Auth Error: Token is invalid or missing");
      // Optional: window.location.href = '/login'; 
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;