import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    Invoice,
    InvoiceDetail,
    CreateInvoiceRequest,
    UpdateInvoiceRequest,
    InvoiceLookUp,
} from "../../types/invoice";

/**
 * Invoice Management Service
 * Handles all invoice-related operations
 */

const cleanInvoiceParams = (
    pageNumber: number = 1,
    pageSize: number = 10,
    status?: string,
    Keyword?: string
) => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (status) params.status = status;
    if (Keyword) params.Keyword = Keyword;
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
    pageNumber: number = 1,
    pageSize: number = 10,
    status?: string,
    Keyword?: string
): Promise<PaginatedResult<Invoice>> => {
    const params = cleanInvoiceParams(pageNumber, pageSize, status, Keyword);
    const response = await apiClient.get<PaginatedResult<Invoice>>(
        "/Invoices/get-pagination",
        {
            params,
        }
    );
    return response.data;
};
export const getInvoicesPaginatedByUser = async (
    pageNumber: number = 1,
    pageSize: number = 10,
    status?: string,
    Keyword?: string
): Promise<PaginatedResult<Invoice>> => {
    const params = cleanInvoiceParams(pageNumber, pageSize, status, Keyword);
    const response = await apiClient.get<PaginatedResult<Invoice>>(
        "/Invoices/get-by-user",
        {
            params,
        }
    );
    return response.data;
};

export const getInvoicesPaginatedLookUp = async (
    pageNumber: number = 1,
    pageSize: number = 6,
    code?: string
): Promise<PaginatedResult<InvoiceLookUp>> => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (code) params.code = code;
    const response = await apiClient.get<PaginatedResult<InvoiceLookUp>>(
        "/Invoices/lookup",
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
