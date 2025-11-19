import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Eye, Download, Trash2, Search, Filter, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import type { Invoice, CreateInvoiceRequest } from '../../types/invoice';
import { InvoiceStatus } from '../../enums/invoiceEnum';
import { getInvoicesPaginated } from '../../api/services/invoiceService';
import { mockInvoices } from '../../data/mockInvoice';
import { useAuth } from '../../contexts/AuthContext';
import CreateInvoiceModal from '../../components/CreateInvoiceModal';

interface InvoicesTabProps {
    onSelectInvoice: (invoice: Invoice) => void;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({
    onSelectInvoice,
}) => {
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const response = await getInvoicesPaginated(1, 100); // Lấy nhiều hơn để có thể filter/search
                if (response.succeeded && response.data) {
                    setInvoiceList(response.data);
                } else {
                    // Fallback to mock data
                    setInvoiceList(mockInvoices);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
                // Fallback to mock data
                setInvoiceList(mockInvoices);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchInvoices();
        }
    }, [user]);

    const deleteInvoice = (invoiceNumber: string | undefined) => {
        if (!invoiceNumber) return;
        setInvoiceList(prev => prev.filter(inv => inv.invoiceNumber !== invoiceNumber));
    };

    const handleCreateSuccess = (newInvoice: Invoice) => {
        // Add new invoice to the list
        setInvoiceList(prev => [newInvoice, ...prev]);
        setShowCreateModal(false);
    };
    const filteredInvoices = useMemo(() => {
        return invoiceList.filter(inv => {
            const matchesSearch = (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (inv.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || (inv.status != null && inv.status === Number(statusFilter));
            return matchesSearch && matchesStatus;
        });
    }, [invoiceList, searchTerm, statusFilter]);

    const paginatedInvoices = useMemo(() => {
        const startIndex = (currentPage - 1) * invoicesPerPage;
        const endIndex = startIndex + invoicesPerPage;
        return filteredInvoices.slice(startIndex, endIndex);
    }, [filteredInvoices, currentPage, invoicesPerPage]);

    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    // Map InvoiceStatus enum to human-friendly Vietnamese labels and CSS classes
    const statusOptions = [
        { value: InvoiceStatus.Uploaded, label: 'Đã upload' },
        { value: InvoiceStatus.IpfsStored, label: 'Đã lưu trên IPFS' },
        { value: InvoiceStatus.Batched, label: 'Đã tạo batch' },
        { value: InvoiceStatus.BlockchainConfirmed, label: 'Đã xác nhận trên blockchain' },
        { value: InvoiceStatus.Finalized, label: 'Hoàn tất' },
        { value: InvoiceStatus.IpfsFailed, label: 'Upload IPFS thất bại' },
        { value: InvoiceStatus.BlockchainFailed, label: 'Ghi blockchain thất bại' },
    ];

    const getStatusLabel = (status?: number) => {
        if (status == null) return '-';
        const opt = statusOptions.find(o => o.value === status);
        return opt ? opt.label : String(status);
    };

    const getStatusClass = (status?: number) => {
        if (status == null) return 'bg-gray-100 text-gray-700';
        if (status === InvoiceStatus.BlockchainConfirmed || status === InvoiceStatus.Finalized) return 'bg-green-100 text-green-700';
        if (status === InvoiceStatus.Uploaded || status === InvoiceStatus.IpfsStored || status === InvoiceStatus.Batched) return 'bg-yellow-100 text-yellow-700';
        if (status === InvoiceStatus.IpfsFailed || status === InvoiceStatus.BlockchainFailed) return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
    };

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
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Hóa đơn</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Tạo hóa đơn mới
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <FileText size={20} />
                        Tải hóa đơn từ file
                    </button>
                </div>
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
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
                        ))}
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
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(invoice.status)}`}>
                                                    {getStatusLabel(invoice.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onSelectInvoice(invoice)}
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
                                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
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
                                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
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

            {/* Create Invoice Modal */}
            <CreateInvoiceModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default InvoicesTab;
