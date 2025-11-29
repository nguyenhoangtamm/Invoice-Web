import apiClient from "../apiClient";
import type { Result } from "../../types/common";

// Dashboard Stats DTO
export type DashboardStatsDto = {
    id: string;
    totalInvoices: number;
    totalRevenue: number;
    totalCustomers: number;
    avgInvoiceValue: number;
    pendingInvoices: number;
    totalOrganizations: number;
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

const cleanDashboardParams = (params: DashboardStatsQueryParams = {}) => {
    const queryParams: Record<string, string> = {};
    if (params.period) queryParams.period = params.period;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    return queryParams;
};

const cleanRevenueParams = (params: RevenueChartQueryParams = {}) => {
    const queryParams: Record<string, string> = {};
    if (params.period) queryParams.period = params.period;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    return queryParams;
};

const cleanCustomersParams = (params: TopCustomersQueryParams = {}) => {
    const queryParams: Record<string, string | number> = {};
    if (params.limit) queryParams.limit = params.limit;
    if (params.period) queryParams.period = params.period;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortDirection) queryParams.sortDirection = params.sortDirection;
    return queryParams;
};

const cleanActivityParams = (params: RecentActivityQueryParams = {}) => {
    const queryParams: Record<string, string | number> = {};
    if (params.limit) queryParams.limit = params.limit;
    if (params.type) queryParams.type = params.type;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    return queryParams;
};

export const getDashboardStats = async (
    params: DashboardStatsQueryParams = {}
): Promise<Result<DashboardStatsDto>> => {
    const queryParams = cleanDashboardParams(params);
    const response = await apiClient.get<Result<DashboardStatsDto>>(
        "/dashboard/stats",
        {
            params: queryParams,
        }
    );
    return response.data;
};

export const getRevenueChart = async (
    params: RevenueChartQueryParams = {}
): Promise<Result<RevenueChartDataDto[]>> => {
    const queryParams = cleanRevenueParams(params);
    const response = await apiClient.get<Result<RevenueChartDataDto[]>>(
        "/dashboard/revenue-chart",
        {
            params: queryParams,
        }
    );
    return response.data;
};

export const getTopCustomers = async (
    params: TopCustomersQueryParams = {}
): Promise<Result<TopCustomerDto[]>> => {
    const queryParams = cleanCustomersParams(params);
    const response = await apiClient.get<Result<TopCustomerDto[]>>(
        "/dashboard/top-customers",
        {
            params: queryParams,
        }
    );
    return response.data;
};

export const getRecentActivity = async (
    params: RecentActivityQueryParams = {}
): Promise<Result<RecentActivityDto[]>> => {
    const queryParams = cleanActivityParams(params);
    const response = await apiClient.get<Result<RecentActivityDto[]>>(
        "/dashboard/recent-activity",
        {
            params: queryParams,
        }
    );
    return response.data;
};

export const getCompanyInfo = async (): Promise<Result<CompanyInfoDto>> => {
    const response = await apiClient.get<Result<CompanyInfoDto>>(
        "/company/info"
    );
    return response.data;
};
