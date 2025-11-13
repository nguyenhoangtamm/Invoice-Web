export interface InvoiceLine {
  line_number?: number;
  description?: string;
  unit?: string;
  quantity?: number;
  unit_price?: number;
  tax_amount?: number;
  line_total?: number;
}

export interface Invoice {
  invoice_number?: string;
  form_number?: string;
  serial?: string;
  CustomerName?: string;
  CustomerAddress?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  issued_date?: string; // ISO date
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  currency?: string;
  status?: string;
  tenant_organization_id?: string;
  issued_by_user_id?: string;
  note?: string;
  batch_id?: string;
  immutable_hash?: string;
  created_at?: string;
  updated_at?: string;
  lines?: InvoiceLine[];
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'admin' | 'user' | 'viewer';
  company_id?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company_name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  expires_in: number;
}

// Company types
export interface Company {
  id: string;
  name: string;
  address: string;
  tax_code: string;
  email: string;
  phone: string;
  logo?: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard stats
export interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
}
