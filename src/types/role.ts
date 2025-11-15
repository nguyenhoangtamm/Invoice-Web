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
