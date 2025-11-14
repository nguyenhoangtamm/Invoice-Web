import {
    mockInvoice,
    mockInvoices,
    mockUsers,
    mockCompany,
    mockDashboardStats,
} from "../data/mockInvoice";
import type {
    Invoice,
    User,
    Company,
    DashboardStats,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    CurrentUserResponse,
    ApiResponse,
    PaginatedResponse,
} from "../types/invoice";

/**
 * Mock API service để simulate các API calls
 * Tất cả functions sẽ được thay thế bằng real API calls sau này
 */

// Helper function để simulate network delay
const simulateNetworkDelay = (min: number = 300, max: number = 1000) => {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

// Helper function để tạo response format nhất quán
const createApiResponse = <T>(
    data: T,
    success = true,
    message?: string
): ApiResponse<T> => ({
    success,
    data,
    message,
});

const createErrorResponse = (
    message: string,
    errors?: string[]
): ApiResponse => ({
    success: false,
    message,
    errors,
});

// ========================= AUTH APIS =========================

/**
 * Đăng nhập user
 */
export async function loginApi(
    loginData: LoginRequest
): Promise<ApiResponse<AuthResponse>> {
    await simulateNetworkDelay();

    // Mock validation
    if (!loginData.UsernameOrEmail || !loginData.Password) {
        return createErrorResponse("Username/Email và mật khẩu là bắt buộc");
    }

    // Simulate checking credentials
    const user = mockUsers.find(
        (u) =>
            u.email === loginData.UsernameOrEmail ||
            u.name === loginData.UsernameOrEmail
    );
    if (!user) {
        return createErrorResponse("Username/Email hoặc mật khẩu không đúng");
    }

    // Mock successful login
    const authResponse: AuthResponse = {
        data: {
            accessToken: `mock_token_${Date.now()}`,
            refreshToken: `mock_refresh_token_${Date.now()}`,
            user: {
                userName: user.name,
                fullName: user.name,
                role: user.role,
            },
        },
        message: "Đăng nhập thành công",
    };

    return createApiResponse(authResponse, true, "Đăng nhập thành công");
}

/**
 * Đăng ký user mới
 */
export async function registerApi(
    registerData: RegisterRequest
): Promise<ApiResponse<AuthResponse>> {
    await simulateNetworkDelay();

    // Mock validation
    if (
        !registerData.Email ||
        !registerData.Password ||
        !registerData.UserName
    ) {
        return createErrorResponse(
            "Email, mật khẩu và tên người dùng là bắt buộc"
        );
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === registerData.Email);
    if (existingUser) {
        return createErrorResponse("Email đã được sử dụng");
    }

    // Create new user
    const newUser: User = {
        id: `USR-${Date.now()}`,
        email: registerData.Email,
        name: registerData.Fullname || registerData.UserName,
        phone: registerData.PhoneNumber,
        role: "user",
        company_id: "COMP-001", // Default company
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const authResponse: AuthResponse = {
        data: {
            accessToken: `mock_token_${Date.now()}`,
            refreshToken: `mock_refresh_token_${Date.now()}`,
            user: {
                userName: registerData.UserName,
                fullName: registerData.Fullname,
                role: "user",
            },
        },
        message: "Đăng ký thành công",
    };

    return createApiResponse(authResponse, true, "Đăng ký thành công");
}

/**
 * Quên mật khẩu
 */
export async function forgotPasswordApi(
    email: string
): Promise<ApiResponse<{ message: string }>> {
    await simulateNetworkDelay();

    if (!email) {
        return createErrorResponse("Email là bắt buộc");
    }

    return createApiResponse(
        { message: "Link reset mật khẩu đã được gửi đến email của bạn" },
        true,
        "Email reset mật khẩu đã được gửi"
    );
}

// ========================= INVOICE APIS =========================

/**
 * Tìm kiếm invoice theo mã
 */
export async function searchByCodeApi(
    code: string
): Promise<ApiResponse<Invoice | null>> {
    await simulateNetworkDelay();

    if (!code.trim()) {
        return createApiResponse(null, true, "Không có mã invoice để tìm kiếm");
    }

    // Tìm trong mock data
    const invoice = mockInvoices.find(
        (inv) =>
            inv.invoice_number?.toLowerCase().includes(code.toLowerCase()) ||
            inv.form_number?.toLowerCase().includes(code.toLowerCase())
    );

    return createApiResponse(
        invoice || null,
        true,
        invoice ? "Tìm thấy invoice" : "Không tìm thấy invoice với mã này"
    );
}

/**
 * Tìm kiếm invoice theo thông tin liên hệ
 */
export async function searchByContactApi(
    query: string
): Promise<ApiResponse<Invoice[]>> {
    await simulateNetworkDelay();

    if (!query.trim()) {
        return createApiResponse([], true, "Không có thông tin tìm kiếm");
    }

    // Tìm kiếm trong customer name, email, phone
    const results = mockInvoices.filter(
        (invoice) =>
            invoice.CustomerName?.toLowerCase().includes(query.toLowerCase()) ||
            invoice.CustomerEmail?.toLowerCase().includes(
                query.toLowerCase()
            ) ||
            invoice.CustomerPhone?.includes(query)
    );

    return createApiResponse(
        results,
        true,
        `Tìm thấy ${results.length} kết quả`
    );
}

/**
 * Upload và parse XML file
 */
export async function uploadXmlFileApi(
    file: File
): Promise<ApiResponse<Invoice>> {
    await simulateNetworkDelay(800, 2000); // Longer delay for file upload

    if (!file) {
        return createErrorResponse("File không hợp lệ");
    }

    // Mock validation
    if (!file.name.toLowerCase().endsWith(".xml")) {
        return createErrorResponse("Chỉ chấp nhận file XML");
    }

    if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        return createErrorResponse("File quá lớn (tối đa 5MB)");
    }

    // Return mock invoice as if parsed from XML
    return createApiResponse(
        mockInvoice,
        true,
        "Upload và parse XML thành công"
    );
}

/**
 * Lấy danh sách tất cả invoices với pagination
 */
export async function getInvoicesApi(
    page = 1,
    limit = 10,
    status?: string
): Promise<ApiResponse<PaginatedResponse<Invoice>>> {
    await simulateNetworkDelay();

    let filteredInvoices = [...mockInvoices];

    // Filter by status if provided
    if (status && status !== "all") {
        filteredInvoices = mockInvoices.filter((inv) =>
            inv.status?.toLowerCase().includes(status.toLowerCase())
        );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredInvoices.slice(startIndex, endIndex);

    const response: PaginatedResponse<Invoice> = {
        data: paginatedData,
        total: filteredInvoices.length,
        page,
        limit,
        totalPages: Math.ceil(filteredInvoices.length / limit),
    };

    return createApiResponse(
        response,
        true,
        "Lấy danh sách invoice thành công"
    );
}

// ========================= USER APIS =========================

/**
 * Lấy thông tin profile user hiện tại
 */
export async function getUserProfileApi(): Promise<ApiResponse<User>> {
    await simulateNetworkDelay();

    // Mock: return first user as current user
    return createApiResponse(
        mockUsers[0],
        true,
        "Lấy thông tin profile thành công"
    );
}

// ========================= COMPANY APIS =========================

/**
 * Lấy thông tin công ty
 */
export async function getCompanyInfoApi(): Promise<ApiResponse<Company>> {
    await simulateNetworkDelay();

    return createApiResponse(
        mockCompany,
        true,
        "Lấy thông tin công ty thành công"
    );
}

// ========================= DASHBOARD APIS =========================

/**
 * Lấy thống kê dashboard
 */
export async function getDashboardStatsApi(): Promise<
    ApiResponse<DashboardStats>
> {
    await simulateNetworkDelay();

    return createApiResponse(
        mockDashboardStats,
        true,
        "Lấy thống kê dashboard thành công"
    );
}

// Legacy functions for backward compatibility
export async function searchByCode(code: string): Promise<Invoice | null> {
    const response = await searchByCodeApi(code);
    return response.data || null;
}

export async function searchByContact(
    query: string
): Promise<Invoice[] | null> {
    const response = await searchByContactApi(query);
    return response.data || null;
}

export async function uploadXmlFile(file: File): Promise<Invoice | null> {
    const response = await uploadXmlFileApi(file);
    return response.data || null;
}
