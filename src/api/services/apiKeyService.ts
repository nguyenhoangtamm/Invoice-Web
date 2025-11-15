import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    ApiKey,
    CreateApiKeyRequest,
    UpdateApiKeyRequest,
} from "../../types/apiKey";

/**
 * API Key Management Service
 * Handles all API key-related operations
 */
export class ApiKeyService extends BaseApiClient {
    async createApiKey(
        data: CreateApiKeyRequest
    ): Promise<ApiResponse<ApiKey>> {
        return this.post<ApiKey>("/api/v1/ApiKeys/create", data);
    }

    async updateApiKey(
        data: UpdateApiKeyRequest
    ): Promise<ApiResponse<ApiKey>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    ...data,
                    keyValue: `ak_${Math.random()
                        .toString(36)
                        .substring(2, 15)}`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                } as ApiKey,
                message: "Cập nhật API key thành công",
            };
        }

        return this.put<ApiKey>(`/api/v1/ApiKeys/update/${data.id}`, data);
    }

    async deleteApiKey(id: string): Promise<ApiResponse<void>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                message: "Xóa API key thành công",
            };
        }

        return this.delete<void>(`/api/v1/ApiKeys/delete/${id}`);
    }

    async getApiKeyById(id: string): Promise<ApiResponse<ApiKey>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    id,
                    name: "Mock API Key",
                    keyValue: `ak_${Math.random()
                        .toString(36)
                        .substring(2, 15)}`,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    permissions: ["read", "write"],
                } as ApiKey,
                message: "Lấy thông tin API key thành công",
            };
        }

        return this.get<ApiKey>(`/api/v1/ApiKeys/get-by-id/${id}`);
    }

    async getAllApiKeys(): Promise<ApiResponse<ApiKey[]>> {
        if (USE_MOCK_API) {
            // Mock implementation
            const mockKeys: ApiKey[] = [
                {
                    id: "1",
                    name: "Production API Key",
                    keyValue: "ak_prod_123456789",
                    isActive: true,
                    createdAt: "2025-01-01T00:00:00Z",
                    updatedAt: "2025-01-01T00:00:00Z",
                    lastUsed: "2025-11-14T10:00:00Z",
                    permissions: ["read", "write", "delete"],
                },
                {
                    id: "2",
                    name: "Development API Key",
                    keyValue: "ak_dev_987654321",
                    isActive: true,
                    createdAt: "2025-01-02T00:00:00Z",
                    updatedAt: "2025-01-02T00:00:00Z",
                    lastUsed: "2025-11-13T15:30:00Z",
                    permissions: ["read", "write"],
                },
            ];

            return {
                success: true,
                data: mockKeys,
                message: "Lấy danh sách API key thành công",
            };
        }

        return this.get<ApiKey[]>("/api/v1/ApiKeys/get-all");
    }

    async getApiKeysPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<ApiKey>>> {
        if (USE_MOCK_API) {
            // Mock implementation
            const mockKeys: ApiKey[] = [
                {
                    id: "1",
                    name: "Production API Key",
                    keyValue: "ak_prod_***hidden***",
                    isActive: true,
                    createdAt: "2025-01-01T00:00:00Z",
                    updatedAt: "2025-01-01T00:00:00Z",
                    lastUsed: "2025-11-14T10:00:00Z",
                    permissions: ["read", "write", "delete"],
                },
                {
                    id: "2",
                    name: "Development API Key",
                    keyValue: "ak_dev_***hidden***",
                    isActive: true,
                    createdAt: "2025-01-02T00:00:00Z",
                    updatedAt: "2025-01-02T00:00:00Z",
                    lastUsed: "2025-11-13T15:30:00Z",
                    permissions: ["read", "write"],
                },
            ];

            return {
                success: true,
                data: {
                    data: mockKeys.slice(
                        (page - 1) * pageSize,
                        page * pageSize
                    ),
                    total: mockKeys.length,
                    page,
                    limit: pageSize,
                    totalPages: Math.ceil(mockKeys.length / pageSize),
                },
                message: "Lấy danh sách API key thành công",
            };
        }

        return this.get<PaginatedResponse<ApiKey>>(
            `/api/v1/ApiKeys/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }
}

// Export singleton instance
export const apiKeyService = new ApiKeyService();
