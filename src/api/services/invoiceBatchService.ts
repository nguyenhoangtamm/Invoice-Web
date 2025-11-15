import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    InvoiceBatch,
    CreateInvoiceBatchRequest,
    UpdateInvoiceBatchRequest,
} from "../../types/invoiceBatch";

/**
 * Invoice Batch Management Service
 * Handles all invoice batch-related operations
 */
export class InvoiceBatchService extends BaseApiClient {
    async createInvoiceBatch(
        data: CreateInvoiceBatchRequest
    ): Promise<ApiResponse<InvoiceBatch>> {
        return this.post<InvoiceBatch>("/api/v1/InvoiceBatches/create", data);
    }

    async updateInvoiceBatch(
        data: UpdateInvoiceBatchRequest
    ): Promise<ApiResponse<InvoiceBatch>> {
        return this.post<InvoiceBatch>(
            `/api/v1/InvoiceBatches/update/${data.id}`,
            data
        );
    }

    async deleteInvoiceBatch(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/InvoiceBatches/delete/${id}`);
    }

    async getInvoiceBatchById(id: string): Promise<ApiResponse<InvoiceBatch>> {
        return this.get<InvoiceBatch>(`/api/v1/InvoiceBatches/get-by-id/${id}`);
    }

    async getAllInvoiceBatches(): Promise<ApiResponse<InvoiceBatch[]>> {
        return this.get<InvoiceBatch[]>("/api/v1/InvoiceBatches/get-all");
    }

    async getInvoiceBatchesPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<InvoiceBatch>>> {
        return this.get<PaginatedResponse<InvoiceBatch>>(
            `/api/v1/InvoiceBatches/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }
}

export const invoiceBatchService = new InvoiceBatchService();
