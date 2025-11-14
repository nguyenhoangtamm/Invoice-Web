import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

// User DTO (extends from auth UserDto but with admin fields)
export type AdminUserDto = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
    dateOfBirth: string | null;
    address: string | null;
    roles: RoleInfoDto[];
    organizationId: string | null;
    organizationName: string | null;
    status: "active" | "inactive" | "suspended";
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string | null;
    lastLoginAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
};

// Role Info DTO for user
export type RoleInfoDto = {
    id: string;
    name: string;
    code: string;
    permissions: string[];
};

// User Query Parameters
export type UsersQueryParams = {
    page: number;
    pageSize: number;
    searchTerm?: string;
    status?: "active" | "inactive" | "suspended";
    organizationId?: string;
    roleId?: string;
    emailVerified?: boolean;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
};

// User Query Response
export type UsersQueryResponse = {
    items: AdminUserDto[];
    totalCount: number;
    page: number;
    pageSize: number;
};

// User Payload for Create/Update
export type UserPayload = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    address?: string | null;
    organizationId?: string | null;
    roleIds: string[];
    status: "active" | "inactive" | "suspended";
    password?: string; // Required for create, optional for update
};

// Update Profile Payload
export type UpdateProfilePayload = {
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    address?: string | null;
    avatar?: string | null;
};

// Change Password Payload
export type ChangeUserPasswordPayload = {
    userId: string;
    newPassword: string;
    confirmPassword: string;
};

// Helper function to clean parameters
const cleanUsersParams = (params: UsersQueryParams) => {
    const payload: Record<string, string | number | boolean> = {
        page: params.page,
        pageSize: params.pageSize,
    };
    if (params.searchTerm) payload.searchTerm = params.searchTerm;
    if (params.status) payload.status = params.status;
    if (params.organizationId) payload.organizationId = params.organizationId;
    if (params.roleId) payload.roleId = params.roleId;
    if (typeof params.emailVerified === "boolean")
        payload.emailVerified = params.emailVerified;
    if (params.sortColumn) payload.sortColumn = params.sortColumn;
    if (params.sortDirection) payload.sortDirection = params.sortDirection;
    return payload;
};

// API Functions
export const fetchUsers = async (
    params: UsersQueryParams,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<UsersQueryResponse> => {
    const response = await axiosClient.get<UsersQueryResponse>("/api/users", {
        params: cleanUsersParams(params),
        signal: options?.signal,
    });
    return response.data;
};

export const getUser = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<AdminUserDto> => {
    const response = await axiosClient.get<AdminUserDto>(`/api/users/${id}`, {
        signal: options?.signal,
    });
    return response.data;
};

export const getUserProfile = async (
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<AdminUserDto> => {
    const response = await axiosClient.get<AdminUserDto>("/api/users/profile", {
        signal: options?.signal,
    });
    return response.data;
};

export const createUser = async (
    payload: UserPayload
): Promise<AdminUserDto> => {
    const response = await axiosClient.post<AdminUserDto>(
        "/api/users",
        payload
    );
    return response.data;
};

export const updateUser = async (
    id: string,
    payload: Partial<UserPayload>
): Promise<AdminUserDto> => {
    const response = await axiosClient.put<AdminUserDto>(
        `/api/users/${id}`,
        payload
    );
    return response.data;
};

export const updateUserProfile = async (
    payload: UpdateProfilePayload
): Promise<AdminUserDto> => {
    const response = await axiosClient.put<AdminUserDto>(
        "/api/users/profile",
        payload
    );
    return response.data;
};

export const deleteUser = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<void> => {
    await axiosClient.delete(`/api/users/${id}`, { signal: options?.signal });
};

export const changeUserPassword = async (
    payload: ChangeUserPasswordPayload
): Promise<{ message: string }> => {
    const response = await axiosClient.post<{ message: string }>(
        "/api/users/change-password",
        payload
    );
    return response.data;
};

export const resetUserPassword = async (
    userId: string
): Promise<{ message: string; temporaryPassword: string }> => {
    const response = await axiosClient.post<{
        message: string;
        temporaryPassword: string;
    }>(`/api/users/${userId}/reset-password`);
    return response.data;
};

export const toggleUserStatus = async (
    id: string,
    status: "active" | "inactive" | "suspended"
): Promise<AdminUserDto> => {
    const response = await axiosClient.patch<AdminUserDto>(
        `/api/users/${id}/status`,
        { status }
    );
    return response.data;
};

export const bulkDeleteUsers = async (
    ids: string[]
): Promise<{ message: string }> => {
    const response = await axiosClient.post<{ message: string }>(
        "/api/users/bulk-delete",
        { ids }
    );
    return response.data;
};

// Keep the old class for backward compatibility
export class UserApiService {
    getUserProfile = getUserProfile;
    updateUserProfile = updateUserProfile;

    // Mock methods for token management (if needed)
    setAuthToken = (token: string) => {};
    clearAuthToken = () => {};
}

// Export singleton instance for backward compatibility
export const userApiService = new UserApiService();
