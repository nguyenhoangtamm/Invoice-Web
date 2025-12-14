import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
} from "../../types/role";

/**
 * Role Management Service
 * Handles all role-related operations
 */

export const createRole = async (
    data: CreateRoleRequest
): Promise<Result<Role>> => {
    const response = await apiClient.post<Result<Role>>("/Roles/create", data);
    return response.data;
};

export const updateRole = async (
    data: UpdateRoleRequest
): Promise<Result<Role>> => {
    const response = await apiClient.post<Result<Role>>(
        `/Roles/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteRole = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(`/Roles/delete/${id}`);
    return response.data;
};

export const getRoleById = async (id: string): Promise<Result<Role>> => {
    const response = await apiClient.get<Result<Role>>(
        `/Roles/get-by-id/${id}`
    );
    return response.data;
};

export const getAllRoles = async (): Promise<Result<Role[]>> => {
    const response = await apiClient.get<Result<Role[]>>("/Roles/get-all");
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getRolesPaginated = async (
    page: number = 1,
    pageSize: number = 10,
    keyWord?: string
): Promise<PaginatedResult<Role>> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (keyWord) params.keyWord = keyWord;

    const response = await apiClient.get<PaginatedResult<Role>>(
        "/Roles/get-pagination",
        {
            params,
        }
    );
    return response.data;
};

export const assignPermissionsToRole = async (
    roleId: string,
    permissions: string[]
): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/Roles/${roleId}/permissions`,
        {
            permissions,
        }
    );
    return response.data;
};
