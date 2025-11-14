import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";

// Invoice Line interfaces
export interface InvoiceLine {
    id: string;
    invoiceId: string;
    lineNumber: number;
    description: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    taxAmount?: number;
    lineTotal: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInvoiceLineRequest {
    invoiceId: string;
    lineNumber: number;
    description: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    taxAmount?: number;
}

export interface UpdateInvoiceLineRequest {
    id: string;
    invoiceId: string;
    lineNumber: number;
    description: string;
    unit?: string;
    quantity: number;
    unitPrice: number;
    taxAmount?: number;
}

/**
 * Invoice Line Management Service
 * Handles all invoice line-related operations
 */
export class InvoiceLineService extends BaseApiClient {
    async createInvoiceLine(
        data: CreateInvoiceLineRequest
    ): Promise<ApiResponse<InvoiceLine>> {
        return this.post<InvoiceLine>("/api/v1/InvoiceLines/create", data);
    }

    async updateInvoiceLine(
        data: UpdateInvoiceLineRequest
    ): Promise<ApiResponse<InvoiceLine>> {
        return this.put<InvoiceLine>(`/api/v1/InvoiceLines/update/${data.id}`, data);
    }

    async deleteInvoiceLine(id: string): Promise<ApiResponse<void>> {
        return this.delete<void>(`/api/v1/InvoiceLines/delete/${id}`);
    }

    async getInvoiceLineById(id: string): Promise<ApiResponse<InvoiceLine>> {
        return this.get<InvoiceLine>(`/api/v1/InvoiceLines/get-by-id/${id}`);
    }

    async getAllInvoiceLines(): Promise<ApiResponse<InvoiceLine[]>> {
        return this.get<InvoiceLine[]>("/api/v1/InvoiceLines/get-all");
    }

    async getInvoiceLinesPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<InvoiceLine>>> {
        return this.get<PaginatedResponse<InvoiceLine>>(
            `/api/v1/InvoiceLines/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async getInvoiceLinesByInvoiceId(
        invoiceId: string
    ): Promise<ApiResponse<InvoiceLine[]>> {
        return this.get<InvoiceLine[]>(`/api/v1/InvoiceLines/by-invoice/${invoiceId}`);
    }
}

export const invoiceLineService = new InvoiceLineService();