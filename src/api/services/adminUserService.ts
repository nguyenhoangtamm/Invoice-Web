import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";

// User interfaces for admin management
export interface AdminUser {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    gender: string;
    birthDate: string;
    bio: string;
    roleId: string;
    roleName: string;
    status: "Active" | "Inactive" | "Suspended";
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}

export interface CreateUserRequest {
    userName: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    gender: string;
    birthDate: string;
    bio?: string;
    roleId: string;
}

export interface UpdateUserRequest {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    gender: string;
    birthDate: string;
    bio?: string;
    roleId: string;
    status: string;
}

export interface UserRole {
    id: string;
    name: string;
    description: string;
}

/**
 * User Management Service (Admin)
 * Handles all user-related admin operations
 */
export class AdminUserService extends BaseApiClient {
    async createUser(data: CreateUserRequest): Promise<ApiResponse<AdminUser>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    id: `user_${Date.now()}`,
                    ...data,
                    roleName: "User",
                    status: "Active" as const,
                    isEmailVerified: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                } as AdminUser,
                message: "Tạo người dùng thành công",
            };
        }

        return this.post<AdminUser>("/api/v1/Users/create", data);
    }

    async updateUser(data: UpdateUserRequest): Promise<ApiResponse<AdminUser>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    ...data,
                    roleName: "User",
                    isEmailVerified: true,
                    createdAt: "2025-01-01T00:00:00Z",
                    updatedAt: new Date().toISOString(),
                } as AdminUser,
                message: "Cập nhật người dùng thành công",
            };
        }

        return this.put<AdminUser>(`/api/v1/Users/update/${data.id}`, data);
    }

    async deleteUser(id: string): Promise<ApiResponse<void>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                message: "Xóa người dùng thành công",
            };
        }

        return this.delete<void>(`/api/v1/Users/delete/${id}`);
    }

    async getUserById(id: string): Promise<ApiResponse<AdminUser>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    id,
                    userName: "mockuser",
                    email: "mock@example.com",
                    fullName: "Mock User",
                    phoneNumber: "0123456789",
                    address: "123 Mock Street",
                    gender: "Nam",
                    birthDate: "1990-01-01",
                    bio: "Mock user bio",
                    roleId: "1",
                    roleName: "User",
                    status: "Active",
                    isEmailVerified: true,
                    createdAt: "2025-01-01T00:00:00Z",
                    updatedAt: "2025-01-01T00:00:00Z",
                    lastLoginAt: "2025-11-14T10:00:00Z",
                } as AdminUser,
                message: "Lấy thông tin người dùng thành công",
            };
        }

        return this.get<AdminUser>(`/api/v1/Users/get-by-id/${id}`);
    }

    async getAllUsers(): Promise<ApiResponse<AdminUser[]>> {
        if (USE_MOCK_API) {
            // Mock implementation
            const mockUsers: AdminUser[] = [
                {
                    id: "1",
                    userName: "admin",
                    email: "admin@invoice.com",
                    fullName: "Administrator",
                    phoneNumber: "0123456789",
                    address: "123 Admin Street",
                    gender: "Nam",
                    birthDate: "1985-01-01",
                    bio: "System administrator",
                    roleId: "1",
                    roleName: "Admin",
                    status: "Active",
                    isEmailVerified: true,
                    createdAt: "2025-01-01T00:00:00Z",
                    updatedAt: "2025-01-01T00:00:00Z",
                    lastLoginAt: "2025-11-14T10:00:00Z",
                },
                {
                    id: "2",
                    userName: "user1",
                    email: "user1@example.com",
                    fullName: "User One",
                    phoneNumber: "0987654321",
                    address: "456 User Avenue",
                    gender: "Nữ",
                    birthDate: "1992-05-15",
                    bio: "Regular user",
                    roleId: "2",
                    roleName: "User",
                    status: "Active",
                    isEmailVerified: true,
                    createdAt: "2025-01-02T00:00:00Z",
                    updatedAt: "2025-01-02T00:00:00Z",
                    lastLoginAt: "2025-11-13T15:30:00Z",
                },
            ];

            return {
                success: true,
                data: mockUsers,
                message: "Lấy danh sách người dùng thành công",
            };
        }

        return this.get<AdminUser[]>("/api/v1/Users/get-all");
    }

    async getUsersPaginated(
        page: number = 1,
        pageSize: number = 10,
        search?: string,
        roleId?: string,
        status?: string
    ): Promise<ApiResponse<PaginatedResponse<AdminUser>>> {
        if (USE_MOCK_API) {
            // Mock implementation
            const mockUsers: AdminUser[] = [
                {
                    id: "1",
                    userName: "admin",
                    email: "admin@invoice.com",
                    fullName: "Administrator",
                    phoneNumber: "0123456789",
                    address: "123 Admin Street",
                    gender: "Nam",
                    birthDate: "1985-01-01",
                    bio: "System administrator",
                    roleId: "1",
                    roleName: "Admin",
                    status: "Active",
                    isEmailVerified: true,
                    createdAt: "2025-01-01T00:00:00Z",
                    updatedAt: "2025-01-01T00:00:00Z",
                    lastLoginAt: "2025-11-14T10:00:00Z",
                },
                {
                    id: "2",
                    userName: "user1",
                    email: "user1@example.com",
                    fullName: "User One",
                    phoneNumber: "0987654321",
                    address: "456 User Avenue",
                    gender: "Nữ",
                    birthDate: "1992-05-15",
                    bio: "Regular user",
                    roleId: "2",
                    roleName: "User",
                    status: "Active",
                    isEmailVerified: true,
                    createdAt: "2025-01-02T00:00:00Z",
                    updatedAt: "2025-01-02T00:00:00Z",
                    lastLoginAt: "2025-11-13T15:30:00Z",
                },
            ];

            let filteredUsers = mockUsers;

            // Apply filters
            if (search) {
                filteredUsers = filteredUsers.filter(
                    (user) =>
                        user.fullName
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        user.email
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        user.userName
                            .toLowerCase()
                            .includes(search.toLowerCase())
                );
            }

            if (roleId) {
                filteredUsers = filteredUsers.filter(
                    (user) => user.roleId === roleId
                );
            }

            if (status) {
                filteredUsers = filteredUsers.filter(
                    (user) => user.status === status
                );
            }

            return {
                success: true,
                data: {
                    data: filteredUsers.slice(
                        (page - 1) * pageSize,
                        page * pageSize
                    ),
                    total: filteredUsers.length,
                    page,
                    limit: pageSize,
                    totalPages: Math.ceil(filteredUsers.length / pageSize),
                },
                message: "Lấy danh sách người dùng thành công",
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (search) params.append("search", search);
        if (roleId) params.append("roleId", roleId);
        if (status) params.append("status", status);

        return this.get<PaginatedResponse<AdminUser>>(
            `/api/v1/Users/get-pagination?${params.toString()}`
        );
    }

    async getUserRoles(): Promise<ApiResponse<UserRole[]>> {
        if (USE_MOCK_API) {
            // Mock implementation
            const mockRoles: UserRole[] = [
                {
                    id: "1",
                    name: "Admin",
                    description: "Quản trị viên hệ thống",
                },
                {
                    id: "2",
                    name: "User",
                    description: "Người dùng thông thường",
                },
                {
                    id: "3",
                    name: "Manager",
                    description: "Quản lý",
                },
            ];

            return {
                success: true,
                data: mockRoles,
                message: "Lấy danh sách vai trò thành công",
            };
        }

        return this.get<UserRole[]>("/api/v1/Roles/get-all");
    }

    async changeUserStatus(
        id: string,
        status: string
    ): Promise<ApiResponse<void>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                message: "Thay đổi trạng thái người dùng thành công",
            };
        }

        return this.put<void>(`/api/v1/Users/change-status/${id}`, { status });
    }

    async resetUserPassword(
        id: string,
        newPassword: string
    ): Promise<ApiResponse<void>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                message: "Đặt lại mật khẩu thành công",
            };
        }

        return this.put<void>(`/api/v1/Users/reset-password/${id}`, {
            newPassword,
        });
    }
}

// Export singleton instance
export const adminUserService = new AdminUserService();
