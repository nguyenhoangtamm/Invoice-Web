import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse } from "../../types/invoice";

// Dashboard Stats DTO
export type DashboardStatsDto = {
    id: string;
    totalInvoices: number;
    totalRevenue: number;
    totalCustomers: number;
    avgInvoiceValue: number;
    monthlyGrowth: number;
    createdAt: string;
    updatedAt: string | null;
};

// Revenue Chart Data DTO
export type RevenueChartDataDto = {
    date: string;
    revenue: number;
    period: string;
};

// Top Customer DTO
export type TopCustomerDto = {
    id: string;
    name: string;
    totalSpent: number;
    invoiceCount: number;
    lastPurchase: string | null;
};

// Recent Activity DTO
export type RecentActivityDto = {
    id: string;
    type:
        | "invoice_created"
        | "payment_received"
        | "customer_added"
        | "invoice_updated";
    description: string;
    timestamp: string;
    userId: string | null;
    entityId: string | null;
};

// Dashboard Query Parameters
export type DashboardStatsQueryParams = {
    period?: "week" | "month" | "quarter" | "year";
    startDate?: string; // ISO date
    endDate?: string; // ISO date
};

export type RevenueChartQueryParams = {
    period?: "week" | "month" | "quarter" | "year";
    startDate?: string; // ISO date
    endDate?: string; // ISO date
};

export type TopCustomersQueryParams = {
    limit?: number;
    period?: "week" | "month" | "quarter" | "year";
    sortBy?: "totalSpent" | "invoiceCount";
    sortDirection?: "asc" | "desc";
};

export type RecentActivityQueryParams = {
    limit?: number;
    type?:
        | "invoice_created"
        | "payment_received"
        | "customer_added"
        | "invoice_updated";
    startDate?: string; // ISO date
    endDate?: string; // ISO date
};

// Company Info DTO
export type CompanyInfoDto = {
    id: string;
    name: string;
    address: string;
    tax_code: string;
    email: string;
    phone: string;
    logo?: string;
    created_at: string;
    updated_at: string;
};

/**
 * Dashboard Service
 * Handles dashboard-related operations
 */
export class DashboardService extends BaseApiClient {
    async getDashboardStats(
        params: DashboardStatsQueryParams = {}
    ): Promise<ApiResponse<DashboardStatsDto>> {
        const queryParams = new URLSearchParams();
        if (params.period) queryParams.append("period", params.period);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);

        return this.get<DashboardStatsDto>(
            `dashboard/stats${
                queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`
        );
    }

    async getRevenueChart(
        params: RevenueChartQueryParams = {}
    ): Promise<ApiResponse<RevenueChartDataDto[]>> {
        const queryParams = new URLSearchParams();
        if (params.period) queryParams.append("period", params.period);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);

        return this.get<RevenueChartDataDto[]>(
            `dashboard/revenue-chart${
                queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`
        );
    }

    async getTopCustomers(
        params: TopCustomersQueryParams = {}
    ): Promise<ApiResponse<TopCustomerDto[]>> {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.period) queryParams.append("period", params.period);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params.sortDirection)
            queryParams.append("sortDirection", params.sortDirection);

        return this.get<TopCustomerDto[]>(
            `dashboard/top-customers${
                queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`
        );
    }

    async getRecentActivity(
        params: RecentActivityQueryParams = {}
    ): Promise<ApiResponse<RecentActivityDto[]>> {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.type) queryParams.append("type", params.type);
        if (params.startDate) queryParams.append("startDate", params.startDate);
        if (params.endDate) queryParams.append("endDate", params.endDate);

        return this.get<RecentActivityDto[]>(
            `dashboard/recent-activity${
                queryParams.toString() ? `?${queryParams.toString()}` : ""
            }`
        );
    }

    async getCompanyInfo(): Promise<ApiResponse<CompanyInfoDto>> {
        return this.get<CompanyInfoDto>("company/info");
    }
}

// Export singleton instance
export const dashboardService = new DashboardService();
