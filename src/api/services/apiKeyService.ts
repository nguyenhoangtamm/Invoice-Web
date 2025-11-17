import apiClient from "../apiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
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
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = {
            ...data,
            keyValue: `ak_${Math.random().toString(36).substring(2, 15)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as ApiKey;

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

    const response = await apiClient.put<Result<ApiKey>>(
        `/ApiKeys/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteApiKey = async (id: string): Promise<Result<void>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        return {
            message: "Success",
            succeeded: true,
            data: undefined as void,
            code: 200,
        };
    }

    const response = await apiClient.delete<Result<void>>(
        `/ApiKeys/delete/${id}`
    );
    return response.data;
};

export const getApiKeyById = async (id: string): Promise<Result<ApiKey>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = {
            id,
            name: "Mock API Key",
            keyValue: `ak_${Math.random().toString(36).substring(2, 15)}`,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            permissions: ["read", "write"],
        } as ApiKey;

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

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
    pageSize: number = 10
): Promise<PaginatedResult<ApiKey>> => {
    const params = cleanPaginationParams(page, pageSize);
    const response = await apiClient.get<PaginatedResult<ApiKey>>(
        "/ApiKeys/get-pagination",
        {
            params,
        }
    );
    return response.data;
};
