import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    Organization,
    CreateOrganizationRequest,
    UpdateOrganizationRequest,
} from "../../types/admin";

/**
 * Organization Management Service
 * Handles all organization-related operations
 */
export class OrganizationService extends BaseApiClient {
    async createOrganization(
        data: CreateOrganizationRequest
    ): Promise<ApiResponse<Organization>> {
        return this.post<Organization>("/api/v1/Organizations/create", data);
    }

    async updateOrganization(
        data: UpdateOrganizationRequest
    ): Promise<ApiResponse<Organization>> {
        return this.put<Organization>(
            `/api/v1/Organizations/update/${data.id}`,
            data
        );
    }

    async deleteOrganization(id: string): Promise<ApiResponse<void>> {
        return this.delete<void>(`/api/v1/Organizations/delete/${id}`);
    }

    async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
        return this.get<Organization>(`/api/v1/Organizations/get-by-id/${id}`);
    }

    async getAllOrganizations(): Promise<ApiResponse<Organization[]>> {
        return this.get<Organization[]>("/api/v1/Organizations/get-all");
    }

    async getOrganizationsPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<Organization>>> {
        return this.get<PaginatedResponse<Organization>>(
            `/api/v1/Organizations/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }
}

export const organizationService = new OrganizationService();
