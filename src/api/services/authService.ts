import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import * as mockApi from "../mockApi";
import type {
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
    AuthResponse,
    CurrentUserResponse,
    ApiResponse,
} from "../../types/invoice";

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export class AuthApiService extends BaseApiClient {
    async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        if (USE_MOCK_API) {
            return mockApi.loginApi(loginData);
        }

        try {
            const response = await this.post<AuthResponse>(
                API_CONFIG.ENDPOINTS.LOGIN,
                loginData
            );

            // Set auth token if login successful
            if (response.success && response.data?.data?.accessToken) {
                this.setAuthToken(response.data.data.accessToken);
            }

            return response;
        } catch (error) {
            return {
                success: false,
                message: "Đăng nhập thất bại",
                errors: [
                    error instanceof Error ? error.message : "Unknown error",
                ],
            };
        }
    }

    async register(
        registerData: RegisterRequest
    ): Promise<ApiResponse<AuthResponse>> {
        if (USE_MOCK_API) {
            return mockApi.registerApi(registerData);
        }

        try {
            const response = await this.post<AuthResponse>(
                API_CONFIG.ENDPOINTS.REGISTER,
                registerData
            );

            // Set auth token if registration successful
            if (response.success && response.data?.data?.accessToken) {
                this.setAuthToken(response.data.data.accessToken);
            }

            return response;
        } catch (error) {
            return {
                success: false,
                message: "Đăng ký thất bại",
                errors: [
                    error instanceof Error ? error.message : "Unknown error",
                ],
            };
        }
    }

    async logout(): Promise<ApiResponse<{ message: string }>> {
        if (USE_MOCK_API) {
            return { success: true, message: "Đăng xuất thành công" };
        }

        try {
            const response = await this.post<{ message: string }>(
                API_CONFIG.ENDPOINTS.LOGOUT
            );

            // Clear auth token after logout
            if (response.success) {
                this.clearAuthToken();
            }

            return response;
        } catch (error) {
            return {
                success: false,
                message: "Đăng xuất thất bại",
                errors: [
                    error instanceof Error ? error.message : "Unknown error",
                ],
            };
        }
    }

    async refreshToken(
        refreshTokenData: RefreshTokenRequest
    ): Promise<ApiResponse<AuthResponse>> {
        if (USE_MOCK_API) {
            // Mock implementation for refresh token
            return {
                success: true,
                data: {
                    data: {
                        accessToken: "mock_new_access_token",
                        refreshToken: "mock_new_refresh_token",
                        user: {
                            userName: "mockuser",
                            fullName: "Mock User",
                            role: "user",
                        },
                    },
                    message: "Làm mới token thành công",
                },
                message: "Làm mới token thành công",
            };
        }

        try {
            const response = await this.post<AuthResponse>(
                API_CONFIG.ENDPOINTS.REFRESH_TOKEN,
                refreshTokenData
            );

            // Update auth token if refresh successful
            if (response.success && response.data?.data?.accessToken) {
                this.setAuthToken(response.data.data.accessToken);
            }

            return response;
        } catch (error) {
            return {
                success: false,
                message: "Làm mới token thất bại",
                errors: [
                    error instanceof Error ? error.message : "Unknown error",
                ],
            };
        }
    }

    async getCurrentUser(): Promise<ApiResponse<CurrentUserResponse>> {
        if (USE_MOCK_API) {
            // Mock implementation for getCurrentUser
            return {
                success: true,
                data: {
                    id: "123",
                    userName: "mockuser",
                    email: "mock@example.com",
                    roleId: "user",
                    status: "active",
                },
                message: "Lấy thông tin người dùng thành công",
            };
        }

        try {
            return this.get<CurrentUserResponse>(API_CONFIG.ENDPOINTS.ME);
        } catch (error) {
            return {
                success: false,
                message: "Không tìm thấy người dùng",
                errors: [
                    error instanceof Error ? error.message : "Unknown error",
                ],
            };
        }
    }

    async forgotPassword(
        email: string
    ): Promise<ApiResponse<{ message: string }>> {
        if (USE_MOCK_API) {
            return mockApi.forgotPasswordApi(email);
        }

        return this.post<{ message: string }>(
            API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
            { email }
        );
    }
}

// Export singleton instance
export const authApiService = new AuthApiService();
