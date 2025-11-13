import React, { useEffect, useMemo, useState } from 'react';
import { Home, FileText, Building2, Key, Settings, BarChart3, Users, CreditCard, Menu, X, Plus, Copy, Eye, EyeOff, Trash2, Download } from 'lucide-react';
import { useCompanyInfo, useDashboardStats } from '../hooks/useApi';
import { apiClient } from '../api/apiClient';
import type { Invoice } from '../types/invoice';

const InvoiceDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'Production Key', key: 'ik_prod_a1b2c3d4e5f6g7h8', created: '2025-01-15', lastUsed: '2025-11-13' }
    ]);
    const [organizations, setOrganizations] = useState<{ id: string | number; name: string; taxCode: string; status?: string; }[]>([]);
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

    const { data: dashboardStats } = useDashboardStats();
    const { data: companyInfo } = useCompanyInfo();

    useEffect(() => {
        if (companyInfo) {
            setOrganizations([
                { id: companyInfo.id, name: companyInfo.name, taxCode: companyInfo.tax_code, status: 'active' }
            ]);
        }
    }, [companyInfo]);

    useEffect(() => {
        // Lấy 4 hóa đơn gần đây từ fake API
        const fetchRecent = async () => {
            const res = await apiClient.getInvoices(1, 4);
            if (res.success && res.data) {
                setRecentInvoices(res.data.data);
            }
        };
        fetchRecent();
    }, []);

    const computedStats = useMemo(() => {
        const total = dashboardStats?.totalInvoices ?? 0;
        const pending = dashboardStats?.pendingInvoices ?? 0;

        // Đếm số hóa đơn phát hành trong tháng hiện tại từ danh sách gần đây (best-effort)
        const now = new Date();
        const thisMonthCount = recentInvoices.filter(inv => {
            if (!inv.issued_date) return false;
            const d = new Date(inv.issued_date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        return {
            total,
            thisMonth: thisMonthCount,
            pending,
            stored: 245.8 // chưa có chỉ số trong mock, tạm giữ nguyên
        };
    }, [dashboardStats, recentInvoices]);

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'invoices', icon: FileText, label: 'Hóa đơn' },
        { id: 'organizations', icon: Building2, label: 'Tổ chức' },
        { id: 'apikeys', icon: Key, label: 'API Keys' },
        { id: 'analytics', icon: BarChart3, label: 'Thống kê' },
        { id: 'settings', icon: Settings, label: 'Cài đặt' }
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const generateApiKey = () => {
        const newKey = {
            id: apiKeys.length + 1,
            name: `API Key ${apiKeys.length + 1}`,
            key: `ik_prod_${Math.random().toString(36).substr(2, 16)}`,
            created: new Date().toISOString().split('T')[0],
            lastUsed: 'Chưa sử dụng'
        };
        setApiKeys([...apiKeys, newKey]);
    };

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus size={20} />
                    Tải hóa đơn mới
                </button>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Chào mừng đến với Invoice Storage</h2>
                <p className="text-blue-100">Quản lý và lưu trữ hóa đơn điện tử một cách an toàn và hiệu quả</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <span className="text-sm text-gray-500">24h</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Tổng hóa đơn</h3>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.total}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <BarChart3 className="text-green-600" size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Tháng này</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Hóa đơn mới</h3>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.thisMonth}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <FileText className="text-yellow-600" size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Đang xử lý</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Chờ xác nhận</h3>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.pending}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <CreditCard className="text-purple-600" size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Tổng dung lượng</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Đã sử dụng</h3>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.stored} MB</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {recentInvoices.map((inv, idx) => (
                            <div key={(inv.invoice_number || inv.form_number || idx).toString()} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="text-blue-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{inv.invoice_number || inv.form_number || 'Hóa đơn'}</p>
                                    <p className="text-sm text-gray-500">Ngày phát hành: {inv.issued_date || '-'}</p>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700">
                                    <Eye size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Tổ chức của bạn</h3>
                    <div className="space-y-4">
                        {organizations.map((org) => (
                            <div key={org.id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{org.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">MST: {org.taxCode}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        Hoạt động
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2">
                            <Plus size={20} />
                            Thêm tổ chức mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOrganizations = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Tổ chức</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus size={20} />
                    Thêm tổ chức
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {organizations.map((org, index) => (
                    <div key={org.id} className={`p-6 ${index !== organizations.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Building2 className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                                    <p className="text-gray-600 mt-1">Mã số thuế: {org.taxCode}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-sm text-gray-500">ID: ORG-{org.id}</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            Hoạt động
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                    <Settings size={20} />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderApiKeys = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
                    <p className="text-gray-600 mt-1">Quản lý API keys để tích hợp với hệ thống của bạn</p>
                </div>
                <button
                    onClick={generateApiKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tạo API Key
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    ⚠️ Cấu hình whitelist endpoints để ngăn chặn sử dụng trái phép. API keys có quyền truy cập đầy đủ vào tài khoản của bạn.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {apiKeys.map((apiKey, index) => (
                    <div key={apiKey.id} className={`p-6 ${index !== apiKeys.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Key className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-sm text-gray-500">Tạo: {apiKey.created}</span>
                                        <span className="text-sm text-gray-500">Sử dụng: {apiKey.lastUsed}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <code className="text-sm font-mono text-gray-700">
                                {showApiKey[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                            </code>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowApiKey(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                >
                                    {showApiKey[apiKey.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(apiKey.key)}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng API</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">1. Authentication</h4>
                        <div className="bg-gray-900 rounded-lg p-4">
                            <code className="text-green-400 text-sm">
                                curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                                &nbsp;&nbsp;https://api.invoicestorage.vn/v1/invoices
                            </code>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">2. Upload Invoice</h4>
                        <div className="bg-gray-900 rounded-lg p-4">
                            <code className="text-green-400 text-sm">
                                curl -X POST \<br />
                                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                                &nbsp;&nbsp;-F "file=@invoice.pdf" \<br />
                                &nbsp;&nbsp;https://api.invoicestorage.vn/v1/upload
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return renderDashboard();
            case 'organizations': return renderOrganizations();
            case 'apikeys': return renderApiKeys();
            case 'invoices':
                return (
                    <div className="text-center py-20">
                        <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Hóa đơn</h2>
                        <p className="text-gray-600">Tính năng đang được phát triển</p>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="text-center py-20">
                        <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thống kê & Phân tích</h2>
                        <p className="text-gray-600">Tính năng đang được phát triển</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="text-center py-20">
                        <Settings size={64} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt</h2>
                        <p className="text-gray-600">Tính năng đang được phát triển</p>
                    </div>
                );
            default: return renderDashboard();
        }
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
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === item.id
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
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                PA
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Premium User</p>
                                <p className="text-sm text-gray-500">0 API Credits</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDashboard;