import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

// Role DTO
export type RoleDto = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    permissions: string[];
    isSystem: boolean;
    isActive: boolean;
    organizationId: string | null;
    organizationName: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
};

// Role Query Parameters
export type RolesQueryParams = {
    page: number;
    pageSize: number;
    searchTerm?: string;
    isActive?: boolean;
    isSystem?: boolean;
    organizationId?: string;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
};

// Role Query Response
export type RolesQueryResponse = {
    items: RoleDto[];
    totalCount: number;
    page: number;
    pageSize: number;
};

// Role Payload for Create/Update
export type RolePayload = {
    name: string;
    code: string;
    description?: string | null;
    permissions: string[];
    isActive: boolean;
    organizationId?: string | null;
};

// Permission DTO
export type PermissionDto = {
    id: string;
    name: string;
    code: string;
    description: string | null;
    category: string;
    isActive: boolean;
};

// Helper function to clean parameters
const cleanRolesParams = (params: RolesQueryParams) => {
    const payload: Record<string, string | number | boolean> = {
        page: params.page,
        pageSize: params.pageSize,
    };
    if (params.searchTerm) payload.searchTerm = params.searchTerm;
    if (typeof params.isActive === "boolean")
        payload.isActive = params.isActive;
    if (typeof params.isSystem === "boolean")
        payload.isSystem = params.isSystem;
    if (params.organizationId) payload.organizationId = params.organizationId;
    if (params.sortColumn) payload.sortColumn = params.sortColumn;
    if (params.sortDirection) payload.sortDirection = params.sortDirection;
    return payload;
};

// API Functions
export const fetchRoles = async (
    params: RolesQueryParams,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<RolesQueryResponse> => {
    const response = await axiosClient.get<RolesQueryResponse>("/api/roles", {
        params: cleanRolesParams(params),
        signal: options?.signal,
    });
    return response.data;
};

export const getAllRoles = async (
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<RoleDto[]> => {
    const response = await axiosClient.get<RoleDto[]>("/api/roles/all", {
        signal: options?.signal,
    });
    return response.data;
};

export const getRole = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<RoleDto> => {
    const response = await axiosClient.get<RoleDto>(`/api/roles/${id}`, {
        signal: options?.signal,
    });
    return response.data;
};

export const createRole = async (payload: RolePayload): Promise<RoleDto> => {
    const response = await axiosClient.post<RoleDto>("/api/roles", payload);
    return response.data;
};

export const updateRole = async (
    id: string,
    payload: RolePayload
): Promise<RoleDto> => {
    const response = await axiosClient.put<RoleDto>(
        `/api/roles/${id}`,
        payload
    );
    return response.data;
};

export const deleteRole = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<void> => {
    await axiosClient.delete(`/api/roles/${id}`, { signal: options?.signal });
};

export const getAllPermissions = async (
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<PermissionDto[]> => {
    const response = await axiosClient.get<PermissionDto[]>(
        "/api/permissions",
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const bulkDeleteRoles = async (
    ids: string[]
): Promise<{ message: string }> => {
    const response = await axiosClient.post<{ message: string }>(
        "/api/roles/bulk-delete",
        { ids }
    );
    return response.data;
};

// Keep the old class for backward compatibility
export class RoleService {
    createRole = (data: any) => createRole(data);
    updateRole = (data: any) => updateRole(data.id, data);
    deleteRole = deleteRole;
    getRoleById = getRole;
    getAllRoles = getAllRoles;
    getRolesPaginated = (page = 1, pageSize = 10) =>
        fetchRoles({ page, pageSize });
}

// Export singleton instance for backward compatibility
export const roleService = new RoleService();
