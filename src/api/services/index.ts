// Export all API services
export { authApiService } from "./authService";
export { userApiService } from "./userService";
export { invoiceApiService } from "./invoiceService";
export { companyApiService } from "./companyService";
export { apiKeyService } from "./apiKeyService";
export { organizationService } from "./organizationService";
export { roleService } from "./roleService";
export { menuService } from "./menuService";
export { invoiceBatchService } from "./invoiceBatchService";
export { invoiceLineService } from "./invoiceLineService";

// Export new dashboard API functions
export {
    getDashboardStats,
    getRevenueChart,
    getTopCustomers,
    getRecentActivity,
} from "./dashboardService";

// Export dashboard types
export type {
    DashboardStatsDto,
    RevenueChartDataDto,
    TopCustomerDto,
    RecentActivityDto,
    DashboardStatsQueryParams,
    RevenueChartQueryParams,
    TopCustomersQueryParams,
    RecentActivityQueryParams,
} from "./dashboardService";

// Export new invoice API functions
export {
    fetchInvoices,
    getInvoice,
    searchInvoiceByCode,
    searchInvoicesByContact,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    uploadXmlFile,
    exportInvoices,
} from "./invoiceService";

// Export invoice types
export type {
    InvoiceDto,
    InvoiceLineDto,
    InvoicesQueryParams,
    InvoicesQueryResponse,
    InvoiceSearchParams,
    InvoicePayload,
} from "./invoiceService";

// Export auth API functions
export {
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    getAuthToken,
    getRefreshTokenValue,
    isAuthenticated,
    clearAuthTokens,
} from "./authService";

// Export auth types
export type {
    LoginDto,
    RegisterDto,
    AuthResponseDto,
    UserDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    ChangePasswordDto,
} from "./authService";

// Export organization API functions
export {
    fetchOrganizations,
    getAllOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    bulkDeleteOrganizations,
} from "./organizationService";

// Export organization types
export type {
    OrganizationDto,
    OrganizationsQueryParams,
    OrganizationsQueryResponse,
    OrganizationPayload,
} from "./organizationService";

// Export role API functions
export {
    fetchRoles,
    getAllRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
    getAllPermissions,
    bulkDeleteRoles,
} from "./roleService";

// Export role types
export type {
    RoleDto,
    RolesQueryParams,
    RolesQueryResponse,
    RolePayload,
    PermissionDto,
} from "./roleService";

// Export user API functions
export {
    fetchUsers,
    getUser,
    getUserProfile,
    createUser,
    updateUser,
    updateUserProfile,
    deleteUser,
    changeUserPassword,
    resetUserPassword,
    toggleUserStatus,
    bulkDeleteUsers,
} from "./userService";

// Export user types
export type {
    AdminUserDto,
    RoleInfoDto,
    UsersQueryParams,
    UsersQueryResponse,
    UserPayload,
    UpdateProfilePayload,
    ChangeUserPasswordPayload,
} from "./userService";

// Export types
export type { AuthApiService } from "./authService";
export type { UserApiService } from "./userService";
export type { InvoiceApiService } from "./invoiceService";
export type { CompanyApiService } from "./companyService";

// Combined API client for backward compatibility
import { authApiService } from "./authService";
import { userApiService } from "./userService";
import { invoiceApiService } from "./invoiceService";
import { companyApiService } from "./companyService";
import {
    getDashboardStats,
    getRevenueChart,
    getTopCustomers,
    getRecentActivity,
} from "./dashboardService";
import {
    fetchInvoices,
    getInvoice,
    searchInvoiceByCode,
    searchInvoicesByContact,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    uploadXmlFile,
    exportInvoices,
} from "./invoiceService";
import {
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    forgotPassword,
} from "./authService";

/**
 * Combined API Client
 * Provides access to all API services in a single object
 * Maintains backward compatibility with existing code
 */
export const apiClient = {
    // Auth methods (new standardized functions)
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    forgotPassword,

    // User methods
    getUserProfile: userApiService.getUserProfile.bind(userApiService),
    updateUserProfile: userApiService.updateUserProfile.bind(userApiService),

    // Invoice methods (new standardized functions)
    fetchInvoices,
    getInvoice,
    searchInvoiceByCode,
    searchInvoicesByContact,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    uploadXmlFile,
    exportInvoices,

    // Invoice methods (backward compatibility)
    getInvoices: invoiceApiService.getInvoices.bind(invoiceApiService),
    getInvoiceById: getInvoice,
    searchInvoiceByContact: searchInvoicesByContact,

    // Company methods
    getCompanyInfo: companyApiService.getCompanyInfo.bind(companyApiService),
    updateCompanyInfo:
        companyApiService.updateCompanyInfo.bind(companyApiService),
    getCompanyStats: companyApiService.getCompanyStats.bind(companyApiService),
    getCompanies: companyApiService.getCompanies.bind(companyApiService),
    createCompany: companyApiService.createCompany.bind(companyApiService),
    deleteCompany: companyApiService.deleteCompany.bind(companyApiService),

    // Dashboard methods (new standardized functions)
    getDashboardStats,
    getRevenueChart,
    getTopCustomers,
    getRecentActivity,

    // Token management methods
    setAuthToken: (token: string) => {
        authApiService.setAuthToken(token);
        userApiService.setAuthToken(token);
        invoiceApiService.setAuthToken(token);
        companyApiService.setAuthToken(token);
    },

    clearAuthToken: () => {
        authApiService.clearAuthToken();
        userApiService.clearAuthToken();
        invoiceApiService.clearAuthToken();
        companyApiService.clearAuthToken();
    },
};
