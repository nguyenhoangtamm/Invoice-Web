import React, { useState } from 'react';
import { ArrowLeft, X, CheckCircle, Clock, AlertCircle, FileJson } from 'lucide-react';
import type { Invoice } from '../../types/invoice';
import { useNavigate } from 'react-router-dom';


interface InvoiceDetailModalProps {
    invoice: Invoice;
    onClose: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
    invoice,
    onClose,
}) => {
    const navigate = useNavigate();
    const [blockchainStatus, setBlockchainStatus] = useState<'verified' | 'pending' | 'failed' | null>(null);
    const [blockchainDetails, setBlockchainDetails] = useState<{
        transactionHash: string;
        blockNumber: string;
        timestamp: string;
        gasUsed: string;
    } | null>(null);

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

    const handleClose = () => {
        setBlockchainStatus(null);
        setBlockchainDetails(null);
        onClose();
    };
    const handleBlockchainVerification = () => {
        navigate(`/blockchain-verify/${invoice.id}`);
        onClose(); // Close the modal
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white rounded-lg transition"
                        >
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Chi tiết hóa đơn</h2>
                            <p className="text-gray-600 text-sm mt-1">{invoice.invoiceNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
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
                                <p className="text-gray-900 font-medium">{invoice.customerName}</p>
                                <p className="text-sm text-gray-600">{invoice.customerAddress}</p>
                                <p className="text-sm text-gray-600">Email: {invoice.customerEmail}</p>
                                <p className="text-sm text-gray-600">Tel: {invoice.customerPhone}</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Invoice Details */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Mẫu số hóa đơn</p>
                            <p className="text-lg font-bold text-gray-900">{invoice.formNumber}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Ký hiệu hóa đơn</p>
                            <p className="text-lg font-bold text-gray-900">{invoice.serial}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-gray-600 mb-1">Ngày phát hành</p>
                            <p className="text-lg font-bold text-gray-900">{invoice.issuedDate}</p>
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
                                    {invoice.lines?.map((line) => (
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
                                <span className="text-gray-900 font-medium">{invoice.subTotal?.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Chiết khấu:</span>
                                <span className="text-gray-900 font-medium">{invoice.discountAmount?.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tiền thuế:</span>
                                <span className="text-gray-900 font-medium">{invoice.taxAmount?.toLocaleString('vi-VN')}</span>
                            </div>
                            <hr className="border-gray-200 my-3" />
                            <div className="flex justify-between">
                                <span className="text-gray-900 font-bold">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-blue-600">{invoice.totalAmount?.toLocaleString('vi-VN')}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">({invoice.currency})</p>
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
                                {invoice.immutableHash}
                            </p>
                        </div>

                        {/* Verification Status */}
                        {blockchainStatus === null ? (
                            <button
                                onClick={handleBlockchainVerification}
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
                    {invoice.note && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Ghi chú:</p>
                            <p className="text-sm text-gray-600">{invoice.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;
