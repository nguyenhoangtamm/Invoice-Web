import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="h-9"
                    />

                    <div>
                        <div className="text-gray-700 font-semibold">TrustInvoice</div>
                        <div className="text-xs text-gray-500">Tra cứu nhanh - hiển thị chi tiết hóa đơn</div>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-gray-600">Xin chào, {user?.fullName || user?.username}</span>
                            {user?.role === 'Admin' && (
                                <Link
                                    to="/admin"
                                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md transition-colors"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <a className="text-sm text-gray-600 hover:text-gray-800" href="#">
                                Hỗ trợ
                            </a>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
