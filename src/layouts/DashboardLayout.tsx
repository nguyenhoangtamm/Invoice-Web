import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Building2, Key, Settings, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
        { id: 'invoices', icon: FileText, label: 'Hóa đơn', path: '/dashboard/invoices' },
        { id: 'organizations', icon: Building2, label: 'Tổ chức', path: '/dashboard/organizations' },
        { id: 'apikeys', icon: Key, label: 'API Keys', path: '/dashboard/api-keys' },
        { id: 'analytics', icon: BarChart3, label: 'Thống kê', path: '/dashboard/analytics' },
        { id: 'settings', icon: Settings, label: 'Cài đặt', path: '/dashboard/settings' }
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const isActiveRoute = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        {sidebarOpen && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="text-white" size={20} />
                                </div>
                                <span className="font-bold text-xl">InvoiceHub</span>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActiveRoute(item.path)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon size={20} />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                {sidebarOpen && (
                    <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Đăng xuất</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;