import React from 'react';
import PermissionMiddleware, { createPermission } from './PermissionMiddleware';

interface UserGuardProps {
    children: React.ReactNode;
    showUnauthorizedPage?: boolean;
    redirectTo?: string;
}

/**
 * UserGuard - Bảo vệ routes chỉ dành cho User thường (không phải Admin)
 * @param children - Component con cần được bảo vệ
 * @param showUnauthorizedPage - Hiển thị trang không có quyền thay vì redirect (mặc định: false)
 * @param redirectTo - Đường dẫn redirect khi không có quyền (mặc định: /admin/dashboard cho Admin)
 */
export default function UserGuard({
    children,
    showUnauthorizedPage = false,
    redirectTo = '/admin/dashboard'
}: UserGuardProps) {
    return (
        <PermissionMiddleware
            permission={createPermission.userOnly(redirectTo, showUnauthorizedPage)}
        >
            {children}
        </PermissionMiddleware>
    );
}