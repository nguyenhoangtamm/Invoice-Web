import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface UnauthorizedAccessProps {
    message?: string;
    showBackButton?: boolean;
    allowedRoles?: string[];
}

/**
 * Component hiển thị khi user không có quyền truy cập
 */
export default function UnauthorizedAccess({
    message = "Bạn không có quyền truy cập vào trang này",
    showBackButton = true,
    allowedRoles
}: UnauthorizedAccessProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Redirect về trang phù hợp với role của user
        if (user?.role === 'Admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const getRoleMessage = () => {
        if (!allowedRoles || allowedRoles.length === 0) return '';

        return `Trang này chỉ dành cho: ${allowedRoles.join(', ')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div>
                    <div className="mx-auto h-20 w-20 text-red-500 mb-4">
                        <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-.001-7.999A4 4 0 0110 10z"
                            />
                        </svg>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Không có quyền truy cập
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        {message}
                    </p>

                    {getRoleMessage() && (
                        <p className="mt-2 text-xs text-gray-500">
                            {getRoleMessage()}
                        </p>
                    )}

                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="text-sm text-yellow-800">
                            <strong>Role hiện tại:</strong> {user?.role || 'Không xác định'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {showBackButton && (
                        <button
                            onClick={handleGoBack}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Quay lại trang chủ
                        </button>
                    )}

                    <div className="text-sm space-x-4">
                        <Link
                            to="/dashboard"
                            className="text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            Dashboard
                        </Link>
                        {user?.role === 'Admin' && (
                            <Link
                                to="/admin/dashboard"
                                className="text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Admin Panel
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}