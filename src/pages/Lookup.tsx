import React, { useState } from "react";
import InvoiceDetail from "../components/InvoiceDetail";
import type { Invoice, InvoiceLookUp } from "../types/invoice";
import { getInvoicesPaginatedLookUp } from "../api/services/invoiceService";
import { Search, Eye, Download, Trash2, ChevronLeft, ChevronRight, FileText, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { InvoiceStatus } from "../enums/invoiceEnum";
import { mockInvoices } from "../data/mockInvoice";

export default function Lookup() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<InvoiceLookUp[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [invoicesPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchInvoices = async (page: number) => {
    setLoading(true);
    try {
      const result = await getInvoicesPaginatedLookUp(page, invoicesPerPage, searchTerm);
      if (result.succeeded) {
        setSearchResults(result.data);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setCurrentPage(page);
      } else {
        setSearchResults([]);
        setTotalPages(0);
        setTotalCount(0);
        if (page === 1) setMessage("Không tìm thấy kết quả");
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
    await fetchInvoices(1);
  }

  const handlePageChange = (page: number) => {
    fetchInvoices(page);
  };

  const paginatedResults = searchResults;

  const getStatusLabel = (status?: number) => {
    if (status == null) return '-';
    const statusOptions = [
      { value: InvoiceStatus.Uploaded, label: 'Đã upload' },
      { value: InvoiceStatus.IpfsStored, label: 'Đã lưu trên IPFS' },
      { value: InvoiceStatus.Batched, label: 'Đã tạo batch' },
      { value: InvoiceStatus.BlockchainConfirmed, label: 'Đã xác nhận trên blockchain' },
      { value: InvoiceStatus.Finalized, label: 'Hoàn tất' },
      { value: InvoiceStatus.IpfsFailed, label: 'Upload IPFS thất bại' },
      { value: InvoiceStatus.BlockchainFailed, label: 'Ghi blockchain thất bại' },
    ];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-12 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-full mb-6 border border-white/30 hover:bg-white/20 transition-colors">
                <Search size={20} className="text-blue-100" />
                <span className="text-blue-100 text-sm font-semibold">TrustInvoice</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Tìm Kiếm Hóa Đơn</h1>
              <p className="text-blue-100 text-lg md:text-xl font-light">Tra cứu thông tin hóa đơn của bạn một cách nhanh chóng và an toàn</p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/50">
              <div className="p-6 md:p-8">
                <div className="space-y-4">
                  <div>
                    <label className="flex text-sm font-bold text-gray-800 mb-3 items-center gap-2">
                      <Search size={18} className="text-blue-600" />
                      Tìm kiếm hóa đơn
                    </label>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Nhập số hóa đơn, tên khách hàng hoặc mã số thuế..."
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl text-base"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Tìm Kiếm
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="mt-6 flex items-center gap-3 p-5 rounded-xl bg-amber-50 border-l-4 border-amber-400 text-amber-800 animate-fadeIn shadow-md">
                <AlertCircle size={22} className="flex-shrink-0 text-amber-600" />
                <p className="font-semibold text-base">{message}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {hasSearched && searchResults.length > 0 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <CheckCircle size={28} className="text-green-500" />
                <h2 className="text-3xl font-bold text-gray-900">Kết Quả Tìm Kiếm</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {totalCount} hóa đơn
                </span>
              </div>

              {/* Invoices Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                      {paginatedResults.map((invoice) => (
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
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <Download size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Hiển thị {paginatedResults.length > 0 ? (currentPage - 1) * invoicesPerPage + 1 : 0} đến {Math.min(currentPage * invoicesPerPage, totalCount)} trong {totalCount} kết quả
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
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
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {hasSearched && searchResults.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Không tìm thấy hóa đơn</h3>
              <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại thông tin</p>
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6 opacity-80">🔍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Tìm kiếm hóa đơn</h2>
              <p className="text-gray-600 text-lg">Nhập từ khóa tìm kiếm ở phần trên để bắt đầu</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Tìm kiếm nhanh</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Tìm hóa đơn theo số hóa đơn, tên khách hàng hoặc mã số thuế</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Xem chi tiết</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Nhấp vào hóa đơn trong danh sách để xem thông tin chi tiết</p>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">An toàn bảo mật</h3>
              <p className="text-sm text-gray-700 leading-relaxed">Thông tin hóa đơn được bảo vệ và xác thực an toàn</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle size={28} className="text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Chi Tiết Hóa Đơn</h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedInvoice(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <InvoiceDetail data={selectedInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
