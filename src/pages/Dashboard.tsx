import React, { useState } from 'react';
import { Home, FileText, Building2, Key, Settings, BarChart3, Menu, X, LogOut } from 'lucide-react';
import type { Invoice } from '../types/invoice';
import { useAuth } from '../contexts/AuthContext';
import DashboardTab from './Dashboard/DashboardTab';
import InvoicesTab from './Dashboard/InvoicesTab';
import OrganizationsTab from './Dashboard/OrganizationsTab';
import ApiKeysTab from './Dashboard/ApiKeysTab';
import AnalyticsTab from './Dashboard/AnalyticsTab';
import SettingsTab from './Dashboard/SettingsTab';
import InvoiceDetail from '../components/InvoiceDetail';
import { Image } from 'rsuite';

const InvoiceDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'invoices', icon: FileText, label: 'Hóa đơn' },
        { id: 'organizations', icon: Building2, label: 'Tổ chức' },
        { id: 'apikeys', icon: Key, label: 'API Keys' },
        { id: 'analytics', icon: BarChart3, label: 'Thống kê' },
        { id: 'settings', icon: Settings, label: 'Cài đặt' }
    ];

    const renderInvoiceDetail = () => {
        if (!selectedInvoice) return null;
        return <InvoiceDetail data={selectedInvoice} open={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} />;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardTab />;
            case 'organizations': return <OrganizationsTab />;
            case 'apikeys': return <ApiKeysTab />;
            case 'invoices': return <InvoicesTab onSelectInvoice={setSelectedInvoice} />;
            case 'analytics': return <AnalyticsTab />;
            case 'settings': return <SettingsTab />;
            default: return <DashboardTab />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        {sidebarOpen && (
                            <div className="flex flex-col items-center justify-center mb-4">
                                <Image width={150} src="/logo.png" alt="Logo" className="rounded-lg" />
                                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    TrustInvoice
                                </span>
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
                    {renderContent()}
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {renderInvoiceDetail()}
        </div>
    );
};

export default InvoiceDashboard;