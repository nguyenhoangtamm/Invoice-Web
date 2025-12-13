import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    ApiKey,
    CreateApiKeyRequest,
    UpdateApiKeyRequest,
} from "../../types/apiKey";

/**
 * API Key Management Service
 * Handles all API key-related operations
 */

export const createApiKey = async (
    data: CreateApiKeyRequest
): Promise<Result<ApiKey>> => {
    const response = await apiClient.post<Result<ApiKey>>(
        "/ApiKeys/create",
        data
    );
    return response.data;
};

export const updateApiKey = async (
    data: UpdateApiKeyRequest
): Promise<Result<ApiKey>> => {
    const response = await apiClient.post<Result<ApiKey>>(
        `/ApiKeys/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteApiKey = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/ApiKeys/delete/${id}`
    );
    return response.data;
};

export const getApiKeyById = async (id: string): Promise<Result<ApiKey>> => {
    const response = await apiClient.get<Result<ApiKey>>(
        `/ApiKeys/get-by-id/${id}`
    );
    return response.data;
};

export const getAllApiKeys = async (): Promise<Result<ApiKey[]>> => {
    const response = await apiClient.get<Result<ApiKey[]>>("/ApiKeys/get-all");
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getApiKeysPaginated = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    isActive?: boolean
): Promise<PaginatedResult<ApiKey>> => {
    const params: Record<string, string | number | boolean> = {
        page,
        pageSize,
    };
    if (searchTerm) params.searchTerm = searchTerm;
    if (isActive !== undefined) params.isActive = isActive;

    const response = await apiClient.get<PaginatedResult<ApiKey>>(
        "/ApiKeys/get-pagination",
        {
            params,
        }
    );
    return response.data;
};
