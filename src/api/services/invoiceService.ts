import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    Invoice,
    InvoiceDetail,
    CreateInvoiceRequest,
    UpdateInvoiceRequest,
} from "../../types/invoice";

/**
 * Invoice Management Service
 * Handles all invoice-related operations
 */

const cleanInvoiceParams = (
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    search?: string
) => {
    const params: Record<string, string | number> = { page, pageSize };
    if (status) params.status = status;
    if (search) params.search = search;
    return params;
};

export const createInvoice = async (
    data: CreateInvoiceRequest
): Promise<Result<Invoice>> => {
    const response = await apiClient.post<Result<Invoice>>(
        "/Invoices/create",
        data
    );
    return response.data;
};

export const updateInvoice = async (
    data: UpdateInvoiceRequest
): Promise<Result<Invoice>> => {
    const response = await apiClient.post<Result<Invoice>>(
        `/Invoices/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteInvoice = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/Invoices/delete/${id}`
    );
    return response.data;
};

export const getInvoiceById = async (id: string): Promise<Result<Invoice>> => {
    const response = await apiClient.get<Result<Invoice>>(
        `/Invoices/get-by-id/${id}`
    );
    return response.data;
};

export const getAllInvoices = async (): Promise<Result<Invoice[]>> => {
    const response = await apiClient.get<Result<Invoice[]>>(
        "/Invoices/get-all"
    );
    return response.data;
};

export const getInvoicesPaginated = async (
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    search?: string
): Promise<PaginatedResult<Invoice>> => {
    const params = cleanInvoiceParams(page, pageSize, status, search);
    const response = await apiClient.get<PaginatedResult<Invoice>>(
        "/Invoices/get-pagination",
        {
            params,
        }
    );
    return response.data;
};

export const updateInvoiceStatus = async (
    id: string,
    status: string
): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/Invoices/${id}/status`,
        { status }
    );
    return response.data;
};

export const verifyInvoice = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/Invoices/${id}/verify`
    );
    return response.data;
};

export const getInvoicesByBatch = async (
    batchId: string
): Promise<Result<Invoice[]>> => {
    const response = await apiClient.get<Result<Invoice[]>>(
        `/Invoices/by-batch/${batchId}`
    );
    return response.data;
};

export const getInvoicesByOrganization = async (
    organizationId: string
): Promise<Result<Invoice[]>> => {
    const response = await apiClient.get<Result<Invoice[]>>(
        `/Invoices/by-organization/${organizationId}`
    );
    return response.data;
};

export const getInvoiceByLookup = async (
    lookup: string
): Promise<Result<Invoice>> => {
    const response = await apiClient.get<Result<Invoice>>(
        `/Invoices/lookup/${lookup}`
    );
    return response.data;
};
