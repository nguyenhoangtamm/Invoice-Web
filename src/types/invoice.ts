export interface InvoiceLine {
    id: number;
    invoiceId: number;
    lineNumber: number;
    name: string;
    quantity: number;
    unit?: string;
    unitPrice: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    formNumber: string;
    serial: string;
    organizationId: number;
    issuedByUserId: number;
    sellerName: string;
    sellerTaxId: string;
    sellerAddress?: string;
    sellerPhone?: string;
    sellerEmail?: string;
    customerName: string;
    customerTaxId: string;
    customerAddress?: string;
    customerPhone?: string;
    customerEmail?: string;
    status: number;
    issuedDate: string;
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    note?: string;
    batchId: number;
    lookupCode: string;
    immutableHash?: string;
    cid?: string;
    cidHash?: string;
    merkleProof?: string;
    lines: InvoiceLine[];
    attachmentFileIds?: number[];
}

export interface InvoiceLookUp {
    id: number;
    invoiceNumber: string;
    formNumber: string;
    serial: string;
    organizationId: number;
    issuedByUserId: number;
    sellerName: string;
    sellerTaxId: string;
    sellerAddress?: string;
    sellerPhone?: string;
    sellerEmail?: string;
    customerName: string;
    customerTaxId: string;
    customerAddress?: string;
    customerPhone?: string;
    customerEmail?: string;
    status: number;
    issuedDate: string;
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    note?: string;
    batchId: number;
    immutableHash?: string;
    cid?: string;
    cidHash?: string;
    merkleProof?: string;
    isExactMatch?: boolean;
    lines: InvoiceLine[];
    attachmentFileIds?: number[];
}

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    phone?: string;
    role: "admin" | "user" | "viewer";
    company_id?: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
}

export interface LoginRequest {
    UsernameOrEmail: string;
    Password: string;
}

export interface RegisterRequest {
    Email: string;
    Password: string;
    UserName: string;
    Fullname: string;
    Gender: string;
    BirthDate: string;
    Address: string;
    Bio: string;
    PhoneNumber: string;
}

export interface RefreshTokenRequest {
    RefreshToken: string;
}

export interface AuthUser {
    userName: string;
    fullName: string;
    role: string;
}

export interface AuthData {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface AuthResponse {
    data: AuthData;
    message: string;
}

export interface CurrentUserResponse {
    id: string;
    userName: string;
    email: string;
    roleId: string;
    status: string;
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
    message: string;
    succeeded: boolean;
    data: T;
    code: number;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    succeeded: boolean;
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

// Invoice Detail type (for detailed invoice information)
export interface InvoiceDetail extends Invoice {}

// Request types for Invoice operations
export interface CreateInvoiceLineRequest {
    invoiceId?: number;
    lineNumber: number;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
}

export interface CreateInvoiceRequest {
    invoiceNumber: string;
    formNumber: string;
    serial: string;
    organizationId: number;
    sellerName: string;
    sellerTaxId: string;
    sellerAddress: string;
    sellerPhone: string;
    sellerEmail: string;
    customerName: string;
    customerTaxId: string;
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
    status: number;
    issuedDate: string;
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    note: string;
    lines: CreateInvoiceLineRequest[];
    attachmentFileIds?: number[];
}

export interface UpdateInvoiceRequest extends CreateInvoiceRequest {
    id: string;
}
