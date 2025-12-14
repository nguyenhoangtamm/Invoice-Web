// API Key types
export interface ApiKey {
    id: string;
    key?: string; // Only available when creating, not in list
    apiKey?: string; // The actual API key returned when creating
    name: string;
    active: boolean;
    organizationId: number;
    expirationDays: number;
    expiresAt?: string; // When the API key expires
    createdAt?: string;
    createdDate?: string; // Alternative field name from API
    updatedAt?: string;
}

export interface CreateApiKeyRequest {
    name: string;
    active: boolean;
    organizationId: number;
    expirationDays: number;
}

export interface UpdateApiKeyRequest {
    id: string;
    name: string;
    active: boolean;
    organizationId: number;
    expirationDays: number;
}
