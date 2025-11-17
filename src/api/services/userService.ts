import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    AdminUserDto,
    RoleInfoDto,
    UsersQueryParams,
    UsersQueryResponse,
    UserPayload,
    UpdateProfilePayload,
    ChangeUserPasswordPayload,
} from "../../types/user";

/**
 * User Management Service
 * Handles all user-related operations
 */

const cleanUserParams = (params: UsersQueryParams) => {
    const queryParams: Record<string, string | number> = {
        page: params.page,
        pageSize: params.pageSize,
    };
    if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
    if (params.status) queryParams.status = params.status;
    if (params.organizationId)
        queryParams.organizationId = params.organizationId;
    if (params.roleId) queryParams.roleId = params.roleId;
    if (typeof params.emailVerified === "boolean")
        queryParams.emailVerified = params.emailVerified.toString();
    if (params.sortColumn) queryParams.sortColumn = params.sortColumn;
    if (params.sortDirection) queryParams.sortDirection = params.sortDirection;
    return queryParams;
};

export const fetchUsers = async (
    params: UsersQueryParams
): Promise<Result<UsersQueryResponse>> => {
    const cleanedParams = cleanUserParams(params);
    const response = await apiClient.get<Result<UsersQueryResponse>>("/users", {
        params: cleanedParams,
    });
    return response.data;
};

export const getUser = async (id: string): Promise<Result<AdminUserDto>> => {
    const response = await apiClient.get<Result<AdminUserDto>>(`/users/${id}`);
    return response.data;
};

export const getUserProfile = async (): Promise<Result<AdminUserDto>> => {
    const response = await apiClient.get<Result<AdminUserDto>>(
        "/users/profile"
    );
    return response.data;
};

export const createUser = async (
    payload: UserPayload
): Promise<Result<AdminUserDto>> => {
    const response = await apiClient.post<Result<AdminUserDto>>(
        "/users",
        payload
    );
    return response.data;
};

export const updateUser = async (
    id: string,
    payload: Partial<UserPayload>
): Promise<Result<AdminUserDto>> => {
    const response = await apiClient.put<Result<AdminUserDto>>(
        `/users/${id}`,
        payload
    );
    return response.data;
};

export const updateUserProfile = async (
    payload: UpdateProfilePayload
): Promise<Result<AdminUserDto>> => {
    const response = await apiClient.put<Result<AdminUserDto>>(
        "/users/profile",
        payload
    );
    return response.data;
};

export const deleteUser = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.delete<Result<void>>(`/users/${id}`);
    return response.data;
};

export const changeUserPassword = async (
    payload: ChangeUserPasswordPayload
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        "/users/change-password",
        payload
    );
    return response.data;
};

export const resetUserPassword = async (
    userId: string
): Promise<Result<{ message: string; temporaryPassword: string }>> => {
    const response = await apiClient.post<
        Result<{ message: string; temporaryPassword: string }>
    >(`/users/${userId}/reset-password`);
    return response.data;
};

export const toggleUserStatus = async (
    id: string,
    status: "active" | "inactive" | "suspended"
): Promise<Result<AdminUserDto>> => {
    const response = await apiClient.patch<Result<AdminUserDto>>(
        `/users/${id}/status`,
        { status }
    );
    return response.data;
};

export const bulkDeleteUsers = async (
    ids: string[]
): Promise<Result<{ message: string }>> => {
    const response = await apiClient.post<Result<{ message: string }>>(
        "/users/bulk-delete",
        {
            ids,
        }
    );
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getUsersPaginated = async (
    page: number = 1,
    pageSize: number = 10
): Promise<PaginatedResult<AdminUserDto>> => {
    const params = cleanPaginationParams(page, pageSize);
    const response = await apiClient.get<PaginatedResult<AdminUserDto>>(
        "/users/get-pagination",
        {
            params,
        }
    );
    return response.data;
};
