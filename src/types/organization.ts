// Organization types
export interface Organization {
    id: number;
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
}

export interface CreateOrganizationRequest {
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
}

// Legacy interface for backward compatibility
export interface CreateOrganizationFormData {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxCode?: string;
    bankAccount?: string;
    isActive: boolean;
}

export interface UpdateOrganizationRequest {
    id: string;
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
}

// Legacy interface for backward compatibility
export interface UpdateOrganizationFormData {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    taxCode?: string;
    bankAccount?: string;
    isActive: boolean;
}

export interface GetByUserResponse {
    id: number;
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
    userId: number;
}
