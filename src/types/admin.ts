// Admin entity types based on API endpoints

// API Key types
export interface ApiKey {
    id: string;
    name: string;
    key: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
}

export interface CreateApiKeyRequest {
    name: string;
    expiresAt?: string;
}

export interface UpdateApiKeyRequest {
    id: string;
    name: string;
    isActive: boolean;
    expiresAt?: string;
}

// Invoice Batch types
export interface InvoiceBatch {
    id: string;
    batchName: string;
    description?: string;
    status: "draft" | "processing" | "completed" | "failed";
    totalInvoices: number;
    processedInvoices: number;
    createdAt: string;
    updatedAt: string;
    createdByUserId: string;
}

export interface CreateInvoiceBatchRequest {
    batchName: string;
    description?: string;
}

export interface UpdateInvoiceBatchRequest {
    id: string;
    batchName: string;
    description?: string;
    status: string;
}

// Menu types
export interface Menu {
    id: string;
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    children?: Menu[];
}

export interface CreateMenuRequest {
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
}

export interface UpdateMenuRequest {
    id: string;
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
}

export interface AssignMenuToRoleRequest {
    roleId: string;
    menuIds: string[];
}

// Organization types
export interface Organization {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxCode?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrganizationRequest {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxCode?: string;
    isActive: boolean;
}

export interface UpdateOrganizationRequest {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxCode?: string;
    isActive: boolean;
}

// Role types
export interface Role {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    permissions?: string[];
}

export interface CreateRoleRequest {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface UpdateRoleRequest {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

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

// Pagination and common types
export interface PaginationRequest {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginationResponse<T> {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface ApiResult<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}
