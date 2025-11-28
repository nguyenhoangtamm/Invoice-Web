import type { AxiosRequestConfig } from "axios";
import apiClient from "../apiClient";
import type { Result } from "../../types/common";

export type ForgotPasswordDto = {
    email: string;
};

export type ResetPasswordDto = {
    token: string;
    newPassword: string;
    confirmPassword: string;
};

export type ForgotPasswordResponseDto = {
    message: string;
};

export type ResetPasswordResponseDto = {
    message: string;
};

export const forgotPassword = async (
    payload: ForgotPasswordDto,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Result<ForgotPasswordResponseDto>> => {
    const response = await apiClient.post<Result<ForgotPasswordResponseDto>>(
        "/PasswordReset/forgot-password",
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
): Promise<Result<ResetPasswordResponseDto>> => {
    const response = await apiClient.post<Result<ResetPasswordResponseDto>>(
        "/PasswordReset/reset-password",
        payload,
        {
            signal: options?.signal,
        }
    );
    return response.data;
};
