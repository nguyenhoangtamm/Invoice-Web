import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import UnauthorizedAccess from './UnauthorizedAccess';

type PermissionLevel = 'public' | 'authenticated' | 'admin' | 'user';

interface Permission {
    level: PermissionLevel;
    roles?: string[];
    redirectTo?: string;
    showUnauthorizedPage?: boolean;
}

interface PermissionMiddlewareProps {
    children: React.ReactNode;
    permission: Permission;
}

/**
 * Middleware tổng quát để quản lý quyền truy cập
 * Hỗ trợ nhiều cấp độ quyền khác nhau
 */
export default function PermissionMiddleware({
    children,
    permission
}: PermissionMiddlewareProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Hiển thị loading khi đang kiểm tra authentication
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Kiểm tra quyền dựa trên level
    const checkPermission = (): { hasAccess: boolean; shouldRedirect: boolean; redirectTo?: string } => {
        switch (permission.level) {
            case 'public':
                // Ai cũng có thể truy cập
                return { hasAccess: true, shouldRedirect: false };

            case 'authenticated':
                // Chỉ user đã đăng nhập
                if (!isAuthenticated || !user) {
                    return {
                        hasAccess: false,
                        shouldRedirect: true,
                        redirectTo: '/login'
                    };
                }
                return { hasAccess: true, shouldRedirect: false };

            case 'admin':
                // Chỉ Admin
                if (!isAuthenticated || !user) {
                    return {
                        hasAccess: false,
                        shouldRedirect: true,
                        redirectTo: '/login'
                    };
                }
                if (user.role !== 'Admin') {
                    const redirect = permission.redirectTo || '/dashboard';
                    return {
                        hasAccess: false,
                        shouldRedirect: !permission.showUnauthorizedPage,
                        redirectTo: redirect
                    };
                }
                return { hasAccess: true, shouldRedirect: false };

            case 'user':
                // Chỉ User thường (không phải Admin)
                if (!isAuthenticated || !user) {
                    return {
                        hasAccess: false,
                        shouldRedirect: true,
                        redirectTo: '/login'
                    };
                }
                if (user.role === 'Admin') {
                    const redirect = permission.redirectTo || '/admin/dashboard';
                    return {
                        hasAccess: false,
                        shouldRedirect: !permission.showUnauthorizedPage,
                        redirectTo: redirect
                    };
                }
                return { hasAccess: true, shouldRedirect: false };

            default:
                // Kiểm tra theo danh sách roles cụ thể
                if (!isAuthenticated || !user) {
                    return {
                        hasAccess: false,
                        shouldRedirect: true,
                        redirectTo: '/login'
                    };
                }

                if (permission.roles && !permission.roles.includes(user.role)) {
                    const defaultRedirect = user.role === 'Admin' ? '/admin/dashboard' : '/dashboard';
                    const redirect = permission.redirectTo || defaultRedirect;
                    return {
                        hasAccess: false,
                        shouldRedirect: !permission.showUnauthorizedPage,
                        redirectTo: redirect
                    };
                }

                return { hasAccess: true, shouldRedirect: false };
        }
    };

    const { hasAccess, shouldRedirect, redirectTo } = checkPermission();

    // Không có quyền truy cập
    if (!hasAccess) {
        if (shouldRedirect && redirectTo) {
            // Redirect đến trang khác
            const state = redirectTo === '/login' ? { from: location } : undefined;
            return <Navigate to={redirectTo} state={state} replace />;
        } else {
            // Hiển thị trang không có quyền
            return (
                <UnauthorizedAccess
                    allowedRoles={permission.roles}
                    message={getUnauthorizedMessage(permission)}
                />
            );
        }
    }

    // Có quyền truy cập
    return <>{children}</>;
}

/**
 * Tạo thông báo lỗi phù hợp với loại quyền
 */
function getUnauthorizedMessage(permission: Permission): string {
    switch (permission.level) {
        case 'admin':
            return 'Trang này chỉ dành cho quản trị viên (Admin)';
        case 'user':
            return 'Trang này chỉ dành cho người dùng thường';
        case 'authenticated':
            return 'Bạn cần đăng nhập để truy cập trang này';
        default:
            if (permission.roles) {
                return `Trang này chỉ dành cho: ${permission.roles.join(', ')}`;
            }
            return 'Bạn không có quyền truy cập vào trang này';
    }
}

// Export các helper functions để sử dụng dễ dàng hơn
export const createPermission = {
    public: (): Permission => ({ level: 'public' }),

    authenticated: (redirectTo?: string): Permission => ({
        level: 'authenticated',
        redirectTo
    }),

    adminOnly: (redirectTo?: string, showUnauthorizedPage = false): Permission => ({
        level: 'admin',
        redirectTo,
        showUnauthorizedPage
    }),

    userOnly: (redirectTo?: string, showUnauthorizedPage = false): Permission => ({
        level: 'user',
        redirectTo,
        showUnauthorizedPage
    }),

    roles: (roles: string[], redirectTo?: string, showUnauthorizedPage = false): Permission => ({
        level: 'authenticated',
        roles,
        redirectTo,
        showUnauthorizedPage
    })
};