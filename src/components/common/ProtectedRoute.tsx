import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { getRedirectRoute, canAccessRoute } from '../../utils/roleUtils';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * ProtectedRoute - Component tổng quát để bảo vệ routes
 * Tự động redirect user đến trang phù hợp dựa trên role
 */
export default function ProtectedRoute({
    children,
    allowedRoles,
    requireAuth = true,
    redirectTo
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Loading state
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Kiểm tra authentication nếu yêu cầu
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu không yêu cầu auth và user chưa đăng nhập
    if (!requireAuth && !isAuthenticated) {
        return <>{children}</>;
    }

    // Kiểm tra quyền truy cập nếu có định nghĩa allowedRoles
    if (allowedRoles && allowedRoles.length > 0 && user) {
        const hasPermission = allowedRoles.includes(user.role);

        if (!hasPermission) {
            const redirectPath = redirectTo || getRedirectRoute(user, location.pathname);
            return <Navigate to={redirectPath} replace />;
        }
    }

    // Kiểm tra quyền truy cập route dựa trên role
    if (user && !canAccessRoute(user, location.pathname)) {
        const redirectPath = redirectTo || getRedirectRoute(user, location.pathname);
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
}