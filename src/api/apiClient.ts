import { API_CONFIG, USE_MOCK_API } from './config';
import * as mockApi from './mockApi';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  ApiResponse,
  Invoice,
  User,
  Company,
  DashboardStats,
  PaginatedResponse
} from '../types/invoice';

/**
 * API Client Service
 * Handles switching between mock API and real API based on configuration
 */

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }
  
  // Set auth token for requests
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  // Remove auth token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }
  
  // Generic HTTP request method (for real API calls)
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
      };
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'API request failed',
          errors: data.errors,
        };
      }
      
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        message: 'Network error occurred',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }
  
  // ========================= AUTH METHODS =========================
  
  async login(loginData: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_API) {
      return mockApi.loginApi(loginData);
    }
    
    return this.request<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }
  
  async register(registerData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_API) {
      return mockApi.registerApi(registerData);
    }
    
    return this.request<AuthResponse>(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }
  
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    if (USE_MOCK_API) {
      return mockApi.forgotPasswordApi(email);
    }
    
    return this.request<{ message: string }>(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
  
  async logout(): Promise<ApiResponse<void>> {
    if (USE_MOCK_API) {
      return { success: true, message: 'Đăng xuất thành công' };
    }
    
    return this.request<void>(API_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
  }
  
  // ========================= USER METHODS =========================
  
  async getUserProfile(): Promise<ApiResponse<User>> {
    if (USE_MOCK_API) {
      return mockApi.getUserProfileApi();
    }
    
    return this.request<User>(API_CONFIG.ENDPOINTS.USER_PROFILE);
  }
  
  // ========================= INVOICE METHODS =========================
  
  async searchInvoiceByCode(code: string): Promise<ApiResponse<Invoice | null>> {
    if (USE_MOCK_API) {
      return mockApi.searchByCodeApi(code);
    }
    
    return this.request<Invoice | null>(`${API_CONFIG.ENDPOINTS.INVOICE_BY_CODE}/${encodeURIComponent(code)}`);
  }
  
  async searchInvoiceByContact(query: string): Promise<ApiResponse<Invoice[]>> {
    if (USE_MOCK_API) {
      return mockApi.searchByContactApi(query);
    }
    
    return this.request<Invoice[]>(`${API_CONFIG.ENDPOINTS.INVOICE_BY_CONTACT}?q=${encodeURIComponent(query)}`);
  }
  
  async uploadXmlFile(file: File): Promise<ApiResponse<Invoice>> {
    if (USE_MOCK_API) {
      return mockApi.uploadXmlFileApi(file);
    }
    
    const formData = new FormData();
    formData.append('xml_file', file);
    
    return this.request<Invoice>(API_CONFIG.ENDPOINTS.INVOICE_UPLOAD_XML, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        ...this.defaultHeaders,
        'Content-Type': undefined as any,
      },
    });
  }
  
  async getInvoices(page = 1, limit = 10, status?: string): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
    if (USE_MOCK_API) {
      return mockApi.getInvoicesApi(page, limit, status);
    }
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status && status !== 'all') {
      params.append('status', status);
    }
    
    return this.request<PaginatedResponse<Invoice>>(`${API_CONFIG.ENDPOINTS.INVOICES}?${params}`);
  }
  
  // ========================= COMPANY METHODS =========================
  
  async getCompanyInfo(): Promise<ApiResponse<Company>> {
    if (USE_MOCK_API) {
      return mockApi.getCompanyInfoApi();
    }
    
    return this.request<Company>(API_CONFIG.ENDPOINTS.COMPANY);
  }
  
  // ========================= DASHBOARD METHODS =========================
  
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    if (USE_MOCK_API) {
      return mockApi.getDashboardStatsApi();
    }
    
    return this.request<DashboardStats>(API_CONFIG.ENDPOINTS.DASHBOARD_STATS);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for backward compatibility with existing code
export const {
  login,
  register,
  forgotPassword,
  logout,
  getUserProfile,
  searchInvoiceByCode,
  searchInvoiceByContact,
  uploadXmlFile,
  getInvoices,
  getCompanyInfo,
  getDashboardStats,
} = apiClient;

export default apiClient;