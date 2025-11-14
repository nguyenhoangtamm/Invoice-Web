import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

// Invoice DTO
export type InvoiceDto = {
    id: string;
    invoiceCode: string;
    customerName: string;
    customerTaxId: string | null;
    customerAddress: string | null;
    customerPhone: string | null;
    customerEmail: string | null;
    issueDate: string;
    dueDate: string | null;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    status: "draft" | "sent" | "paid" | "cancelled";
    notes: string | null;
    createdAt: string;
    updatedAt: string | null;
    createdBy: string | null;
    updatedBy: string | null;
};

// Invoice Line Item DTO
export type InvoiceLineDto = {
    id: string;
    invoiceId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    lineTotal: number;
    sortOrder: number;
};

// Invoice Query Parameters
export type InvoicesQueryParams = {
    page: number;
    pageSize: number;
    searchTerm?: string;
    status?: "draft" | "sent" | "paid" | "cancelled";
    issueDate?: string; // ISO date
    dueDateFrom?: string; // ISO date
    dueDateTo?: string; // ISO date
    customerName?: string;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
};

// Invoice Query Response
export type InvoicesQueryResponse = {
    items: InvoiceDto[];
    totalCount: number;
    page: number;
    pageSize: number;
};

// Invoice Search Parameters
export type InvoiceSearchParams = {
    query?: string;
    status?: "draft" | "sent" | "paid" | "cancelled";
    issueDate?: string; // ISO date
    dueDateFrom?: string; // ISO date
    dueDateTo?: string; // ISO date
    page?: number;
    pageSize?: number;
};

// Invoice Payload for Create/Update
export type InvoicePayload = {
    customerName: string;
    customerTaxId?: string | null;
    customerAddress?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
    issueDate: string; // ISO date
    dueDate?: string | null; // ISO date
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    status: "draft" | "sent" | "paid" | "cancelled";
    notes?: string | null;
    lines: {
        description: string;
        quantity: number;
        unitPrice: number;
        taxRate: number;
        sortOrder: number;
    }[];
};

// Helper functions to clean parameters
const cleanInvoicesParams = (params: InvoicesQueryParams) => {
    const payload: Record<string, string | number> = {
        page: params.page,
        pageSize: params.pageSize,
    };
    if (params.searchTerm) payload.searchTerm = params.searchTerm;
    if (params.status) payload.status = params.status;
    if (params.issueDate) payload.issueDate = params.issueDate;
    if (params.dueDateFrom) payload.dueDateFrom = params.dueDateFrom;
    if (params.dueDateTo) payload.dueDateTo = params.dueDateTo;
    if (params.customerName) payload.customerName = params.customerName;
    if (params.sortColumn) payload.sortColumn = params.sortColumn;
    if (params.sortDirection) payload.sortDirection = params.sortDirection;
    return payload;
};

const cleanSearchParams = (params: InvoiceSearchParams) => {
    const payload: Record<string, string | number> = {};
    if (params.query) payload.query = params.query;
    if (params.status) payload.status = params.status;
    if (params.issueDate) payload.issueDate = params.issueDate;
    if (params.dueDateFrom) payload.dueDateFrom = params.dueDateFrom;
    if (params.dueDateTo) payload.dueDateTo = params.dueDateTo;
    if (typeof params.page === "number") payload.page = params.page;
    if (typeof params.pageSize === "number") payload.pageSize = params.pageSize;
    return payload;
};

// API Functions
export const fetchInvoices = async (
    params: InvoicesQueryParams,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<InvoicesQueryResponse> => {
    const response = await axiosClient.get<InvoicesQueryResponse>(
        "/api/invoices",
        {
            params: cleanInvoicesParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};

export const getInvoice = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<InvoiceDto> => {
    const response = await axiosClient.get<InvoiceDto>(`/api/invoices/${id}`, {
        signal: options?.signal,
    });
    return response.data;
};

export const searchInvoiceByCode = async (
    code: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<InvoiceDto | null> => {
    const response = await axiosClient.get<InvoiceDto | null>(
        `/api/invoices/by-code/${encodeURIComponent(code)}`,
        {
            signal: options?.signal,
        }
    );
    return response.data;
};

export const searchInvoicesByContact = async (
    query: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<InvoiceDto[]> => {
    const response = await axiosClient.get<InvoiceDto[]>(
        `/api/invoices/by-contact`,
        {
            params: { q: query },
            signal: options?.signal,
        }
    );
    return response.data;
};

export const createInvoice = async (
    payload: InvoicePayload
): Promise<InvoiceDto> => {
    const response = await axiosClient.post<InvoiceDto>(
        "/api/invoices",
        payload
    );
    return response.data;
};

export const updateInvoice = async (
    id: string,
    payload: InvoicePayload
): Promise<InvoiceDto> => {
    const response = await axiosClient.put<InvoiceDto>(
        `/api/invoices/${id}`,
        payload
    );
    return response.data;
};

export const deleteInvoice = async (
    id: string,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<void> => {
    await axiosClient.delete(`/api/invoices/${id}`, {
        signal: options?.signal,
    });
};

export const searchInvoices = async (
    params: InvoiceSearchParams,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<InvoicesQueryResponse> => {
    const response = await axiosClient.get<InvoicesQueryResponse>(
        "/api/invoices/search",
        {
            params: cleanSearchParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};

export const uploadXmlFile = async (file: File): Promise<InvoiceDto> => {
    const formData = new FormData();
    formData.append("xml_file", file);

    const response = await axiosClient.post<InvoiceDto>(
        "/api/invoices/upload-xml",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const exportInvoices = async (
    format: "excel" | "pdf" | "csv" = "excel",
    params?: InvoicesQueryParams,
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<Blob> => {
    const queryParams = params ? cleanInvoicesParams(params) : {};
    queryParams.format = format;

    const response = await axiosClient.get("/api/invoices/export", {
        params: queryParams,
        responseType: "blob",
        signal: options?.signal,
    });
    return response.data;
};

// Keep the old class for backward compatibility
export class InvoiceApiService {
    searchInvoiceByCode = searchInvoiceByCode;
    searchInvoiceByContact = searchInvoicesByContact;
    uploadXmlFile = uploadXmlFile;
    getInvoices = (page = 1, limit = 10, status?: string) =>
        fetchInvoices({ page, pageSize: limit, status: status as any });
    getInvoiceById = getInvoice;
    createInvoice = createInvoice;
    updateInvoice = updateInvoice;
    deleteInvoice = deleteInvoice;
    exportInvoices = exportInvoices;
    searchInvoices = (searchParams: any) => searchInvoices(searchParams);

    // Mock methods for token management (if needed)
    setAuthToken = (token: string) => {};
    clearAuthToken = () => {};
}

// Export singleton instance for backward compatibility
export const invoiceApiService = new InvoiceApiService();
