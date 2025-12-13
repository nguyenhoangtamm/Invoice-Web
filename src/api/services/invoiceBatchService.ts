import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    InvoiceBatch,
    CreateInvoiceBatchRequest,
    UpdateInvoiceBatchRequest,
} from "../../types/invoiceBatch";

/**
 * Invoice Batch Management Service
 * Handles all invoice batch-related operations
 */

export const createInvoiceBatch = async (
    data: CreateInvoiceBatchRequest
): Promise<Result<InvoiceBatch>> => {
    const response = await apiClient.post<Result<InvoiceBatch>>(
        "/InvoiceBatches/create",
        data
    );
    return response.data;
};

export const updateInvoiceBatch = async (
    data: UpdateInvoiceBatchRequest
): Promise<Result<InvoiceBatch>> => {
    const response = await apiClient.post<Result<InvoiceBatch>>(
        `/InvoiceBatches/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteInvoiceBatch = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        `/InvoiceBatches/delete/${id}`
    );
    return response.data;
};

export const getInvoiceBatchById = async (
    id: string
): Promise<Result<InvoiceBatch>> => {
    const response = await apiClient.get<Result<InvoiceBatch>>(
        `/InvoiceBatches/get-by-id/${id}`
    );
    return response.data;
};

export const getAllInvoiceBatches = async (): Promise<
    Result<InvoiceBatch[]>
> => {
    const response = await apiClient.get<Result<InvoiceBatch[]>>(
        "/InvoiceBatches/get-all"
    );
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getInvoiceBatchesPaginated = async (
    page: number = 1,
    pageSize: number = 10,
    keyWord?: string
): Promise<PaginatedResult<InvoiceBatch>> => {
    const params: Record<string, string | number> = { page, pageSize };
    if (keyWord) params.keyWord = keyWord;

    const response = await apiClient.get<PaginatedResult<InvoiceBatch>>(
        "/InvoiceBatches/get-pagination",
        {
            params,
        }
    );
    return response.data;
};
