import { API_CONFIG } from "./config";
import type { ApiResponse } from "../types/invoice";

/**
 * Base API Client
 * Provides common HTTP methods for all API services
 */
export class BaseApiClient {
    protected baseUrl: string;
    protected timeout: number;
    protected defaultHeaders: Record<string, string>;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
        this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
    }

    // Set auth token for requests
    setAuthToken(token: string) {
        this.defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Remove auth token
    clearAuthToken() {
        delete this.defaultHeaders["Authorization"];
    }

    // Generic HTTP request method
    protected async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const config: RequestInit = {
                ...options,
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers,
                },
                signal: AbortSignal.timeout(this.timeout),
            };

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message:
                        data.Message || data.message || "API request failed",
                    errors: data.errors,
                };
            }

            return {
                success: true,
                data: data,
                message: data.Message || data.message,
            };
        } catch (error) {
            console.error("API request error:", error);
            return {
                success: false,
                message: "Network error occurred",
                errors: [
                    error instanceof Error ? error.message : "Unknown error",
                ],
            };
        }
    }

    // HTTP Methods
    protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "GET" });
    }

    protected async post<T>(
        endpoint: string,
        data?: any
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected async put<T>(
        endpoint: string,
        data?: any
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }

    protected async patch<T>(
        endpoint: string,
        data?: any
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    // Upload file method
    protected async uploadFile<T>(
        endpoint: string,
        file: File,
        fieldName: string = "file"
    ): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append(fieldName, file);

        return this.request<T>(endpoint, {
            method: "POST",
            body: formData,
            headers: {
                // Don't set Content-Type for FormData, let browser set it with boundary
                ...this.defaultHeaders,
                "Content-Type": undefined as any,
            },
        });
    }
}
