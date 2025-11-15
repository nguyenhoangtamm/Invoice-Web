import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    AdminUserDto,
    RoleInfoDto,
    UsersQueryParams,
    UsersQueryResponse,
    UserPayload,
    UpdateProfilePayload,
    ChangeUserPasswordPayload,
} from "../../types/user";

/**
 * User Management Service
 * Handles all user-related operations
 */
export class UserService extends BaseApiClient {
    async fetchUsers(
        params: UsersQueryParams
    ): Promise<ApiResponse<UsersQueryResponse>> {
        const queryParams = new URLSearchParams();
        queryParams.append("page", params.page.toString());
        queryParams.append("pageSize", params.pageSize.toString());
        if (params.searchTerm)
            queryParams.append("searchTerm", params.searchTerm);
        if (params.status) queryParams.append("status", params.status);
        if (params.organizationId)
            queryParams.append("organizationId", params.organizationId);
        if (params.roleId) queryParams.append("roleId", params.roleId);
        if (typeof params.emailVerified === "boolean")
            queryParams.append(
                "emailVerified",
                params.emailVerified.toString()
            );
        if (params.sortColumn)
            queryParams.append("sortColumn", params.sortColumn);
        if (params.sortDirection)
            queryParams.append("sortDirection", params.sortDirection);

        return this.get<UsersQueryResponse>(
            `users?${queryParams.toString()}`
        );
    }

    async getUser(id: string): Promise<ApiResponse<AdminUserDto>> {
        return this.get<AdminUserDto>(`users/${id}`);
    }

    async getUserProfile(): Promise<ApiResponse<AdminUserDto>> {
        return this.get<AdminUserDto>("users/profile");
    }

    async createUser(payload: UserPayload): Promise<ApiResponse<AdminUserDto>> {
        return this.post<AdminUserDto>("users", payload);
    }

    async updateUser(
        id: string,
        payload: Partial<UserPayload>
    ): Promise<ApiResponse<AdminUserDto>> {
        return this.put<AdminUserDto>(`users/${id}`, payload);
    }

    async updateUserProfile(
        payload: UpdateProfilePayload
    ): Promise<ApiResponse<AdminUserDto>> {
        return this.put<AdminUserDto>("users/profile", payload);
    }

    async deleteUser(id: string): Promise<ApiResponse<void>> {
        return this.delete<void>(`users/${id}`);
    }

    async changeUserPassword(
        payload: ChangeUserPasswordPayload
    ): Promise<ApiResponse<{ message: string }>> {
        return this.post<{ message: string }>(
            "users/change-password",
            payload
        );
    }

    async resetUserPassword(
        userId: string
    ): Promise<ApiResponse<{ message: string; temporaryPassword: string }>> {
        return this.post<{ message: string; temporaryPassword: string }>(
            `users/${userId}/reset-password`
        );
    }

    async toggleUserStatus(
        id: string,
        status: "active" | "inactive" | "suspended"
    ): Promise<ApiResponse<AdminUserDto>> {
        return this.patch<AdminUserDto>(`users/${id}/status`, { status });
    }

    async bulkDeleteUsers(
        ids: string[]
    ): Promise<ApiResponse<{ message: string }>> {
        return this.post<{ message: string }>("users/bulk-delete", {
            ids,
        });
    }

    async getUsersPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<AdminUserDto>>> {
        return this.get<PaginatedResponse<AdminUserDto>>(
            `users/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }
}

export const userService = new UserService();
