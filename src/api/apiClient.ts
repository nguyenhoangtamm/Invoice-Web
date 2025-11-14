/**
 * @deprecated This file is deprecated. Use the new modular API services instead.
 * Import from './services/index' for better organization.
 */

// Re-export the combined API client for backward compatibility
export { apiClient } from "./services/index";

// Also export individual services for direct use
export {
    authApiService,
    userApiService,
    invoiceApiService,
    companyApiService,
    dashboardApiService,
} from "./services/index";

// Export default for backward compatibility
export { apiClient as default } from "./services/index";
