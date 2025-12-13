import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    InvoiceReport,
    CreateInvoiceReportRequest,
} from "../../types/invoice";

/**
 * Invoice Report Service
 * Handles invoice reporting operations
 */

export const createInvoiceReport = async (
    data: CreateInvoiceReportRequest
): Promise<Result<InvoiceReport>> => {
    const response = await apiClient.post<Result<InvoiceReport>>(
        "/InvoiceReports/create",
        data
    );
    return response.data;
};

export const getInvoiceReports = async (
    invoiceId?: number,
    pageNumber: number = 1,
    pageSize: number = 10
): Promise<PaginatedResult<InvoiceReport>> => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (invoiceId) params.invoiceId = invoiceId;

    const response = await apiClient.get<PaginatedResult<InvoiceReport>>(
        "/InvoiceReports",
        { params }
    );
    return response.data;
};

export const getInvoiceReportById = async (
    id: number
): Promise<Result<InvoiceReport>> => {
    const response = await apiClient.get<Result<InvoiceReport>>(
        `/InvoiceReports/get-by-id/${id}`
    );
    return response.data;
};

export const getInvoiceReportsPaginated = async (
    pageNumber: number = 1,
    pageSize: number = 10,
    status?: number,
    keyword?: string,
    reason?: number
): Promise<PaginatedResult<InvoiceReport>> => {
    const params: Record<string, string | number> = { pageNumber, pageSize };
    if (status !== undefined) params.status = status;
    if (keyword) params.keyword = keyword;
    if (reason !== undefined) params.reason = reason;
    const response = await apiClient.get<PaginatedResult<InvoiceReport>>(
        "/InvoiceReports/get-pagination",
        {
            params,
        }
    );
    return response.data;
};
export const updateInvoiceReportStatus = async (
    id: number,
    status: "pending" | "resolved" | "dismissed"
): Promise<Result<InvoiceReport>> => {
    const response = await apiClient.post<Result<InvoiceReport>>(
        `/InvoiceReports/update-status/${id}`,
        { status }
    );
    return response.data;
};

export const updateInvoiceReport = async (
    id: number,
    status: number,
    reason?: number,
    description?: string
): Promise<Result<InvoiceReport>> => {
    const response = await apiClient.post<Result<InvoiceReport>>(
        `/InvoiceReports/update/${id}`,
        {
            status,
            reason,
            description,
        }
    );
    return response.data;
};
