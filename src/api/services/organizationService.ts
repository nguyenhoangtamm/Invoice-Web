import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

// Organization DTO
export type OrganizationDto = {
    id: string;
    name: string;
    code: string | null;
    description: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    taxCode: string | null;
    parentId: string | null;
    parentName: string | null;
    level: number;
    status: "active" | "inactive" | "suspended";
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
};

// Organization Query Parameters
export type OrganizationsQueryParams = {
    page: number;
    pageSize: number;
    searchTerm?: string;
    status?: "active" | "inactive" | "suspended";
    parentId?: string;
    level?: number;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
};

// Organization Query Response
export type OrganizationsQueryResponse = {
    items: OrganizationDto[];
    totalCount: number;
    page: number;
    pageSize: number;
};

// Organization Payload for Create/Update
export type OrganizationPayload = {
    name: string;
    code?: string | null;
    description?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    taxCode?: string | null;
    parentId?: string | null;
    status: "active" | "inactive" | "suspended";
};

// Helper function to clean parameters
const cleanOrganizationsParams = (params: OrganizationsQueryParams) => {
    const payload: Record<string, string | number> = {
        page: params.page,
        pageSize: params.pageSize,
    };
    if (params.searchTerm) payload.searchTerm = params.searchTerm;
    if (params.status) payload.status = params.status;
    if (params.parentId) payload.parentId = params.parentId;
    if (typeof params.level === "number") payload.level = params.level;
    if (params.sortColumn) payload.sortColumn = params.sortColumn;
    if (params.sortDirection) payload.sortDirection = params.sortDirection;
    return payload;
};

// API Functions
export const fetchOrganizations = async (
    params: OrganizationsQueryParams,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<OrganizationsQueryResponse> => {
    const response = await axiosClient.get<OrganizationsQueryResponse>(
        "/api/organizations",
        {
            params: cleanOrganizationsParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};

export const getAllOrganizations = async (
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<OrganizationDto[]> => {
    const response = await axiosClient.get<OrganizationDto[]>(
        "/api/organizations/all",
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const getOrganization = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<OrganizationDto> => {
    const response = await axiosClient.get<OrganizationDto>(
        `/api/organizations/${id}`,
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const createOrganization = async (
    payload: OrganizationPayload
): Promise<OrganizationDto> => {
    const response = await axiosClient.post<OrganizationDto>(
        "/api/organizations",
        payload
    );
    return response.data;
};

export const updateOrganization = async (
    id: string,
    payload: OrganizationPayload
): Promise<OrganizationDto> => {
    const response = await axiosClient.put<OrganizationDto>(
        `/api/organizations/${id}`,
        payload
    );
    return response.data;
};

export const deleteOrganization = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<void> => {
    await axiosClient.delete(`/api/organizations/${id}`, {
        signal: options?.signal,
    });
};

export const bulkDeleteOrganizations = async (
    ids: string[]
): Promise<{ message: string }> => {
    const response = await axiosClient.post<{ message: string }>(
        "/api/organizations/bulk-delete",
        { ids }
    );
    return response.data;
};

// Keep the old class for backward compatibility
export class OrganizationService {
    createOrganization = (data: any) => createOrganization(data);
    updateOrganization = (data: any) => updateOrganization(data.id, data);
    deleteOrganization = deleteOrganization;
    getOrganizationById = getOrganization;
    getAllOrganizations = getAllOrganizations;
    getOrganizationsPaginated = (page = 1, pageSize = 10) =>
        fetchOrganizations({ page, pageSize });
}

// Export singleton instance for backward compatibility
export const organizationService = new OrganizationService();
