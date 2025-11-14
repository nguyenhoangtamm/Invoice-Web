import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

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

// Helper functions to clean parameters
const cleanDashboardParams = (params: DashboardStatsQueryParams = {}) => {
    const payload: Record<string, string> = {};
    if (params.period) payload.period = params.period;
    if (params.startDate) payload.startDate = params.startDate;
    if (params.endDate) payload.endDate = params.endDate;
    return payload;
};

const cleanRevenueChartParams = (params: RevenueChartQueryParams = {}) => {
    const payload: Record<string, string> = {};
    if (params.period) payload.period = params.period;
    if (params.startDate) payload.startDate = params.startDate;
    if (params.endDate) payload.endDate = params.endDate;
    return payload;
};

const cleanTopCustomersParams = (params: TopCustomersQueryParams = {}) => {
    const payload: Record<string, string | number> = {};
    if (typeof params.limit === "number") payload.limit = params.limit;
    if (params.period) payload.period = params.period;
    if (params.sortBy) payload.sortBy = params.sortBy;
    if (params.sortDirection) payload.sortDirection = params.sortDirection;
    return payload;
};

const cleanRecentActivityParams = (params: RecentActivityQueryParams = {}) => {
    const payload: Record<string, string | number> = {};
    if (typeof params.limit === "number") payload.limit = params.limit;
    if (params.type) payload.type = params.type;
    if (params.startDate) payload.startDate = params.startDate;
    if (params.endDate) payload.endDate = params.endDate;
    return payload;
};

// API Functions
export const getDashboardStats = async (
    params: DashboardStatsQueryParams = {},
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<DashboardStatsDto> => {
    const response = await axiosClient.get<DashboardStatsDto>(
        "/api/dashboard/stats",
        {
            params: cleanDashboardParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};

export const getRevenueChart = async (
    params: RevenueChartQueryParams = {},
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<RevenueChartDataDto[]> => {
    const response = await axiosClient.get<RevenueChartDataDto[]>(
        "/api/dashboard/revenue-chart",
        {
            params: cleanRevenueChartParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};

export const getTopCustomers = async (
    params: TopCustomersQueryParams = {},
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<TopCustomerDto[]> => {
    const response = await axiosClient.get<TopCustomerDto[]>(
        "/api/dashboard/top-customers",
        {
            params: cleanTopCustomersParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};

export const getRecentActivity = async (
    params: RecentActivityQueryParams = {},
    options?: Pick<AxiosRequestConfig, "signal">
): Promise<RecentActivityDto[]> => {
    const response = await axiosClient.get<RecentActivityDto[]>(
        "/api/dashboard/recent-activity",
        {
            params: cleanRecentActivityParams(params),
            signal: options?.signal,
        }
    );
    return response.data;
};
