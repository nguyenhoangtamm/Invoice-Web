import React, { useEffect, useState, useMemo } from 'react';
import { Plus, FileText, BarChart3, Users, CreditCard, Eye } from 'lucide-react';
import type { Invoice } from '../../types/invoice';
import type { Organization } from '../../types/organization';
import { getDashboardStats, type DashboardStatsDto } from '../../api/services/dashboardService';
import { getOrganizationByMe } from '../../api/services/organizationService';
import { getInvoicesPaginated } from '../../api/services/invoiceService';
import { mockInvoices } from '../../data/mockInvoice';
import { useAuth } from '../../contexts/AuthContext';
import CreateInvoiceModal from '../../components/CreateInvoiceModal';

const DashboardTab: React.FC = () => {
    const [dashboardStats, setDashboardStats] = useState<DashboardStatsDto | null>(null);
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch dashboard stats
                const statsResponse = await getDashboardStats({});
                if (statsResponse.succeeded && statsResponse.data) {
                    setDashboardStats(statsResponse.data);
                }

                // Fetch organizations
                const orgResponse = await getOrganizationByMe();
                if (orgResponse.succeeded && orgResponse.data) {
                    setOrganizations(orgResponse.data);
                }

                // Fetch recent invoices
                const invoicesResponse = await getInvoicesPaginated(1, 4);
                if (invoicesResponse.succeeded && invoicesResponse.data) {
                    setRecentInvoices(invoicesResponse.data);
                } else {
                    // Fallback to mock data
                    setRecentInvoices(mockInvoices.slice(0, 4) as any);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Fallback to mock data
                setRecentInvoices(mockInvoices.slice(0, 4) as any);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);
    const handleCreateSuccess = (newInvoice: Invoice) => {
        setShowCreateModal(false);
    };
    const computedStats = useMemo(() => {
        const total = dashboardStats?.totalInvoices ?? 0;
        const totalRevenue = dashboardStats?.totalRevenue ?? 0;
        const totalCustomers = dashboardStats?.totalCustomers ?? 0;
        const avgInvoiceValue = dashboardStats?.avgInvoiceValue ?? 0;

        // Đếm số hóa đơn phát hành trong tháng hiện tại từ danh sách gần đây (best-effort)
        const now = new Date();
        const thisMonthCount = recentInvoices.filter(inv => {
            if (!inv.issuedDate) return false;
            const d = new Date(inv.issuedDate);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        return {
            total,
            thisMonth: thisMonthCount,
            pending: 0,
            totalRevenue,
            totalCustomers,
            avgInvoiceValue
        };
    }, [dashboardStats, recentInvoices]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    onClick={() => setShowCreateModal(true)}>
                    <Plus size={20} />
                    Tạo hóa đơn mới
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
                            <Users className="text-yellow-600" size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Tổng số</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Khách hàng</h3>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.totalCustomers}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <CreditCard className="text-purple-600" size={24} />
                        </div>
                        <span className="text-sm text-gray-500">Tổng doanh thu</span>
                    </div>
                    <h3 className="text-gray-600 text-sm mb-1">Doanh thu</h3>
                    <p className="text-3xl font-bold text-gray-900">{computedStats.totalRevenue.toLocaleString()} VND</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-4">
                        {recentInvoices.map((inv, idx) => (
                            <div key={(inv.invoiceNumber || inv.formNumber || idx).toString()} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="text-blue-600" size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{inv.invoiceNumber || inv.formNumber || 'Hóa đơn'}</p>
                                    <p className="text-sm text-gray-500">Ngày phát hành: {inv.issuedDate || '-'}</p>
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
                                        <h4 className="font-semibold text-gray-900">{org.organizationName}</h4>
                                        <p className="text-sm text-gray-600 mt-1">MST: {org.organizationTaxId}</p>
                                        <p className="text-sm text-gray-600">{org.organizationAddress}</p>
                                    </div>
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
            {/* Create Invoice Modal */}
            <CreateInvoiceModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default DashboardTab;
