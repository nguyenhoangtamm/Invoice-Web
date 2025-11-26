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
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
}

export interface UpdateOrganizationRequest {
    id: number;
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
}

// Legacy interface for backward compatibility
export interface UpdateOrganizationFormData {
    id: number;
    organizationName: string;
    organizationTaxId: string;
    organizationAddress: string;
    organizationPhone: string;
    organizationEmail: string;
    organizationBankAccount: string;
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
