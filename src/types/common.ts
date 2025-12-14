// Common API Response Types
export interface Result<T> {
    message: string;
    succeeded: boolean;
    data: T;
    code: number;
}

export interface PaginatedResult<T> {
    message: string;
    succeeded: boolean;
    data: T[];
    code: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

// Pagination request parameters
export interface PaginationRequest {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

// Legacy interfaces (keep for backward compatibility)
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
