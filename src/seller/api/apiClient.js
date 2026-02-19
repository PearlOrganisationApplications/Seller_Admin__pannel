import axios from 'axios';

export const BASE_URL = "https://kalkideals.com/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        // ALWAYS get the latest token from storage right before the request
        const token = localStorage.getItem('token');
        if (token && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log the error so you can see it in the Inspect -> Console tab
        console.error("API Error:", error.response?.status, error.config.url);

        if (error.response && error.response.status === 401) {
            // ONLY clear if we are NOT on the login page
            if (!window.location.pathname.includes('login')) {
                console.warn("Unauthorized! Clearing session...");
                localStorage.clear();
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;