import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
    fallbackComponent?: React.ComponentType;
}

/**
 * RoleGuard component để bảo vệ routes dựa trên role của user
 * @param children - Component con cần được bảo vệ
 * @param allowedRoles - Danh sách các roles được phép truy cập
 * @param redirectTo - Đường dẫn redirect khi không có quyền (mặc định: /dashboard cho user, /login nếu chưa đăng nhập)
 * @param fallbackComponent - Component hiển thị khi không có quyền thay vì redirect
 */
export default function RoleGuard({
    children,
    allowedRoles,
    redirectTo,
    fallbackComponent: FallbackComponent
}: RoleGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Hiển thị loading khi đang kiểm tra authentication
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Redirect đến login nếu chưa đăng nhập
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền truy cập
    const hasPermission = allowedRoles.includes(user.role);

    if (!hasPermission) {
        // Hiển thị fallback component nếu có
        if (FallbackComponent) {
            return <FallbackComponent />;
        }

        // Xác định đường dẫn redirect
        const defaultRedirect = user.role === 'Admin' ? '/admin/dashboard' : '/dashboard';
        const redirectPath = redirectTo || defaultRedirect;

        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
}