// API Key types
export interface ApiKey {
    id: string;
    name: string;
    keyValue: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastUsed?: string;
    expiresAt?: string;
    permissions: string[];
}

export interface CreateApiKeyRequest {
    name: string;
    permissions: string[];
    expiresAt?: string;
}

export interface UpdateApiKeyRequest {
    id: string;
    name: string;
    isActive: boolean;
    permissions: string[];
    expiresAt?: string;
}
