// Re-export all user-related functionality from userService.ts
export type {
    AdminUserDto,
    RoleInfoDto,
    UsersQueryParams,
    UsersQueryResponse,
    UserPayload,
    UpdateProfilePayload,
    ChangeUserPasswordPayload,
} from "./userService";

export {
    fetchUsers,
    getUser,
    getUserProfile,
    createUser,
    updateUser,
    updateUserProfile,
    deleteUser,
    changeUserPassword,
    resetUserPassword,
    toggleUserStatus,
    bulkDeleteUsers,
    UserApiService,
} from "./userService";

// Keep backward compatibility
export { userApiService as adminUserService } from "./userService";

// Legacy interfaces for backward compatibility
export interface AdminUser extends AdminUserDto {}
export interface CreateUserRequest extends UserPayload {}
export interface UpdateUserRequest extends UserPayload {
    id: string;
}
export interface UserRole extends RoleInfoDto {}

// Legacy class
export class AdminUserService {
    createUser = createUser;
    updateUser = (data: UpdateUserRequest) => updateUser(data.id, data);
    deleteUser = deleteUser;
    getUserById = getUser;
    getAllUsers = () =>
        fetchUsers({ page: 1, pageSize: 1000 }).then((res) => res.items);
    getUsersPaginated = (
        page = 1,
        pageSize = 10,
        search?: string,
        roleId?: string,
        status?: string
    ) =>
        fetchUsers({
            page,
            pageSize,
            searchTerm: search,
            roleId,
            status: status as any,
        });
    getUserRoles = () => getAllRoles();
    changeUserStatus = (id: string, status: string) =>
        toggleUserStatus(id, status as "active" | "inactive" | "suspended");
    resetUserPassword = resetUserPassword;
}

// Import required functions
import {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    fetchUsers,
    resetUserPassword,
    toggleUserStatus,
} from "./userService";
import { getAllRoles } from "./roleService";
import type { AdminUserDto, UserPayload, RoleInfoDto } from "./userService";
