import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, FileJson, Shield } from 'lucide-react';
import { blockchainService, BlockchainVerificationResponse } from '../api/services/blockchainService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDateTime } from '../utils/helpers';

interface InvoiceComparisonProps {
    title: string;
    invoice: any;
    variant: 'offchain' | 'onchain';
}

const InvoiceComparison: React.FC<InvoiceComparisonProps> = ({ title, invoice, variant }) => {
    const bgColor = variant === 'offchain' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
    const iconColor = variant === 'offchain' ? 'text-blue-600' : 'text-green-600';

    return (
        <div className={`${bgColor} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-4">
                {variant === 'offchain' ? (
                    <FileJson className={`${iconColor} w-5 h-5`} />
                ) : (
                    <Shield className={`${iconColor} w-5 h-5`} />
                )}
                <h3 className="font-semibold text-gray-800">{title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Số hóa đơn:</p>
                        <p className="text-sm text-gray-900">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Ngày phát hành:</p>
                        <p className="text-sm text-gray-900">{formatDateTime(invoice.issuedDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Mẫu số:</p>
                        <p className="text-sm text-gray-900">{invoice.formNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Ký hiệu:</p>
                        <p className="text-sm text-gray-900">{invoice.serial}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Mã tra cứu:</p>
                        <p className="text-sm text-gray-900">{invoice.lookupCode}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Mã tra cứu:</p>
                        <p className="text-sm text-gray-900">{invoice.lookupCode}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Người bán:</p>
                        <p className="text-sm text-gray-900">{invoice.sellerName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">MST người bán:</p>
                        <p className="text-sm text-gray-900">{invoice.sellerTaxId}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Người mua:</p>
                        <p className="text-sm text-gray-900">{invoice.customerName}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Tổng tiền:</p>
                        <p className="text-sm font-semibold text-gray-900">
                            {invoice.totalAmount?.toLocaleString('vi-VN')} {invoice.currency}
                        </p>
                    </div>
                </div>
            </div>

            {/* Blockchain specific fields */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Hash bất biến:</p>
                        <p className="text-xs font-mono text-gray-900 truncate" title={invoice.immutableHash}>
                            {invoice.immutableHash}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">CID:</p>
                        <p className="text-xs font-mono text-gray-900 truncate" title={invoice.cid}>
                            {invoice.cid}
                        </p>
                    </div>
                </div>
            </div>

            {/* Invoice Lines */}
            {invoice.lines && invoice.lines.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Chi tiết hàng hóa:</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left p-2">Tên</th>
                                    <th className="text-right p-2">SL</th>
                                    <th className="text-right p-2">Đơn giá</th>
                                    <th className="text-right p-2">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.lines.map((line: any, index: number) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        <td className="p-2">{line.name}</td>
                                        <td className="text-right p-2">{line.quantity} {line.unit}</td>
                                        <td className="text-right p-2">{line.unitPrice?.toLocaleString('vi-VN')}</td>
                                        <td className="text-right p-2">{line.lineTotal?.toLocaleString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const BlockchainVerificationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<BlockchainVerificationResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            handleVerifyInvoice();
        }
    }, [id]);

    const handleVerifyInvoice = async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await blockchainService.verifyInvoice(parseInt(id));
            setVerificationResult(result);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi xác thực hóa đơn');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setVerificationResult(null);
        setError(null);
        handleVerifyInvoice();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                <ArrowLeft size={20} />
                                <span>Quay lại</span>
                            </button>
                            <div className="h-6 border-l border-gray-300"></div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Xác thực Blockchain - Hóa đơn #{id}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-gray-600">Đang xác thực hóa đơn trên blockchain...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <XCircle className="text-red-600 w-6 h-6" />
                            <h2 className="text-lg font-semibold text-red-800">Xác thực thất bại</h2>
                        </div>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {verificationResult && (
                    <div className="space-y-6">
                        {/* Verification Status */}
                        <div className={`border rounded-lg p-6 ${verificationResult.data?.isValid
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                {verificationResult.data?.isValid ? (
                                    <CheckCircle className="text-green-600 w-8 h-8" />
                                ) : (
                                    <XCircle className="text-red-600 w-8 h-8" />
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {verificationResult.data?.isValid ? 'Xác thực thành công' : 'Xác thực thất bại'}
                                    </h2>
                                    <p className={`text-sm ${verificationResult.data?.isValid ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {verificationResult.data?.message}
                                    </p>
                                </div>
                            </div>

                            {/* API Response Details */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Thông tin phản hồi API:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-gray-600">Trạng thái:</p>
                                        <p className={`${verificationResult.succeeded ? 'text-green-600' : 'text-red-600'}`}>
                                            {verificationResult.succeeded ? 'Thành công' : 'Thất bại'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-600">Mã phản hồi:</p>
                                        <p className="text-gray-900">{verificationResult.code}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-600">Thông điệp:</p>
                                        <p className="text-gray-900">{verificationResult.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Comparison */}
                        {verificationResult.data?.offChainInvoice && verificationResult.data?.onChainInvoice && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-900">So sánh dữ liệu hóa đơn</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <InvoiceComparison
                                        title="Dữ liệu Off-chain (Cơ sở dữ liệu)"
                                        invoice={verificationResult.data?.offChainInvoice}
                                        variant="offchain"
                                    />

                                    <InvoiceComparison
                                        title="Dữ liệu On-chain (Blockchain)"
                                        invoice={verificationResult.data?.onChainInvoice}
                                        variant="onchain"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Raw JSON Data */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FileJson className="w-5 h-5" />
                                Dữ liệu JSON đầy đủ
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                                <pre className="text-xs text-gray-800">
                                    {JSON.stringify(verificationResult, null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleRetry}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                            >
                                Xác thực lại
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockchainVerificationPage;