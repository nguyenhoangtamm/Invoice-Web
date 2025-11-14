import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import * as mockApi from "../mockApi";
import type {
    Invoice,
    PaginatedResponse,
    ApiResponse,
} from "../../types/invoice";

/**
 * Invoice API Service
 * Handles all invoice-related API calls
 */
export class InvoiceApiService extends BaseApiClient {
    async searchInvoiceByCode(
        code: string
    ): Promise<ApiResponse<Invoice | null>> {
        if (USE_MOCK_API) {
            return mockApi.searchByCodeApi(code);
        }

        return this.get<Invoice | null>(
            `${API_CONFIG.ENDPOINTS.INVOICE_BY_CODE}/${encodeURIComponent(
                code
            )}`
        );
    }

    async searchInvoiceByContact(
        query: string
    ): Promise<ApiResponse<Invoice[]>> {
        if (USE_MOCK_API) {
            return mockApi.searchByContactApi(query);
        }

        return this.get<Invoice[]>(
            `${API_CONFIG.ENDPOINTS.INVOICE_BY_CONTACT}?q=${encodeURIComponent(
                query
            )}`
        );
    }

    async uploadXmlFile(file: File): Promise<ApiResponse<Invoice>> {
        if (USE_MOCK_API) {
            return mockApi.uploadXmlFileApi(file);
        }

        return this.uploadFile<Invoice>(
            API_CONFIG.ENDPOINTS.INVOICE_UPLOAD_XML,
            file,
            "xml_file"
        );
    }

    async getInvoices(
        page = 1,
        limit = 10,
        status?: string
    ): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
        if (USE_MOCK_API) {
            return mockApi.getInvoicesApi(page, limit, status);
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (status && status !== "all") {
            params.append("status", status);
        }

        return this.get<PaginatedResponse<Invoice>>(
            `${API_CONFIG.ENDPOINTS.INVOICES}?${params.toString()}`
        );
    }

    async getInvoiceById(id: string): Promise<ApiResponse<Invoice>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {} as Invoice, // Mock data
                message: "Lấy hóa đơn thành công",
            };
        }

        return this.get<Invoice>(`${API_CONFIG.ENDPOINTS.INVOICES}/${id}`);
    }

    async createInvoice(
        invoiceData: Partial<Invoice>
    ): Promise<ApiResponse<Invoice>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: { ...invoiceData } as Invoice,
                message: "Tạo hóa đơn thành công",
            };
        }

        return this.post<Invoice>(API_CONFIG.ENDPOINTS.INVOICES, invoiceData);
    }

    async updateInvoice(
        id: string,
        invoiceData: Partial<Invoice>
    ): Promise<ApiResponse<Invoice>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: { ...invoiceData } as Invoice,
                message: "Cập nhật hóa đơn thành công",
            };
        }

        return this.put<Invoice>(
            `${API_CONFIG.ENDPOINTS.INVOICES}/${id}`,
            invoiceData
        );
    }

    async deleteInvoice(id: string): Promise<ApiResponse<void>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                message: "Xóa hóa đơn thành công",
            };
        }

        return this.delete<void>(`${API_CONFIG.ENDPOINTS.INVOICES}/${id}`);
    }

    async exportInvoices(format: string = "excel"): Promise<ApiResponse<Blob>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: new Blob([], { type: "application/vnd.ms-excel" }),
                message: "Export thành công",
            };
        }

        return this.get<Blob>(
            `${API_CONFIG.ENDPOINTS.INVOICE_EXPORT}?format=${format}`
        );
    }

    async searchInvoices(searchParams: {
        query?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
        if (USE_MOCK_API) {
            return mockApi.getInvoicesApi(
                searchParams.page || 1,
                searchParams.limit || 10,
                searchParams.status
            );
        }

        const params = new URLSearchParams();

        if (searchParams.query) params.append("q", searchParams.query);
        if (searchParams.status && searchParams.status !== "all")
            params.append("status", searchParams.status);
        if (searchParams.dateFrom)
            params.append("dateFrom", searchParams.dateFrom);
        if (searchParams.dateTo) params.append("dateTo", searchParams.dateTo);
        if (searchParams.page)
            params.append("page", searchParams.page.toString());
        if (searchParams.limit)
            params.append("limit", searchParams.limit.toString());

        return this.get<PaginatedResponse<Invoice>>(
            `${API_CONFIG.ENDPOINTS.INVOICE_SEARCH}?${params.toString()}`
        );
    }
}

// Export singleton instance
export const invoiceApiService = new InvoiceApiService();
