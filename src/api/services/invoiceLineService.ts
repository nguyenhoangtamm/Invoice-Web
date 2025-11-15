import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    InvoiceLine,
    CreateInvoiceLineRequest,
    UpdateInvoiceLineRequest,
} from "../../types/invoiceLine";

/**
 * Invoice Line Management Service
 * Handles all invoice line-related operations
 */
export class InvoiceLineService extends BaseApiClient {
    async createInvoiceLine(
        data: CreateInvoiceLineRequest
    ): Promise<ApiResponse<InvoiceLine>> {
        return this.post<InvoiceLine>("InvoiceLines/create", data);
    }

    async updateInvoiceLine(
        data: UpdateInvoiceLineRequest
    ): Promise<ApiResponse<InvoiceLine>> {
        return this.post<InvoiceLine>(
            `InvoiceLines/update/${data.id}`,
            data
        );
    }

    async deleteInvoiceLine(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`InvoiceLines/delete/${id}`);
    }

    async getInvoiceLineById(id: string): Promise<ApiResponse<InvoiceLine>> {
        return this.get<InvoiceLine>(`InvoiceLines/get-by-id/${id}`);
    }

    async getAllInvoiceLines(): Promise<ApiResponse<InvoiceLine[]>> {
        return this.get<InvoiceLine[]>("InvoiceLines/get-all");
    }

    async getInvoiceLinesPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<InvoiceLine>>> {
        return this.get<PaginatedResponse<InvoiceLine>>(
            `InvoiceLines/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async getInvoiceLinesByInvoiceId(
        invoiceId: string
    ): Promise<ApiResponse<InvoiceLine[]>> {
        return this.get<InvoiceLine[]>(
            `InvoiceLines/by-invoice/${invoiceId}`
        );
    }
}

export const invoiceLineService = new InvoiceLineService();
