import type { AxiosRequestConfig } from "axios";
import apiClient from "../apiClient";
import type { Result } from "../../types/common";

// Auth DTOs
export type LoginDto = {
    usernameOrEmail: string;
    password: string;
    rememberMe?: boolean;
};

export type RegisterDto = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone?: string;
    agreeToTerms: boolean;
};

export type AuthResponseDto = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: UserDto;
};

export type UserDto = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string | null;
    avatar: string | null;
    role: string;
    status: "active" | "inactive" | "suspended";
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string | null;
    lastLoginAt: string | null;
};

export type RefreshTokenDto = {
    refreshToken: string;
};

export type ForgotPasswordDto = {
    email: string;
};

export type ResetPasswordDto = {
    token: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type ChangePasswordDto = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

// API Functions
export const login = async (
    payload: LoginDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<AuthResponseDto>> => {
    const response = await apiClient.post<Result<AuthResponseDto>>(
        "/auth/login",
        payload,
        {
            signal: options?.signal,
        }
    );

    const payloadData = response.data.data;

    // Store token in localStorage (both legacy and context keys are handled by AuthContext)
    if (payloadData?.accessToken) {
        try {
            localStorage.setItem("authToken", payloadData.accessToken);
            localStorage.setItem("refreshToken", payloadData.refreshToken);
        } catch (e) {
            // ignore storage errors
        }
    }

    return response.data;
};

export const register = async (
    payload: RegisterDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<AuthResponseDto>> => {
    const response = await apiClient.post<Result<AuthResponseDto>>(
        "/auth/register",
        payload,
        {
            signal: options?.signal,
        }
    );

    const payloadData = response.data.data;

    if (payloadData?.accessToken) {
        try {
            localStorage.setItem("authToken", payloadData.accessToken);
            localStorage.setItem("refreshToken", payloadData.refreshToken);
        } catch (e) {}
    }

    return response.data;
};

export const logout = async (
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        "/auth/logout",
        {},
        {
            signal: options?.signal,
        }
    );

    // Clear tokens from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    return response.data;
};

export const refreshToken = async (
    payload: RefreshTokenDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<AuthResponseDto>> => {
    const response = await apiClient.post<Result<AuthResponseDto>>(
        "/auth/refresh",
        payload,
        {
            signal: options?.signal,
        }
    );

    const payloadData = response.data.data;

    if (payloadData?.accessToken) {
        try {
            localStorage.setItem("authToken", payloadData.accessToken);
            localStorage.setItem("refreshToken", payloadData.refreshToken);
        } catch (e) {}
    }

    return response.data;
};

export const getCurrentUser = async (
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<UserDto>> => {
    const response = await apiClient.get<Result<UserDto>>("/auth/me", {
        signal: options?.signal,
    });
    return response.data;
};

export const forgotPassword = async (
    payload: ForgotPasswordDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        "/auth/forgot-password",
        payload,
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const resetPassword = async (
    payload: ResetPasswordDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        "/auth/reset-password",
        payload,
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const changePassword = async (
    payload: ChangePasswordDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        "/auth/change-password",
        payload,
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const verifyEmail = async (
    token: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        `/auth/verify-email/${token}`,
        {},
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

// Utility functions
export const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken");
};

export const getRefreshTokenValue = (): string | null => {
    return localStorage.getItem("refreshToken");
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const clearAuthTokens = (): void => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
};

// Keep the old class for backward compatibility
export class AuthApiService {
    login = (loginData: any) => login(loginData);
    register = (registerData: any) => register(registerData);
    logout = logout;
    refreshToken = (refreshTokenData: any) => refreshToken(refreshTokenData);
    getCurrentUser = getCurrentUser;
    forgotPassword = (email: string) => forgotPassword({ email });

    // Mock methods for token management
    setAuthToken = (token: string) => {
        localStorage.setItem("authToken", token);
    };
    clearAuthToken = () => {
        clearAuthTokens();
    };
}

// Export singleton instance for backward compatibility
export const authApiService = new AuthApiService();
