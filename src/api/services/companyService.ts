import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import type { Company, ApiResponse } from "../../types/invoice";

/**
 * Company API Service
 * Handles all company-related API calls
 */
export class CompanyApiService extends BaseApiClient {
    async getCompanyInfo(): Promise<ApiResponse<Company>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    id: "123",
                    name: "Mock Company",
                    address: "123 Mock Street",
                    tax_code: "0123456789",
                    phone: "0123456789",
                    email: "mock@company.com",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                } as Company,
                message: "Lấy thông tin công ty thành công",
            };
        }

        return this.get<Company>(API_CONFIG.ENDPOINTS.COMPANY);
    }

    async updateCompanyInfo(
        companyData: Partial<Company>
    ): Promise<ApiResponse<Company>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: { ...companyData } as Company,
                message: "Cập nhật thông tin công ty thành công",
            };
        }

        return this.put<Company>(API_CONFIG.ENDPOINTS.COMPANY, companyData);
    }

    async getCompanyStats(): Promise<ApiResponse<any>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    totalInvoices: 150,
                    totalRevenue: 5000000,
                    totalCustomers: 45,
                    avgInvoiceValue: 33333,
                },
                message: "Lấy thống kê công ty thành công",
            };
        }

        return this.get<any>(API_CONFIG.ENDPOINTS.COMPANY_STATS);
    }

    async getCompanies(
        page = 1,
        limit = 10
    ): Promise<
        ApiResponse<{
            data: Company[];
            total: number;
            page: number;
            limit: number;
        }>
    > {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    data: [],
                    total: 0,
                    page: 1,
                    limit: 10,
                },
                message: "Lấy danh sách công ty thành công",
            };
        }

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        return this.get<{
            data: Company[];
            total: number;
            page: number;
            limit: number;
        }>(`${API_CONFIG.ENDPOINTS.COMPANY}?${params.toString()}`);
    }

    async createCompany(
        companyData: Partial<Company>
    ): Promise<ApiResponse<Company>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: { ...companyData } as Company,
                message: "Tạo công ty thành công",
            };
        }

        return this.post<Company>(API_CONFIG.ENDPOINTS.COMPANY, companyData);
    }

    async deleteCompany(id: string): Promise<ApiResponse<void>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                message: "Xóa công ty thành công",
            };
        }

        return this.delete<void>(`${API_CONFIG.ENDPOINTS.COMPANY}/${id}`);
    }
}

// Export singleton instance
export const companyApiService = new CompanyApiService();
