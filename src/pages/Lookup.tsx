import React, { useState, useCallback } from "react";
import InvoiceDetail from "../components/InvoiceDetail";
import type { Invoice, InvoiceLookUp } from "../types/invoice";
import { downloadInvoiceFile, getInvoicesPaginatedLookUp } from "../api/services/invoiceService";
import { Search, Eye, Download, FileText, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { getSimplifiedInvoiceStatusText, getSimplifiedInvoiceStatusColor, debounce, formatDateTime } from "../utils/helpers";
import { Input, InputGroup, Message, toaster } from "rsuite";
import Table, { TableColumn } from "../components/common/table";

export default function Lookup() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceLookUp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<InvoiceLookUp[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0-based index for table component
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [invoicesPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(null);

  const fetchInvoices = async (page: number) => {
    setLoading(true);
    try {
      const result = await getInvoicesPaginatedLookUp(page + 1, invoicesPerPage, searchTerm); // Convert to 1-based for API
      if (result.succeeded) {
        setSearchResults(result.data);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setCurrentPage(page);
      } else {
        setSearchResults([]);
        setTotalPages(0);
        setTotalCount(0);
        if (page === 0) setMessage("Không tìm thấy kết quả");
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  async function handleSearch() {
    setMessage(null);
    if (!searchTerm.trim()) return setMessage("Vui lòng nhập từ khóa tìm kiếm");
    setHasSearched(true);
    await fetchInvoices(0); // Start from page 0
  }

  const handlePageChange = (page: number) => {
    fetchInvoices(page);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setSearchTerm(searchValue);
      setCurrentPage(0);
    }, 500),
    []
  );

  const handleSearchTermChange = (value: string) => {
    debouncedSearch(value);
  };

  const getStatusLabel = (status?: number) => {
    if (status == null) return '-';
    return getSimplifiedInvoiceStatusText(status);
  };

  const getStatusClass = (status?: number) => {
    if (status == null) return 'bg-gray-100 text-gray-700';
    return getSimplifiedInvoiceStatusColor(status);
  };

  // Define table columns
  const tableColumns: TableColumn[] = [
    {
      label: 'Mã tra cứu',
      key: 'lookupCode',
      dataKey: 'lookupCode',
      width: 150,
      render: (rowData: InvoiceLookUp) => (
        <span className="text-gray-600">{rowData.lookupCode || '-'}</span>
      )
    },
    {
      key: 'customerName',
      label: 'Khách hàng',
      dataKey: 'customerName',
      width: 200,
      render: (rowData: InvoiceLookUp) => (
        <span className="text-gray-600">{rowData.customerName || '-'}</span>
      ),
      flexGrow: 1,
    },
    {
      key: 'issuedDate',
      label: 'Ngày phát hành',
      dataKey: 'issuedDate',
      width: 220,
      render: (rowData: InvoiceLookUp) => (
        <span className="text-gray-600">{formatDateTime(rowData.issuedDate) || '-'}</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Số tiền',
      dataKey: 'totalAmount',
      width: 150,
      align: 'right',
      render: (rowData: InvoiceLookUp) => (
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
      render: (rowData: InvoiceLookUp) => (
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
      render: (rowData: InvoiceLookUp) => (
        <div className="flex gap-1">
          <button
            onClick={() => {
              setSelectedInvoice(rowData);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleDownload(rowData.id)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Tải xuống"
          >
            <Download size={16} />
          </button>
        </div>
      )
    }
  ];
  // Download invoice file
  const handleDownload = async (invoiceId: number) => {
    const invoice = searchResults.find(inv => inv.id === invoiceId);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-8 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-white/30 hover:bg-white/20 transition-colors">
                <span className="text-blue-100 text-sm font-semibold">TrustInvoice</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">Tra Cứu Hóa Đơn</h1>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden backdrop-blur-sm border border-white/50">
              <div className="p-4 md:p-6">
                <div className="space-y-3">
                  <div>
                    <InputGroup inside>
                      <Input
                        value={searchTerm}
                        onChange={(value) => {
                          setSearchTerm(value);
                          setHasSearched(false);
                        }}
                        onPressEnter={handleSearch}
                        placeholder="Nhập số hóa đơn, tên khách hàng hoặc mã số thuế..."
                        size="lg"
                      />
                      <InputGroup.Addon>
                        <Search size={16} className="text-blue-600" />
                      </InputGroup.Addon>
                    </InputGroup>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Tìm Kiếm
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="mt-4 flex items-center gap-2 p-4 rounded-lg bg-amber-50 border-l-4 border-amber-400 text-amber-800 animate-fadeIn shadow-sm">
                <AlertCircle size={18} className="flex-shrink-0 text-amber-600" />
                <p className="font-medium text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {hasSearched && searchResults.length > 0 && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle size={24} className="text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Kết Quả Tìm Kiếm</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {totalCount} hóa đơn
                </span>
              </div>

              {/* Invoices Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table
                  data={searchResults}
                  columns={tableColumns}
                  loading={loading}
                  showPagination={true}
                  totalCount={totalCount}
                  pageIndex={currentPage}
                  pageSize={invoicesPerPage}
                  onPageChange={handlePageChange}
                  emptyText="Không tìm thấy hóa đơn"
                  loadingText="Đang tải dữ liệu..."
                  className="rounded-none"
                  cellBordered={true}
                  hover={true}
                />
              </div>
            </div>
          )}

          {hasSearched && searchResults.length === 0 && !loading && (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm">
              <FileText size={40} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy hóa đơn</h3>
              <p className="text-gray-600 text-sm">Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại thông tin</p>
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-80">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tìm kiếm hóa đơn</h2>
              <p className="text-gray-600 text-base">Nhập từ khóa tìm kiếm ở phần trên để bắt đầu</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">Tìm kiếm nhanh</h3>
              <p className="text-xs text-gray-700 leading-relaxed">Tìm hóa đơn theo số hóa đơn, tên khách hàng hoặc mã số thuế</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">Xem chi tiết</h3>
              <p className="text-xs text-gray-700 leading-relaxed">Nhấp vào hóa đơn trong danh sách để xem thông tin chi tiết</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">An toàn bảo mật</h3>
              <p className="text-xs text-gray-700 leading-relaxed">Thông tin hóa đơn được bảo vệ và xác thực an toàn</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <InvoiceDetail
        data={selectedInvoice as Invoice}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInvoice(null);
        }}
      />
    </div>
  );
}
