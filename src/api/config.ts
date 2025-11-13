// API Configuration
export const API_CONFIG = {
  // Base URL cho API thật (sẽ thay thế sau)
  BASE_URL: (typeof window !== 'undefined' ? (window as any).__RUNTIME_CONFIG__?.REACT_APP_API_URL : '') || 'https://api.invoice-app.vn',
  
  // Timeout cho requests
  TIMEOUT: 10000,
  
  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    // User endpoints
    USER_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    
    // Invoice endpoints
    INVOICES: '/invoices',
    INVOICE_SEARCH: '/invoices/search',
    INVOICE_BY_CODE: '/invoices/code',
    INVOICE_BY_CONTACT: '/invoices/contact',
    INVOICE_UPLOAD_XML: '/invoices/upload-xml',
    INVOICE_EXPORT: '/invoices/export',
    
    // Company endpoints
    COMPANY: '/companies',
    COMPANY_STATS: '/companies/stats',
    
    // Dashboard endpoints
    DASHBOARD_STATS: '/dashboard/stats',
  }
};

// API Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Mock mode flag - set to false when using real API
export const USE_MOCK_API = import.meta.env.NODE_ENV === 'development' || 
  import.meta.env.VITE_USE_MOCK_API === 'true';