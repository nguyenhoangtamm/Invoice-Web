import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    Role,
    CreateRoleRequest,
    UpdateRoleRequest,
} from "../../types/role";

/**
 * Role Management Service
 * Handles all role-related operations
 */
export class RoleService extends BaseApiClient {
    async createRole(data: CreateRoleRequest): Promise<ApiResponse<Role>> {
        return this.post<Role>("/api/v1/Roles/create", data);
    }

    async updateRole(data: UpdateRoleRequest): Promise<ApiResponse<Role>> {
        return this.post<Role>(`/api/v1/Roles/update/${data.id}`, data);
    }

    async deleteRole(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/Roles/delete/${id}`);
    }

    async getRoleById(id: string): Promise<ApiResponse<Role>> {
        return this.get<Role>(`/api/v1/Roles/get-by-id/${id}`);
    }

    async getAllRoles(): Promise<ApiResponse<Role[]>> {
        return this.get<Role[]>("/api/v1/Roles/get-all");
    }

    async getRolesPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<Role>>> {
        return this.get<PaginatedResponse<Role>>(
            `/api/v1/Roles/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async assignPermissionsToRole(
        roleId: string,
        permissions: string[]
    ): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/Roles/${roleId}/permissions`, {
            permissions,
        });
    }
}

export const roleService = new RoleService();
