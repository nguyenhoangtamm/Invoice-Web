import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import type { DashboardStats, ApiResponse } from "../../types/invoice";

/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */
export class DashboardApiService extends BaseApiClient {
    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    totalInvoices: 1250,
                    totalRevenue: 15750000,
                    totalCustomers: 89,
                    avgInvoiceValue: 12600,
                    monthlyGrowth: 15.5,
                    recentInvoices: [],
                    topCustomers: [],
                    revenueChart: [],
                } as DashboardStats,
                message: "Lấy thống kê dashboard thành công",
            };
        }

        return this.get<DashboardStats>(API_CONFIG.ENDPOINTS.DASHBOARD_STATS);
    }

    async getDashboardStatsWithPeriod(
        period: "week" | "month" | "quarter" | "year" = "month"
    ): Promise<ApiResponse<DashboardStats>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: {
                    totalInvoices: 1250,
                    totalRevenue: 15750000,
                    totalCustomers: 89,
                    avgInvoiceValue: 12600,
                    monthlyGrowth: 15.5,
                    recentInvoices: [],
                    topCustomers: [],
                    revenueChart: [],
                } as DashboardStats,
                message: "Lấy thống kê dashboard thành công",
            };
        }

        return this.get<DashboardStats>(
            `${API_CONFIG.ENDPOINTS.DASHBOARD_STATS}?period=${period}`
        );
    }

    async getRevenueChart(
        period: "week" | "month" | "quarter" | "year" = "month"
    ): Promise<ApiResponse<any[]>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: [
                    { date: "2025-01", revenue: 1200000 },
                    { date: "2025-02", revenue: 1350000 },
                    { date: "2025-03", revenue: 1100000 },
                    { date: "2025-04", revenue: 1450000 },
                ],
                message: "Lấy biểu đồ doanh thu thành công",
            };
        }

        return this.get<any[]>(
            `${API_CONFIG.ENDPOINTS.DASHBOARD_STATS}/revenue-chart?period=${period}`
        );
    }

    async getTopCustomers(limit: number = 10): Promise<ApiResponse<any[]>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: [
                    {
                        name: "Công ty ABC",
                        totalSpent: 2500000,
                        invoiceCount: 15,
                    },
                    {
                        name: "Công ty XYZ",
                        totalSpent: 1800000,
                        invoiceCount: 12,
                    },
                ],
                message: "Lấy khách hàng top thành công",
            };
        }

        return this.get<any[]>(
            `${API_CONFIG.ENDPOINTS.DASHBOARD_STATS}/top-customers?limit=${limit}`
        );
    }

    async getRecentActivity(limit: number = 20): Promise<ApiResponse<any[]>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: [
                    {
                        type: "invoice_created",
                        description: "Tạo hóa đơn #INV-001",
                        timestamp: new Date().toISOString(),
                    },
                    {
                        type: "payment_received",
                        description: "Nhận thanh toán từ Công ty ABC",
                        timestamp: new Date().toISOString(),
                    },
                ],
                message: "Lấy hoạt động gần đây thành công",
            };
        }

        return this.get<any[]>(
            `${API_CONFIG.ENDPOINTS.DASHBOARD_STATS}/recent-activity?limit=${limit}`
        );
    }
}

// Export singleton instance
export const dashboardApiService = new DashboardApiService();
