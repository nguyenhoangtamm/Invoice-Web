import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
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
export class OrganizationService extends BaseApiClient {
    async createOrganization(
        data: CreateOrganizationRequest
    ): Promise<ApiResponse<Organization>> {
        return this.post<Organization>("Organizations/create", data);
    }

    async updateOrganization(
        data: UpdateOrganizationRequest
    ): Promise<ApiResponse<Organization>> {
        return this.post<Organization>(`Organizations/update/${data.id}`, data);
    }

    async deleteOrganization(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`Organizations/delete/${id}`);
    }

    async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
        return this.get<Organization>(`Organizations/get-by-id/${id}`);
    }

    async getAllOrganizations(): Promise<
        ApiResponse<PaginatedResponse<Organization>>
    > {
        return this.get<PaginatedResponse<Organization>>(
            "Organizations/get-all"
        );
    }

    async getOrganizationsPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<Organization>>> {
        return this.get<PaginatedResponse<Organization>>(
            `Organizations/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async getOrganizationUsers(
        organizationId: number
    ): Promise<ApiResponse<any[]>> {
        return this.get<any[]>(`Organizations/${organizationId}/users`);
    }

    async updateOrganizationStatus(
        id: number,
        isActive: boolean
    ): Promise<ApiResponse<void>> {
        return this.post<void>(`Organizations/${id}/status`, {
            isActive,
        });
    }
    async getOrganizationByUserId(
        userId: number
    ): Promise<ApiResponse<GetByUserResponse>> {
        return this.get<GetByUserResponse>(`Organizations/get-by-user/${userId}`);
    }
    async getOrganizationByMe(): Promise<ApiResponse<GetByUserResponse>> {
        return this.get<GetByUserResponse>(`Organizations/me`);
    }
}

export const organizationService = new OrganizationService();
