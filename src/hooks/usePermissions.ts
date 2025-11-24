import { useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Hook để kiểm tra quyền của user
 */
export function usePermissions() {
    const { user, isAuthenticated } = useAuth();

    const permissions = useMemo(() => {
        if (!isAuthenticated || !user) {
            return {
                isLoggedIn: false,
                isAdmin: false,
                isUser: false,
                role: null,
                canAccessAdmin: false,
                canAccessDashboard: false,
                hasRole: (role: string) => false,
                hasAnyRole: (roles: string[]) => false,
                hasAllRoles: (roles: string[]) => false,
            };
        }

        const userRole = user.role;
        const isAdmin = userRole === "Admin";
        const isUser = userRole !== "Admin";

        return {
            isLoggedIn: true,
            isAdmin,
            isUser,
            role: userRole,
            canAccessAdmin: isAdmin,
            canAccessDashboard: true, // Mọi user đã đăng nhập đều có thể vào dashboard

            /**
             * Kiểm tra user có role cụ thể
             */
            hasRole: (role: string): boolean => {
                return userRole === role;
            },

            /**
             * Kiểm tra user có ít nhất một trong các roles
             */
            hasAnyRole: (roles: string[]): boolean => {
                return roles.includes(userRole);
            },

            /**
             * Kiểm tra user có tất cả các roles (trong trường hợp hệ thống hỗ trợ multiple roles)
             * Hiện tại chỉ có 1 role per user nên sẽ trả về false nếu có nhiều hơn 1 role
             */
            hasAllRoles: (roles: string[]): boolean => {
                if (roles.length === 0) return true;
                if (roles.length === 1) return roles[0] === userRole;
                return false; // Current system only supports single role per user
            },
        };
    }, [isAuthenticated, user]);

    return permissions;
}

/**
 * Hook để lấy thông tin redirect dựa trên role
 */
export function useRoleBasedNavigation() {
    const { user, isAuthenticated } = useAuth();

    const navigation = useMemo(() => {
        if (!isAuthenticated || !user) {
            return {
                defaultRoute: "/login",
                homeRoute: "/login",
                dashboardRoute: "/login",
            };
        }

        const isAdmin = user.role === "Admin";

        return {
            defaultRoute: isAdmin ? "/admin/dashboard" : "/dashboard",
            homeRoute: isAdmin ? "/admin/dashboard" : "/dashboard",
            dashboardRoute: isAdmin ? "/admin/dashboard" : "/dashboard",

            /**
             * Lấy route phù hợp dựa trên role hiện tại
             */
            getRouteForRole: (targetRole?: string): string => {
                if (!targetRole)
                    return isAdmin ? "/admin/dashboard" : "/dashboard";

                if (targetRole === "Admin") return "/admin/dashboard";
                return "/dashboard";
            },

            /**
             * Kiểm tra xem user có thể truy cập route không
             */
            canAccessRoute: (route: string): boolean => {
                if (route.startsWith("/admin")) {
                    return user.role === "Admin";
                }
                if (route.startsWith("/dashboard")) {
                    return true; // Mọi user đã đăng nhập đều có thể vào dashboard
                }
                return true; // Public routes
            },
        };
    }, [isAuthenticated, user]);

    return navigation;
}

/**
 * Type definitions for better TypeScript support
 */
export type UserRole = "Admin" | "User";

export interface PermissionCheck {
    isLoggedIn: boolean;
    isAdmin: boolean;
    isUser: boolean;
    role: string | null;
    canAccessAdmin: boolean;
    canAccessDashboard: boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
}

export interface RoleBasedNavigation {
    defaultRoute: string;
    homeRoute: string;
    dashboardRoute: string;
    getRouteForRole: (targetRole?: string) => string;
    canAccessRoute: (route: string) => boolean;
}
