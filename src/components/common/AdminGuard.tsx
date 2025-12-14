import React from 'react';
import PermissionMiddleware, { createPermission } from './PermissionMiddleware';

interface AdminGuardProps {
    children: React.ReactNode;
    showUnauthorizedPage?: boolean;
    redirectTo?: string;
}

/**
 * AdminGuard - Bảo vệ routes chỉ dành cho Admin
 * @param children - Component con cần được bảo vệ
 * @param showUnauthorizedPage - Hiển thị trang không có quyền thay vì redirect (mặc định: false)
 * @param redirectTo - Đường dẫn redirect khi không có quyền (mặc định: /dashboard)
 */
export default function AdminGuard({
    children,
    showUnauthorizedPage = false,
    redirectTo = '/dashboard'
}: AdminGuardProps) {
    return (
        <PermissionMiddleware
            permission={createPermission.adminOnly(redirectTo, showUnauthorizedPage)}
        >
            {children}
        </PermissionMiddleware>
    );
}