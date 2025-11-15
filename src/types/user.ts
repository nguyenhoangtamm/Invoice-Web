// User DTO (extends from auth UserDto but with admin fields)
export type AdminUserDto = {
    id: string;
    username: string;
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    avatar: string | null;
    dateOfBirth: string | null;
    address: string | null;
    roles: RoleInfoDto[];
    organizationId: string | null;
    organizationName: string | null;
    status: "active" | "inactive" | "suspended";
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: string;
    updatedAt: string | null;
    lastLoginAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
};

// Role Info DTO for user
export type RoleInfoDto = {
    id: string;
    name: string;
    code: string;
    permissions: string[];
};

// User Query Parameters
export type UsersQueryParams = {
    page: number;
    pageSize: number;
    searchTerm?: string;
    status?: "active" | "inactive" | "suspended";
    organizationId?: string;
    roleId?: string;
    emailVerified?: boolean;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
};

// User Query Response
export type UsersQueryResponse = {
    items: AdminUserDto[];
    totalCount: number;
    page: number;
    pageSize: number;
};

// User Payload for Create/Update
export type UserPayload = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    address?: string | null;
    organizationId?: string | null;
    roleIds: string[];
    status: "active" | "inactive" | "suspended";
    password?: string; // Required for create, optional for update
};

// Update Profile Payload
export type UpdateProfilePayload = {
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    address?: string | null;
    avatar?: string | null;
};

// Change Password Payload
export type ChangeUserPasswordPayload = {
    userId: string;
    newPassword: string;
    confirmPassword: string;
};

// Extended User types for admin management (legacy)
export interface AdminUser {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
    gender?: string;
    birthDate?: string;
    bio?: string;
    roleId: string;
    roleName?: string;
    organizationId?: string;
    organizationName?: string;
    status: "active" | "inactive" | "suspended";
    isEmailConfirmed: boolean;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    userName: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
    gender?: string;
    birthDate?: string;
    bio?: string;
    roleId: string;
    organizationId?: string;
}

export interface UpdateUserRequest {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
    gender?: string;
    birthDate?: string;
    bio?: string;
    roleId: string;
    organizationId?: string;
    status: string;
}
