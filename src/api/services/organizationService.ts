import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    Organization,
    CreateOrganizationRequest,
    UpdateOrganizationRequest,
    GetByUserResponse,
} from "../../types/organization";

/**
 * Organization Management Service
 * Handles all organization-related operations
 */

export const createOrganization = async (
    data: CreateOrganizationRequest
): Promise<Result<Organization>> => {
    const response = await apiClient.post<Result<Organization>>(
        "/Organizations/create",
        data
    );
    return response.data;
};

export const updateOrganization = async (
    data: UpdateOrganizationRequest
): Promise<Result<Organization>> => {
    const response = await apiClient.post<Result<Organization>>(
        `/Organizations/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteOrganization = async (id: number): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/Organizations/delete/${id}`
    );
    return response.data;
};

export const getOrganizationById = async (
    id: number
): Promise<Result<Organization>> => {
    const response = await apiClient.get<Result<Organization>>(
        `/Organizations/get-by-id/${id}`
    );
    return response.data;
};

export const getAllOrganizations = async (): Promise<
    Result<Organization[]>
> => {
    const response = await apiClient.get<Result<Organization[]>>(
        "/Organizations/get-all"
    );
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getOrganizationsPaginated = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string
): Promise<PaginatedResult<Organization>> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;

    const response = await apiClient.get<PaginatedResult<Organization>>(
        "/Organizations/get-pagination",
        {
            params,
        }
    );
    return response.data;
};

export const getOrganizationUsers = async (
    organizationId: number
): Promise<Result<any[]>> => {
    const response = await apiClient.get<Result<any[]>>(
        `/Organizations/${organizationId}/users`
    );
    return response.data;
};

export const updateOrganizationStatus = async (
    id: number,
    isActive: boolean
): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/Organizations/${id}/status`,
        {
            isActive,
        }
    );
    return response.data;
};

export const getOrganizationByUserId = async (
    userId: number
): Promise<Result<GetByUserResponse>> => {
    const response = await apiClient.get<Result<GetByUserResponse>>(
        `/Organizations/get-by-user/${userId}`
    );
    return response.data;
};

export const getOrganizationByMe = async (): Promise<
    Result<GetByUserResponse[]>
> => {
    const response = await apiClient.get<Result<GetByUserResponse[]>>(
        "/Organizations/me"
    );
    return response.data;
};
