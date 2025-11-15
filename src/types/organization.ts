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
