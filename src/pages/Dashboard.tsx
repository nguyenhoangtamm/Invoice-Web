import React, { useEffect, useMemo, useState } from 'react';
import { Home, FileText, Building2, Key, Settings, BarChart3, Users, CreditCard, Menu, X, Plus, Copy, Eye, EyeOff, Trash2, Download, Search, Filter, ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Share2, FileJson, ArrowLeft, LogOut } from 'lucide-react';
import type { Invoice } from '../types/invoice';
import { mockInvoices } from '../data/mockInvoice';
import { invoiceService } from '../api/services/invoiceService';
import { dashboardService } from '../api/services/dashboardService';
import { organizationService } from '../api/services/organizationService';
import type { DashboardStatsDto } from '../api/services/dashboardService';
import type { Organization } from '../types/organization';
import { useAuth } from '../contexts/AuthContext';
import { InvoiceStatus } from '../enums/invoiceEnum';

const InvoiceDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});
    const [apiKeys, setApiKeys] = useState([
        { id: 1, name: 'Production Key', key: 'ik_prod_a1b2c3d4e5f6g7h8', created: '2025-01-15', lastUsed: '2025-11-13' }
    ]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage] = useState(10);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [blockchainStatus, setBlockchainStatus] = useState<'verified' | 'pending' | 'failed' | null>(null);
    const [blockchainDetails, setBlockchainDetails] = useState<{
        transactionHash: string;
        blockNumber: string;
        timestamp: string;
        gasUsed: string;
    } | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStatsDto | null>(null);

    const { logout, user } = useAuth();

    useEffect(() => {
        // Fetch dashboard stats
        const fetchDashboardStats = async () => {
            try {
                const response = await dashboardService.getDashboardStats({});
                if (response.succeeded && response.data) {
                    setDashboardStats(response.data);
                } else {
                    console.error('Failed to fetch dashboard stats:', response.message);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        // Fetch organizations
        const fetchOrganizations = async () => {

            try {
                const response = await organizationService.getOrganizationByMe();
                if (response.succeeded && response.data) {
                    // Transform GetByUserResponse to Organization format
                    const orgData = response.data?.data;
                    const organization: Organization = {
                        id: orgData.id.toString(),
                        name: orgData.organizationName,
                        taxCode: orgData.organizationTaxId,
                        address: orgData.organizationAddress,
                        phone: orgData.organizationPhone,
                        email: orgData.organizationEmail,
                        isActive: true, // Assuming active since user has access
                        createdAt: '', // Not provided in response
                        updatedAt: ''  // Not provided in response
                    };
                    console.log('Fetched organization:', organization);
                    setOrganizations([organization]);
                } else {
                    console.error('Failed to fetch organization:', response.message);
                    setOrganizations([]);
                }
            } catch (error) {
                console.error('Error fetching organization:', error);
                setOrganizations([]);
            }
        };

        // Lấy 4 hóa đơn gần đây từ API
        const fetchRecent = async () => {
            try {
                const res = await invoiceService.getInvoicesPaginated(1, 4);
                if (res.succeeded && res.data) {
                    setRecentInvoices(res.data.data);
                } else {
                    setRecentInvoices([]);
                }
            } catch (error) {
                console.error('Error fetching recent invoices:', error);
                // Fallback to mock data
                setRecentInvoices(mockInvoices.slice(0, 4) as any);
            }
        };

        fetchDashboardStats();
        fetchOrganizations();
        fetchRecent();

        // Lấy danh sách tất cả hóa đơn cho trang Invoices
        setInvoiceList(mockInvoices);
        setCurrentPage(1);
    }, [user]);

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

    const deleteInvoice = (invoiceNumber: string | undefined) => {
        if (!invoiceNumber) return;
        setInvoiceList(prev => prev.filter(inv => inv.invoiceNumber !== invoiceNumber));
    };

    const verifyBlockchain = async () => {
        // Simulate blockchain verification
        setBlockchainStatus('pending');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const isVerified = Math.random() > 0.1; // 90% success rate

        if (isVerified) {
            setBlockchainStatus('verified');
            setBlockchainDetails({
                transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
                blockNumber: '19' + Math.floor(Math.random() * 1000000).toString(),
                timestamp: new Date().toISOString(),
                gasUsed: (Math.random() * 50000 + 21000).toFixed(0)
            });
        } else {
            setBlockchainStatus('failed');
        }
    };

    const filteredInvoices = useMemo(() => {
        return invoiceList.filter(inv => {
            const matchesSearch = (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
            const statusVal = inv.status != null ? String(inv.status) : '';
            const matchesStatus = statusFilter === 'all' || statusVal.toLowerCase().includes(statusFilter.toLowerCase());
            return matchesSearch && matchesStatus;
        });
    }, [invoiceList, searchTerm, statusFilter]);

    const paginatedInvoices = useMemo(() => {
        const startIndex = (currentPage - 1) * invoicesPerPage;
        const endIndex = startIndex + invoicesPerPage;
        return filteredInvoices.slice(startIndex, endIndex);
    }, [filteredInvoices, currentPage, invoicesPerPage]);

    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

    const renderInvoiceDetail = () => {
        if (!selectedInvoice) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => {
                                    setSelectedInvoice(null);
                                    setBlockchainStatus(null);
                                    setBlockchainDetails(null);
                                }}
                                className="p-2 hover:bg-white rounded-lg transition"
                            >
                                <ArrowLeft size={24} className="text-gray-700" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Chi tiết hóa đơn</h2>
                                <p className="text-gray-600 text-sm mt-1">{selectedInvoice.invoiceNumber}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedInvoice(null);
                                setBlockchainStatus(null);
                                setBlockchainDetails(null);
                            }}
                            className="p-2 hover:bg-white rounded-lg transition"
                        >
                            <X size={24} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Company Info */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin bán hàng</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-medium">CÔNG TY TNHH CÔNG NGHỆ ABC</p>
                                    <p className="text-sm text-gray-600">123 Nguyễn Trãi, Quận 1, TP.HCM</p>
                                    <p className="text-sm text-gray-600">MST: 0123456789</p>
                                    <p className="text-sm text-gray-600">Email: info@abc-tech.vn</p>
                                    <p className="text-sm text-gray-600">Tel: 028-12345678</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin khách hàng</h3>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-medium">{selectedInvoice.customerName}</p>
                                    <p className="text-sm text-gray-600">{selectedInvoice.customerAddress}</p>
                                    <p className="text-sm text-gray-600">Email: {selectedInvoice.customerEmail}</p>
                                    <p className="text-sm text-gray-600">Tel: {selectedInvoice.customerPhone}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Invoice Details */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Mẫu số hóa đơn</p>
                                <p className="text-lg font-bold text-gray-900">{selectedInvoice.formNumber}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Ký hiệu hóa đơn</p>
                                <p className="text-lg font-bold text-gray-900">{selectedInvoice.serial}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Ngày phát hành</p>
                                <p className="text-lg font-bold text-gray-900">{selectedInvoice.issuedDate}</p>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết hóa đơn</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border border-gray-200 rounded-lg">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">STT</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Nội dung</th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-700">ĐVT</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">SL</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Đơn giá</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedInvoice.lines?.map((line) => (
                                            <tr key={line.lineNumber} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900">{line.lineNumber}</td>
                                                <td className="px-4 py-3 text-gray-900">{line.description}</td>
                                                <td className="px-4 py-3 text-center text-gray-600">{line.unit}</td>
                                                <td className="px-4 py-3 text-right text-gray-900 font-medium">{line.quantity}</td>
                                                <td className="px-4 py-3 text-right text-gray-900">{line.unitPrice?.toLocaleString('vi-VN')}</td>
                                                <td className="px-4 py-3 text-right text-gray-900 font-semibold">{line.lineTotal?.toLocaleString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="flex justify-end">
                            <div className="w-80 space-y-2 bg-gray-50 rounded-lg p-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Cộng tiền hàng:</span>
                                    <span className="text-gray-900 font-medium">{selectedInvoice.subTotal?.toLocaleString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Chiết khấu:</span>
                                    <span className="text-gray-900 font-medium">{selectedInvoice.discountAmount?.toLocaleString('vi-VN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tiền thuế:</span>
                                    <span className="text-gray-900 font-medium">{selectedInvoice.taxAmount?.toLocaleString('vi-VN')}</span>
                                </div>
                                <hr className="border-gray-200 my-3" />
                                <div className="flex justify-between">
                                    <span className="text-gray-900 font-bold">Tổng cộng:</span>
                                    <span className="text-2xl font-bold text-blue-600">{selectedInvoice.totalAmount?.toLocaleString('vi-VN')}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">({selectedInvoice.currency})</p>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Blockchain Verification */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <FileJson size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Xác thực Blockchain</h3>
                                        <p className="text-sm text-gray-600">Xác minh tính xác thực của hóa đơn trên blockchain</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hash Display */}
                            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Mã hash hóa đơn:</p>
                                <p className="text-xs font-mono text-gray-900 break-all bg-gray-50 p-3 rounded border border-gray-200">
                                    {selectedInvoice.immutableHash}
                                </p>
                            </div>

                            {/* Verification Status */}
                            {blockchainStatus === null ? (
                                <button
                                    onClick={verifyBlockchain}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} />
                                    Xác thực trên Blockchain
                                </button>
                            ) : blockchainStatus === 'pending' ? (
                                <div className="flex items-center justify-center gap-3 py-4">
                                    <Clock size={20} className="text-yellow-600 animate-spin" />
                                    <span className="text-yellow-700 font-medium">Đang xác thực...</span>
                                </div>
                            ) : blockchainStatus === 'verified' && blockchainDetails ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                                        <CheckCircle size={24} className="text-green-600" />
                                        <span className="text-green-700 font-medium">Xác thực thành công! Hóa đơn hợp lệ</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4 border border-gray-200">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 mb-1">TX Hash:</p>
                                            <p className="text-xs font-mono text-gray-900 truncate">{blockchainDetails.transactionHash}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 mb-1">Block Number:</p>
                                            <p className="text-xs font-mono text-gray-900">{blockchainDetails.blockNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 mb-1">Timestamp:</p>
                                            <p className="text-xs text-gray-900">{new Date(blockchainDetails.timestamp).toLocaleString('vi-VN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 mb-1">Gas Used:</p>
                                            <p className="text-xs font-mono text-gray-900">{blockchainDetails.gasUsed}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <AlertCircle size={24} className="text-red-600" />
                                    <span className="text-red-700 font-medium">Xác thực thất bại. Vui lòng thử lại.</span>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setBlockchainStatus(null);
                                    setBlockchainDetails(null);
                                }}
                                className="w-full mt-4 border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Xoá Kết quả
                            </button>
                        </div>

                        {/* Additional Notes */}
                        {selectedInvoice.note && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú:</p>
                                <p className="text-sm text-gray-600">{selectedInvoice.note}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderInvoices = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Hóa đơn</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus size={20} />
                    Tải hóa đơn mới
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo số hóa đơn hoặc tên khách hàng..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="Đã phát hành">Đã phát hành</option>
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Quá hạn">Quá hạn</option>
                    </select>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {paginatedInvoices.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số hóa đơn</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Khách hàng</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ngày phát hành</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số tiền</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedInvoices.map((invoice) => (
                                        <tr key={invoice.invoiceNumber} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{invoice.customerName || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{invoice.issuedDate || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                {invoice.totalAmount?.toLocaleString('vi-VN')} {invoice.currency || 'VND'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.status === InvoiceStatus.BlockchainConfirmed ? 'bg-green-100 text-green-700' :
                                                    invoice.status === InvoiceStatus.Uploaded ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {invoice.status || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedInvoice(invoice)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                                        <Download size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteInvoice(invoice.invoiceNumber)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Hiển thị {paginatedInvoices.length > 0 ? (currentPage - 1) * invoicesPerPage + 1 : 0} đến {Math.min(currentPage * invoicesPerPage, filteredInvoices.length)} trong {filteredInvoices.length} kết quả
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg font-medium transition ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy hóa đơn</h3>
                        <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                )}
            </div>
        </div>
    );

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
                                        <h4 className="font-semibold text-gray-900">{org.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">MST: {org.taxCode}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${org.isActive
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {org.isActive ? 'Hoạt động' : 'Không hoạt động'}
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${org.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {org.isActive ? 'Hoạt động' : 'Không hoạt động'}
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
            case 'invoices': return renderInvoices();
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
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                PA
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Premium User</p>
                                <p className="text-sm text-gray-500">0 API Credits</p>
                            </div>
                        </div>
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