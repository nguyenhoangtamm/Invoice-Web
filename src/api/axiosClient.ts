import axios from "axios";
import { API_CONFIG } from "./config";

// Create axios instance with default configuration
const axiosClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
    },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors here
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem("authToken");
            // Redirect to login if needed
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
