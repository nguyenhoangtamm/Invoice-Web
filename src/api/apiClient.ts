import axios from "axios";
import { API_CONFIG } from "./config";

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    withCredentials: false,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("authToken") ||
            localStorage.getItem("invoice_access_token");
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
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("invoice_access_token");
        }
        return Promise.reject(error);
    }
);

export default apiClient;
