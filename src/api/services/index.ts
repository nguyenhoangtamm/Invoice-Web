// Export all API services
export { authApiService } from "./authService";
export { userApiService } from "./userService";
export { invoiceApiService } from "./invoiceService";
export { companyApiService } from "./companyService";
export { dashboardApiService } from "./dashboardService";
export { apiKeyService } from "./apiKeyService";
export { organizationService } from "./organizationService";
export { roleService } from "./roleService";
export { menuService } from "./menuService";
export { invoiceBatchService } from "./invoiceBatchService";
export { invoiceLineService } from "./invoiceLineService";

// Export types
export type { AuthApiService } from "./authService";
export type { UserApiService } from "./userService";
export type { InvoiceApiService } from "./invoiceService";
export type { CompanyApiService } from "./companyService";
export type { DashboardApiService } from "./dashboardService";

// Combined API client for backward compatibility
import { authApiService } from "./authService";
import { userApiService } from "./userService";
import { invoiceApiService } from "./invoiceService";
import { companyApiService } from "./companyService";
import { dashboardApiService } from "./dashboardService";

/**
 * Combined API Client
 * Provides access to all API services in a single object
 * Maintains backward compatibility with existing code
 */
export const apiClient = {
    // Auth methods
    login: authApiService.login.bind(authApiService),
    register: authApiService.register.bind(authApiService),
    logout: authApiService.logout.bind(authApiService),
    refreshToken: authApiService.refreshToken.bind(authApiService),
    getCurrentUser: authApiService.getCurrentUser.bind(authApiService),
    forgotPassword: authApiService.forgotPassword.bind(authApiService),

    // User methods
    getUserProfile: userApiService.getUserProfile.bind(userApiService),
    updateUserProfile: userApiService.updateUserProfile.bind(userApiService),

    // Invoice methods
    searchInvoiceByCode:
        invoiceApiService.searchInvoiceByCode.bind(invoiceApiService),
    searchInvoiceByContact:
        invoiceApiService.searchInvoiceByContact.bind(invoiceApiService),
    uploadXmlFile: invoiceApiService.uploadXmlFile.bind(invoiceApiService),
    getInvoices: invoiceApiService.getInvoices.bind(invoiceApiService),
    getInvoiceById: invoiceApiService.getInvoiceById.bind(invoiceApiService),
    createInvoice: invoiceApiService.createInvoice.bind(invoiceApiService),
    updateInvoice: invoiceApiService.updateInvoice.bind(invoiceApiService),
    deleteInvoice: invoiceApiService.deleteInvoice.bind(invoiceApiService),
    exportInvoices: invoiceApiService.exportInvoices.bind(invoiceApiService),
    searchInvoices: invoiceApiService.searchInvoices.bind(invoiceApiService),

    // Company methods
    getCompanyInfo: companyApiService.getCompanyInfo.bind(companyApiService),
    updateCompanyInfo:
        companyApiService.updateCompanyInfo.bind(companyApiService),
    getCompanyStats: companyApiService.getCompanyStats.bind(companyApiService),
    getCompanies: companyApiService.getCompanies.bind(companyApiService),
    createCompany: companyApiService.createCompany.bind(companyApiService),
    deleteCompany: companyApiService.deleteCompany.bind(companyApiService),

    // Dashboard methods
    getDashboardStats:
        dashboardApiService.getDashboardStats.bind(dashboardApiService),
    getDashboardStatsWithPeriod:
        dashboardApiService.getDashboardStatsWithPeriod.bind(
            dashboardApiService
        ),
    getRevenueChart:
        dashboardApiService.getRevenueChart.bind(dashboardApiService),
    getTopCustomers:
        dashboardApiService.getTopCustomers.bind(dashboardApiService),
    getRecentActivity:
        dashboardApiService.getRecentActivity.bind(dashboardApiService),

    // Token management methods
    setAuthToken: (token: string) => {
        authApiService.setAuthToken(token);
        userApiService.setAuthToken(token);
        invoiceApiService.setAuthToken(token);
        companyApiService.setAuthToken(token);
        dashboardApiService.setAuthToken(token);
    },

    clearAuthToken: () => {
        authApiService.clearAuthToken();
        userApiService.clearAuthToken();
        invoiceApiService.clearAuthToken();
        companyApiService.clearAuthToken();
        dashboardApiService.clearAuthToken();
    },
};
