// Extended User types for admin management
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
