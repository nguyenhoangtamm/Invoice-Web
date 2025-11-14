import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
    const location = useLocation();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/users', label: 'Người dùng' },
        { path: '/admin/organizations', label: 'Tổ chức' },
        { path: '/admin/roles', label: 'Vai trò' },
        { path: '/admin/menus', label: 'Menu' },
        { path: '/admin/invoices', label: 'Hóa đơn' },
        { path: '/admin/invoice-lines', label: 'Chi tiết HĐ' },
        { path: '/admin/invoice-batches', label: 'Lô hóa đơn' },
        { path: '/admin/api-keys', label: 'API Keys' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm">
                    <nav className="mt-8">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`block px-6 py-3 text-sm font-medium ${location.pathname === item.path
                                            ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 bg-white">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
            <footer className="text-center py-6 text-sm text-gray-500 bg-gray-200">
                © 2025 Admin Panel — Invoice Management
            </footer>
        </div>
    );
}