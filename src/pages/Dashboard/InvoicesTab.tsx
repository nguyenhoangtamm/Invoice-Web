import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Eye, Download, Trash2, Search, Filter, FileText } from 'lucide-react';
import { Input, Message, SelectPicker, toaster } from 'rsuite';
import type { Invoice, CreateInvoiceRequest } from '../../types/invoice';
import { InvoiceStatus } from '../../enums/invoiceEnum';
import { downloadInvoiceFile, getInvoicesPaginatedByUser } from '../../api/services/invoiceService';
import { mockInvoices } from '../../data/mockInvoice';
import { useAuth } from '../../contexts/AuthContext';
import CreateInvoiceModal from '../../components/CreateInvoiceModal';
import Table, { TableColumn } from '../../components/common/table';
import { debounce, getSimplifiedInvoiceStatusText, getSimplifiedInvoiceStatusColor } from '../../utils/helpers';

interface InvoicesTabProps {
    onSelectInvoice: (invoice: Invoice) => void;
}

const InvoicesTab: React.FC<InvoicesTabProps> = ({
    onSelectInvoice,
}) => {
    const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(0); // 0-based index for table component
    const [invoicesPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for manual refetch
    const { user } = useAuth();
    const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                let statusParam: string | undefined;
                if (statusFilter === 'all') {
                    statusParam = undefined;
                } else if (statusFilter === 'recorded') {
                    // Map "recorded" to all non-draft statuses - server will handle this
                    statusParam = 'recorded';
                } else {
                    statusParam = statusFilter;
                }
                const searchParam = searchTerm.trim() || undefined;

                const response = await getInvoicesPaginatedByUser(
                    currentPage + 1,
                    invoicesPerPage,
                    statusParam,
                    searchParam
                ); // Convert to 1-based for API
                if (response.succeeded && response.data) {
                    setInvoiceList(response.data);
                    setTotalCount(response.totalCount || response.data.length);
                } else {
                    // Fallback to mock data khi API không thành công
                    setInvoiceList(mockInvoices);
                    setTotalCount(mockInvoices.length);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
                // Fallback to mock data khi có lỗi
                setInvoiceList(mockInvoices);
                setTotalCount(mockInvoices.length);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchInvoices();
        }
    }, [user, currentPage, invoicesPerPage, statusFilter, searchTerm, refreshTrigger]);

    const deleteInvoice = (invoiceNumber: string | undefined) => {
        if (!invoiceNumber) return;
        setInvoiceList(prev => prev.filter(inv => inv.invoiceNumber !== invoiceNumber));
    };

    const handleCreateSuccess = (newInvoice: Invoice) => {
        // Refresh dữ liệu sau khi tạo hóa đơn mới
        setCurrentPage(0);
        setRefreshTrigger(prev => prev + 1); // Trigger refetch
        setShowCreateModal(false);
    };

    const handlePageChange = (newPage: number) => {
        if (!loading) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (newPageSize: number) => {
        // Reset to first page when changing page size
        setCurrentPage(0);
        // Note: invoicesPerPage is const, but we could make it state if needed
    };

    // Debounced search function to avoid too many API calls
    const debouncedSearch = useCallback(
        debounce((searchValue: string) => {
            setSearchTerm(searchValue);
            setCurrentPage(0);
        }, 500),
        []
    );

    // API sẽ handle filtering, không cần filter phía client
    const paginatedInvoices = invoiceList;

    const handleSearchChange = (value: string) => {
        debouncedSearch(value);
    };

    const handleStatusFilterChange = (value: string | null) => {
        setStatusFilter(value || 'all');
        setCurrentPage(0);
    };
    // Download invoice file
    const handleDownload = async (invoiceId: number) => {
        const invoice = invoiceList.find(inv => inv.id === invoiceId);
        if (!invoice) return;
        // Check if invoice has attachment files
        if (!invoice.attachmentFileIds || invoice.attachmentFileIds.length === 0) {
            toaster.push(
                <Message type="warning" showIcon>
                    Không có tệp đính kèm để tải xuống
                </Message>
            );
            return;
        }

        try {
            // Download first file (or you can show a selection if multiple files)
            const fileId = invoice.attachmentFileIds[0];
            setDownloadingFileId(fileId);

            const blob = await downloadInvoiceFile(fileId);

            // Create download link and trigger download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${invoice.invoiceNumber || "invoice"}-${fileId}`;
            a.click();
            URL.revokeObjectURL(url);

            toaster.push(
                <Message type="success" showIcon>
                    Tải xuống tệp thành công
                </Message>
            );
        } catch (error) {
            console.error('Error downloading file:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Có lỗi xảy ra khi tải xuống tệp
                </Message>
            );
        } finally {
            setDownloadingFileId(null);
        }
    };

    // Define table columns
    const tableColumns: TableColumn[] = [
        {
            key: 'invoiceNumber',
            label: 'Số hóa đơn',
            dataKey: 'invoiceNumber',
            width: 150,
            render: (rowData: Invoice) => (
                <span className="font-medium text-gray-900">{rowData.invoiceNumber}</span>
            )
        },
        {
            label: 'Mã tra cứu',
            key: 'lookupCode',
            dataKey: 'lookupCode',
            width: 150,
            render: (rowData: Invoice) => (
                <span className="text-gray-600">{rowData.lookupCode || '-'}</span>
            )
        },
        {
            key: 'customerName',
            label: 'Khách hàng',
            dataKey: 'customerName',
            width: 200,
            render: (rowData: Invoice) => (
                <span className="text-gray-600">{rowData.customerName || '-'}</span>
            ),
            flexGrow: 1,
        },
        {
            key: 'issuedDate',
            label: 'Ngày phát hành',
            dataKey: 'issuedDate',
            width: 220,
            render: (rowData: Invoice) => (
                <span className="text-gray-600">{rowData.issuedDate || '-'}</span>
            )

        },
        {
            key: 'totalAmount',
            label: 'Số tiền',
            dataKey: 'totalAmount',
            width: 150,
            align: 'right',
            render: (rowData: Invoice) => (
                <span className="font-semibold text-gray-900">
                    {rowData.totalAmount?.toLocaleString('vi-VN')} {rowData.currency || 'VND'}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            dataKey: 'status',
            width: 210,
            render: (rowData: Invoice) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(rowData.status)}`}>
                    {getStatusLabel(rowData.status)}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Hành động',
            isAction: true,
            width: 120,
            render: (rowData: Invoice) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => onSelectInvoice(rowData)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Xem chi tiết"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Tải xuống"
                    >
                        <Download size={16} onClick={() => handleDownload(rowData.id)} />
                    </button>
                    <button
                        onClick={() => deleteInvoice(rowData.invoiceNumber)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    // Map InvoiceStatus enum to human-friendly Vietnamese labels and CSS classes
    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: String(InvoiceStatus.Draft), label: 'Bản nháp' },
        { value: 'recorded', label: 'Đã ghi nhận' },
    ];

    const getStatusLabel = (status?: number) => {
        if (status == null) return '-';
        return getSimplifiedInvoiceStatusText(status);
    };

    const getStatusClass = (status?: number) => {
        if (status == null) return 'bg-gray-100 text-gray-700';
        return getSimplifiedInvoiceStatusColor(status);
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
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm theo số hóa đơn hoặc tên khách hàng..."
                            onChange={handleSearchChange}
                            className="pl-10"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <SelectPicker
                            data={statusOptions}
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            placeholder="Chọn trạng thái"
                            searchable={false}
                            cleanable={false}
                            block
                        />
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table
                    data={paginatedInvoices}
                    columns={tableColumns}
                    loading={loading}
                    showPagination={true}
                    totalCount={totalCount}
                    pageIndex={currentPage}
                    pageSize={invoicesPerPage}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    emptyText="Không tìm thấy hóa đơn"
                    loadingText="Đang tải dữ liệu..."
                    className="rounded-none"
                    cellBordered={true}
                    hover={true}
                />
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
