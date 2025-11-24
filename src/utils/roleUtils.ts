import type { UserDto } from "../api/services/authService";

/**
 * Utility functions để quản lý navigation dựa trên role
 */

/**
 * Lấy route mặc định dựa trên role của user
 */
export function getDefaultRoute(user: UserDto | null): string {
    if (!user) return "/login";

    return user.role === "Admin" ? "/admin/dashboard" : "/dashboard";
}

/**
 * Lấy route dashboard phù hợp dựa trên role
 */
export function getDashboardRoute(user: UserDto | null): string {
    if (!user) return "/login";

    return user.role === "Admin" ? "/admin/dashboard" : "/dashboard";
}

/**
 * Kiểm tra user có quyền truy cập route không
 */
export function canAccessRoute(user: UserDto | null, route: string): boolean {
    if (!user) return false;

    // Admin routes chỉ dành cho Admin
    if (route.startsWith("/admin")) {
        return user.role === "Admin";
    }

    // Dashboard routes:
    // - Admin có thể vào nhưng sẽ được redirect về admin dashboard
    // - User thường có thể vào
    if (route.startsWith("/dashboard")) {
        return true;
    }

    // Public routes
    if (
        [
            "/lookup",
            "/login",
            "/register",
            "/forgot-password",
            "/terms",
            "/privacy",
        ].includes(route)
    ) {
        return true;
    }

    // Blockchain verification - public
    if (route.startsWith("/blockchain-verify")) {
        return true;
    }

    return false;
}

/**
 * Lấy route redirect khi user không có quyền truy cập
 */
export function getRedirectRoute(
    user: UserDto | null,
    attemptedRoute: string
): string {
    if (!user) return "/login";

    // Nếu user thường cố vào admin, redirect về dashboard
    if (attemptedRoute.startsWith("/admin") && user.role !== "Admin") {
        return "/dashboard";
    }

    // Nếu admin cố vào user dashboard, redirect về admin dashboard
    if (attemptedRoute.startsWith("/dashboard") && user.role === "Admin") {
        return "/admin/dashboard";
    }

    // Mặc định redirect về trang chủ phù hợp với role
    return getDefaultRoute(user);
}

/**
 * Kiểm tra xem có nên redirect user sau khi đăng nhập không
 */
export function shouldRedirectAfterLogin(
    user: UserDto,
    currentRoute: string
): { should: boolean; redirectTo?: string } {
    // Nếu đang ở trang login/register, redirect về trang chủ
    if (["/login", "/register", "/forgot-password"].includes(currentRoute)) {
        return {
            should: true,
            redirectTo: getDefaultRoute(user),
        };
    }

    // Nếu đang ở route không phù hợp với role
    if (!canAccessRoute(user, currentRoute)) {
        return {
            should: true,
            redirectTo: getRedirectRoute(user, currentRoute),
        };
    }

    return { should: false };
}

/**
 * Các role được định nghĩa trong hệ thống
 */
export const ROLES = {
    ADMIN: "Admin",
    USER: "User",
} as const;

/**
 * Các route patterns
 */
export const ROUTE_PATTERNS = {
    ADMIN: "/admin",
    DASHBOARD: "/dashboard",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    LOOKUP: "/lookup",
    TERMS: "/terms",
    PRIVACY: "/privacy",
    BLOCKCHAIN_VERIFY: "/blockchain-verify",
} as const;

/**
 * Kiểm tra role cụ thể
 */
export const roleCheckers = {
    isAdmin: (user: UserDto | null): boolean => user?.role === ROLES.ADMIN,
    isUser: (user: UserDto | null): boolean => user?.role === ROLES.USER,
    isAuthenticated: (user: UserDto | null): boolean => !!user,
};

/**
 * Route guards configuration
 */
export const routeGuards = {
    public: [
        ROUTE_PATTERNS.LOOKUP,
        ROUTE_PATTERNS.LOGIN,
        ROUTE_PATTERNS.REGISTER,
        ROUTE_PATTERNS.FORGOT_PASSWORD,
        ROUTE_PATTERNS.TERMS,
        ROUTE_PATTERNS.PRIVACY,
        ROUTE_PATTERNS.BLOCKCHAIN_VERIFY,
    ],
    authenticated: [ROUTE_PATTERNS.DASHBOARD],
    adminOnly: [ROUTE_PATTERNS.ADMIN],
};
