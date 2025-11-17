import apiClient from "../apiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import type { Company } from "../../types/invoice";
import type { Result, PaginatedResult } from "../../types/common";

/**
 * Company API Service
 * Handles all company-related API calls
 */

export const getCompanyInfo = async (): Promise<Result<Company>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = {
            id: "123",
            name: "Mock Company",
            address: "123 Mock Street",
            tax_code: "0123456789",
            phone: "0123456789",
            email: "mock@company.com",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as Company;

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

    const response = await apiClient.get<Result<Company>>(
        `/${API_CONFIG.ENDPOINTS.COMPANY}`
    );
    return response.data;
};

export const updateCompanyInfo = async (
    companyData: Partial<Company>
): Promise<Result<Company>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = { ...companyData } as Company;

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

    const response = await apiClient.put<Result<Company>>(
        `/${API_CONFIG.ENDPOINTS.COMPANY}`,
        companyData
    );
    return response.data;
};

export const getCompanyStats = async (): Promise<Result<any>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = {
            totalInvoices: 150,
            totalRevenue: 5000000,
            totalCustomers: 45,
            avgInvoiceValue: 33333,
        };

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

    const response = await apiClient.get<Result<any>>(
        `/${API_CONFIG.ENDPOINTS.COMPANY_STATS}`
    );
    return response.data;
};

const cleanCompaniesParams = (page: number = 1, limit: number = 10) => {
    return { page, limit };
};

export const getCompanies = async (
    page: number = 1,
    limit: number = 10
): Promise<
    Result<{
        data: Company[];
        total: number;
        page: number;
        limit: number;
    }>
> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = {
            data: [],
            total: 0,
            page: 1,
            limit: 10,
        };

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

    const params = cleanCompaniesParams(page, limit);
    const response = await apiClient.get<
        Result<{
            data: Company[];
            total: number;
            page: number;
            limit: number;
        }>
    >(`/${API_CONFIG.ENDPOINTS.COMPANY}`, { params });
    return response.data;
};

export const createCompany = async (
    companyData: Partial<Company>
): Promise<Result<Company>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        const mockData = { ...companyData } as Company;

        return {
            message: "Success",
            succeeded: true,
            data: mockData,
            code: 200,
        };
    }

    const response = await apiClient.post<Result<Company>>(
        `/${API_CONFIG.ENDPOINTS.COMPANY}`,
        companyData
    );
    return response.data;
};

export const deleteCompany = async (id: string): Promise<Result<void>> => {
    if (USE_MOCK_API) {
        // Mock implementation - wrap in Result structure
        return {
            message: "Success",
            succeeded: true,
            data: undefined as void,
            code: 200,
        };
    }

    const response = await apiClient.delete<Result<void>>(
        `/${API_CONFIG.ENDPOINTS.COMPANY}/${id}`
    );
    return response.data;
};
