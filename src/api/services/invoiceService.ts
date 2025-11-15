import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
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
export class InvoiceService extends BaseApiClient {
    async createInvoice(
        data: CreateInvoiceRequest
    ): Promise<ApiResponse<Invoice>> {
        return this.post<Invoice>("/api/v1/Invoices/create", data);
    }

    async updateInvoice(
        data: UpdateInvoiceRequest
    ): Promise<ApiResponse<Invoice>> {
        return this.post<Invoice>(`/api/v1/Invoices/update/${data.id}`, data);
    }

    async deleteInvoice(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/Invoices/delete/${id}`);
    }

    async getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
        return this.get<Invoice>(`/api/v1/Invoices/get-by-id/${id}`);
    }

    async getAllInvoices(): Promise<ApiResponse<Invoice[]>> {
        return this.get<Invoice[]>("/api/v1/Invoices/get-all");
    }

    async getInvoicesPaginated(
        page: number = 1,
        pageSize: number = 10,
        status?: string,
        search?: string
    ): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (status) params.append("status", status);
        if (search) params.append("search", search);

        return this.get<PaginatedResponse<Invoice>>(
            `/api/v1/Invoices/get-pagination?${params.toString()}`
        );
    }

    async updateInvoiceStatus(
        id: string,
        status: string
    ): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/Invoices/${id}/status`, { status });
    }

    async verifyInvoice(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/Invoices/${id}/verify`);
    }

    async getInvoicesByBatch(batchId: string): Promise<ApiResponse<Invoice[]>> {
        return this.get<Invoice[]>(`/api/v1/Invoices/by-batch/${batchId}`);
    }

    async getInvoicesByOrganization(
        organizationId: string
    ): Promise<ApiResponse<Invoice[]>> {
        return this.get<Invoice[]>(
            `/api/v1/Invoices/by-organization/${organizationId}`
        );
    }
}

export const invoiceService = new InvoiceService();
