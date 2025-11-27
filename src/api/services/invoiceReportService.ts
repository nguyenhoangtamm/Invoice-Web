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
