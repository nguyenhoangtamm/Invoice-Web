import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    InvoiceLine,
    CreateInvoiceLineRequest,
    UpdateInvoiceLineRequest,
} from "../../types/invoiceLine";

/**
 * Invoice Line Management Service
 * Handles all invoice line-related operations
 */

export const createInvoiceLine = async (
    data: CreateInvoiceLineRequest
): Promise<Result<InvoiceLine>> => {
    const response = await apiClient.post<Result<InvoiceLine>>(
        "/InvoiceLines/create",
        data
    );
    return response.data;
};

export const updateInvoiceLine = async (
    data: UpdateInvoiceLineRequest
): Promise<Result<InvoiceLine>> => {
    const response = await apiClient.post<Result<InvoiceLine>>(
        `/InvoiceLines/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteInvoiceLine = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/InvoiceLines/delete/${id}`
    );
    return response.data;
};

export const getInvoiceLineById = async (
    id: string
): Promise<Result<InvoiceLine>> => {
    const response = await apiClient.get<Result<InvoiceLine>>(
        `/InvoiceLines/get-by-id/${id}`
    );
    return response.data;
};

export const getAllInvoiceLines = async (): Promise<Result<InvoiceLine[]>> => {
    const response = await apiClient.get<Result<InvoiceLine[]>>(
        "/InvoiceLines/get-all"
    );
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getInvoiceLinesPaginated = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string
): Promise<PaginatedResult<InvoiceLine>> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (searchTerm) params.searchTerm = searchTerm;

    const response = await apiClient.get<PaginatedResult<InvoiceLine>>(
        "/InvoiceLines/get-pagination",
        {
            params,
        }
    );
    return response.data;
};

export const getInvoiceLinesByInvoiceId = async (
    invoiceId: string
): Promise<Result<InvoiceLine[]>> => {
    const response = await apiClient.get<Result<InvoiceLine[]>>(
        `/InvoiceLines/by-invoice/${invoiceId}`
    );
    return response.data;
};
