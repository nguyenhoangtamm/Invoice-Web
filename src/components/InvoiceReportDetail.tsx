import React, { useState, useEffect } from 'react';
import type { InvoiceReport, Invoice } from '../types/invoice';
import { Button, Message, toaster, Modal, Table, IconButton, Form, SelectPicker, Card } from 'rsuite';
import { AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { getInvoiceById, syncBlockchainInvoice } from '../api/services/invoiceService';
import { blockchainService } from '../api/services/blockchainService';
import { updateInvoiceReport, getInvoiceReportById } from '../api/services/invoiceReportService';
import { InvoiceReportStatus, InvoiceReportReason } from '../enums/invoiceEnum';
import { formatDateTime } from '../utils/helpers';
import ReloadIcon from '@rsuite/icons/Reload';
import SpinnerIcon from '@rsuite/icons/Spinner';

interface Props {
    reportId: number;
    open: boolean;
    onClose: () => void;
    onStatusChange?: () => Promise<void> | void;
}

export default function InvoiceReportDetail({ reportId, open, onClose, onStatusChange }: Props) {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [report, setReport] = useState<InvoiceReport | null>(null);
    const [loadingReport, setLoadingReport] = useState(false);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [loadingComparison, setLoadingComparison] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (open && reportId) {
            setLoadingReport(true);
            setInvoice(null);
            setShowComparison(false);
            setComparisonData(null);

            getInvoiceReportById(reportId)
                .then(response => {
                    if (response.succeeded && response.data) {
                        const reportData = response.data;
                        setReport(reportData);

                        // Then fetch invoice detail
                        if (reportData.invoiceId) {
                            setLoadingInvoice(true);
                            getInvoiceById(reportData.invoiceId)
                                .then(invoiceResponse => {
                                    if (invoiceResponse.succeeded && invoiceResponse.data) {
                                        setInvoice(invoiceResponse.data);
                                    } else {
                                        toaster.push(
                                            <Message type="error" showIcon>
                                                Lỗi tải thông tin hóa đơn
                                            </Message>
                                        );
                                    }
                                })
                                .catch(error => {
                                    console.error('Error fetching invoice:', error);
                                    toaster.push(
                                        <Message type="error" showIcon>
                                            Có lỗi xảy ra khi tải thông tin hóa đơn
                                        </Message>
                                    );
                                })
                                .finally(() => setLoadingInvoice(false));
                        }
                    } else {
                        toaster.push(
                            <Message type="error" showIcon>
                                Lỗi tải thông tin báo cáo
                            </Message>
                        );
                    }
                })
                .catch(error => {
                    console.error('Error fetching report:', error);
                    toaster.push(
                        <Message type="error" showIcon>
                            Có lỗi xảy ra khi tải thông tin báo cáo
                        </Message>
                    );
                })
                .finally(() => setLoadingReport(false));
        } else if (!open) {
            setReport(null);
            setInvoice(null);
            setComparisonData(null);
            setShowComparison(false);
        }
    }, [open, reportId]);

    const handleSyncBlockchain = async () => {
        if (!invoice) return;

        setSyncLoading(true);
        try {
            const response = await syncBlockchainInvoice(invoice.id);

            if (response.succeeded) {
                toaster.push(
                    <Message type="success" showIcon>
                        Đồng bộ blockchain thành công
                    </Message>
                );
                if (response.data) {
                    setInvoice(response.data);
                    // Reload comparison data if it exists
                    if (comparisonData) {
                        await handleLoadComparison();
                    }
                }
            } else {
                toaster.push(
                    <Message type="error" showIcon>
                        {response.message || 'Lỗi đồng bộ blockchain'}
                    </Message>
                );
            }
        } catch (error) {
            console.error('Error syncing blockchain:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Có lỗi xảy ra khi đồng bộ blockchain
                </Message>
            );
        } finally {
            setSyncLoading(false);
        }
    };

    const handleQuickUpdateStatus = async (newStatus: number) => {
        if (!report) return;
        setUpdateLoading(true);
        try {
            const response = await updateInvoiceReport(
                report.id,
                newStatus,
                report.reason,
                report.description || ''
            );

            if (response.succeeded) {
                toaster.push(
                    <Message type="success" showIcon>
                        Cập nhật trạng thái thành công
                    </Message>
                );
                setReport({ ...report, status: newStatus });
                if (onStatusChange) {
                    await onStatusChange();
                }
            } else {
                toaster.push(
                    <Message type="error" showIcon>
                        {response.message || 'Lỗi cập nhật trạng thái'}
                    </Message>
                );
                // Revert status on error
                setReport(report);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Có lỗi xảy ra khi cập nhật trạng thái
                </Message>
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleLoadComparison = async () => {
        if (!invoice) return;
        try {
            setLoadingComparison(true);
            const response = await blockchainService.verifyInvoice(invoice.id);
            setComparisonData(response);
            setShowComparison(true);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu so sánh:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Lỗi tải dữ liệu đối sánh
                </Message>
            );
        } finally {
            setLoadingComparison(false);
        }
    };

    const getReasonText = (reason: number) => {
        switch (reason) {
            case InvoiceReportReason.IncorrectDetails:
                return 'Thông tin sai lệch';
            case InvoiceReportReason.MissingInformation:
                return 'Thiếu thông tin';
            case InvoiceReportReason.FraudulentActivity:
                return 'Hoạt động gian lận';
            case InvoiceReportReason.Other:
                return 'Khác';
            default:
                return 'Không xác định';
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case InvoiceReportStatus.Pending:
                return 'Đang chờ';
            case InvoiceReportStatus.Reviewing:
                return 'Đang xem xét';
            case InvoiceReportStatus.Resolved:
                return 'Đã giải quyết';
            case InvoiceReportStatus.Rejected:
                return 'Bị từ chối';
            case InvoiceReportStatus.Closed:
                return 'Đã đóng';
            default:
                return 'Không xác định';
        }
    };

    const getComparisonData = () => {
        if (!comparisonData?.data) {
            return [];
        }

        const { offChainInvoice, onChainInvoice } = comparisonData.data;

        const compareField = (offChainValue: any, onChainValue: any) => {
            if (offChainValue === onChainValue) {
                return { match: true, icon: '✓', color: 'text-green-600' };
            } else {
                return { match: false, icon: '✗', color: 'text-red-600' };
            }
        };

        let comparisonResult = [
            {
                field: 'Số hóa đơn',
                offChain: offChainInvoice.invoiceNumber || '-',
                onChain: onChainInvoice.invoiceNumber || '-',
                comparison: compareField(offChainInvoice.invoiceNumber, onChainInvoice.invoiceNumber)
            },
            {
                field: 'Mẫu số hóa đơn',
                offChain: offChainInvoice.formNumber || '-',
                onChain: onChainInvoice.formNumber || '-',
                comparison: compareField(offChainInvoice.formNumber, onChainInvoice.formNumber)
            },
            {
                field: 'Ký hiệu hóa đơn',
                offChain: offChainInvoice.serial || '-',
                onChain: onChainInvoice.serial || '-',
                comparison: compareField(offChainInvoice.serial, onChainInvoice.serial)
            },
            {
                field: 'Mã tra cứu',
                offChain: offChainInvoice.lookupCode || '-',
                onChain: onChainInvoice.lookupCode || '-',
                comparison: compareField(offChainInvoice.lookupCode, onChainInvoice.lookupCode)
            },
            {
                field: 'Ngày phát hành',
                offChain: formatDateTime(offChainInvoice.issuedDate) || '-',
                onChain: formatDateTime(onChainInvoice.issuedDate) || '-',
                comparison: compareField(offChainInvoice.issuedDate, onChainInvoice.issuedDate)
            },
            {
                field: 'Tổng tiền',
                offChain: offChainInvoice.totalAmount?.toLocaleString('vi-VN') + ' ' + (offChainInvoice.currency || 'VND'),
                onChain: onChainInvoice.totalAmount?.toLocaleString('vi-VN') + ' ' + (onChainInvoice.currency || 'VND'),
                comparison: compareField(offChainInvoice.totalAmount, onChainInvoice.totalAmount)
            },
            {
                field: '--- THÔNG TIN NGƯỜI BÁN ---',
                offChain: '--- --- ---',
                onChain: '--- --- ---',
                comparison: { match: true, icon: '---', color: 'text-gray-400' }
            },
            {
                field: 'Tên người bán',
                offChain: offChainInvoice.sellerName || '-',
                onChain: onChainInvoice.sellerName || '-',
                comparison: compareField(offChainInvoice.sellerName, onChainInvoice.sellerName)
            },
            {
                field: 'MST người bán',
                offChain: offChainInvoice.sellerTaxId || '-',
                onChain: onChainInvoice.sellerTaxId || '-',
                comparison: compareField(offChainInvoice.sellerTaxId, onChainInvoice.sellerTaxId)
            },
            {
                field: 'Địa chỉ người bán',
                offChain: offChainInvoice.sellerAddress || '-',
                onChain: onChainInvoice.sellerAddress || '-',
                comparison: compareField(offChainInvoice.sellerAddress, onChainInvoice.sellerAddress)
            },
            {
                field: 'Điện thoại người bán',
                offChain: offChainInvoice.sellerPhone || '-',
                onChain: onChainInvoice.sellerPhone || '-',
                comparison: compareField(offChainInvoice.sellerPhone, onChainInvoice.sellerPhone)
            },
            {
                field: 'Email người bán',
                offChain: offChainInvoice.sellerEmail || '-',
                onChain: onChainInvoice.sellerEmail || '-',
                comparison: compareField(offChainInvoice.sellerEmail, onChainInvoice.sellerEmail)
            },
            {
                field: '--- THÔNG TIN NGƯỜI MUA ---',
                offChain: '--- --- ---',
                onChain: '--- --- ---',
                comparison: { match: true, icon: '---', color: 'text-gray-400' }
            },
            {
                field: 'Tên người mua',
                offChain: offChainInvoice.customerName || '-',
                onChain: onChainInvoice.customerName || '-',
                comparison: compareField(offChainInvoice.customerName, onChainInvoice.customerName)
            },
            {
                field: 'MST người mua',
                offChain: offChainInvoice.customerTaxId || '-',
                onChain: onChainInvoice.customerTaxId || '-',
                comparison: compareField(offChainInvoice.customerTaxId, onChainInvoice.customerTaxId)
            },
            {
                field: 'Địa chỉ người mua',
                offChain: offChainInvoice.customerAddress || '-',
                onChain: onChainInvoice.customerAddress || '-',
                comparison: compareField(offChainInvoice.customerAddress, onChainInvoice.customerAddress)
            },
            {
                field: 'Điện thoại người mua',
                offChain: offChainInvoice.customerPhone || '-',
                onChain: onChainInvoice.customerPhone || '-',
                comparison: compareField(offChainInvoice.customerPhone, onChainInvoice.customerPhone)
            },
            {
                field: 'Email người mua',
                offChain: offChainInvoice.customerEmail || '-',
                onChain: onChainInvoice.customerEmail || '-',
                comparison: compareField(offChainInvoice.customerEmail, onChainInvoice.customerEmail)
            },
        ];

        // Add invoice lines comparison if available
        if (offChainInvoice.lines && offChainInvoice.lines.length > 0) {
            const offChainLines = offChainInvoice.lines;
            const onChainLines = onChainInvoice.lines || [];

            // Compare number of lines
            comparisonResult.push({
                field: '--- CHI TIẾT HÀNG HÓA ---',
                offChain: '--- --- ---',
                onChain: '--- --- ---',
                comparison: { match: true, icon: '---', color: 'text-gray-400' }
            });

            comparisonResult.push({
                field: 'Số lượng dòng sản phẩm',
                offChain: offChainLines.length.toString() + ' dòng',
                onChain: onChainLines.length.toString() + ' dòng',
                comparison: compareField(offChainLines.length, onChainLines.length)
            });

            // Compare each line
            offChainLines.forEach((offLine: any, index: number) => {
                const onLine = onChainLines[index];
                const linePrefix = `Dòng ${index + 1}:`;

                // name comparison
                comparisonResult.push({
                    field: `${linePrefix} Tên`,
                    offChain: offLine.name || '-',
                    onChain: onLine?.name || '-',
                    comparison: compareField(offLine.name, onLine?.name)
                });

                // Quantity comparison
                comparisonResult.push({
                    field: `${linePrefix} Số lượng`,
                    offChain: `${offLine.quantity || 0} ${offLine.unit || ''}`.trim(),
                    onChain: `${onLine?.quantity || 0} ${onLine?.unit || ''}`.trim(),
                    comparison: compareField(offLine.quantity, onLine?.quantity)
                });

                // Unit price comparison
                comparisonResult.push({
                    field: `${linePrefix} Đơn giá`,
                    offChain: (offLine.unitPrice?.toLocaleString('vi-VN') || '0') + ' VND',
                    onChain: (onLine?.unitPrice?.toLocaleString('vi-VN') || '0') + ' VND',
                    comparison: compareField(offLine.unitPrice, onLine?.unitPrice)
                });

                // Line total comparison
                comparisonResult.push({
                    field: `${linePrefix} Thành tiền`,
                    offChain: (offLine.lineTotal?.toLocaleString('vi-VN') || '0') + ' VND',
                    onChain: (onLine?.lineTotal?.toLocaleString('vi-VN') || '0') + ' VND',
                    comparison: compareField(offLine.lineTotal, onLine?.lineTotal)
                });
            });
        }

        return comparisonResult;
    };

    const comparisonStats = {
        matched: getComparisonData().filter((item: any) => item.comparison.match).length,
        notMatched: getComparisonData().filter((item: any) => !item.comparison.match && item.comparison.icon !== '---').length,
        total: getComparisonData().length
    };

    return (
        <>
            <Modal open={open} onClose={onClose} size="lg" style={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: '90vh' }}>
                <Modal.Header>
                    <Modal.Title>Chi tiết báo cáo hóa đơn</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflowX: 'auto', padding: '0rem' }}>
                    {loadingReport || loadingInvoice ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : !report || !invoice ? (
                        <div className="p-6 text-center">
                            <p className="text-red-600">Không thể tải thông tin</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Report Information */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Thông tin báo cáo</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Mã báo cáo</p>
                                        <p className="text-base font-medium">{report.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Mã hóa đơn</p>
                                        <p className="text-base font-medium">{report.invoiceId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Lý do báo cáo</p>
                                        <p className="text-base font-medium">{getReasonText(report.reason)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trạng thái</p>
                                        <p className="text-base font-medium">{getStatusText(report.status)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày báo cáo</p>
                                        <p className="text-base font-medium">
                                            {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                                        <p className="text-base font-medium">
                                            {new Date(report.updatedAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                                {report.description && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600">Mô tả</p>
                                        <p className="text-base mt-1 bg-white p-3 rounded border border-gray-300">
                                            {report.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Warning Banner */}
                            {report.status === InvoiceReportStatus.Pending && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-yellow-600 w-5 h-5" />
                                        <p className="text-yellow-800">
                                            <strong>Chú ý:</strong> Báo cáo này đang chờ xử lý. Vui lòng xem xét chi tiết hóa đơn liên quan.
                                        </p>
                                    </div>
                                </div>
                            )}
                            <Card>
                                <Card.Header>
                                    <h3 className="text-lg font-semibold text-gray-900">Cập nhật trạng thái báo cáo</h3>
                                </Card.Header>
                                <Card.Body>
                                    <SelectPicker
                                        data={[
                                            { label: 'Đang chờ xử lý', value: InvoiceReportStatus.Pending },
                                            { label: 'Đang xem xét', value: InvoiceReportStatus.Reviewing },
                                            { label: 'Đã giải quyết', value: InvoiceReportStatus.Resolved },
                                            { label: 'Bị từ chối', value: InvoiceReportStatus.Rejected },
                                            { label: 'Đã đóng', value: InvoiceReportStatus.Closed },
                                        ]}
                                        value={report.status}
                                        onChange={(value) => value !== undefined && handleQuickUpdateStatus(value ?? 0)}
                                        block
                                        disabled={updateLoading}
                                        style={{ marginTop: '0.25rem' }}
                                    />
                                </Card.Body>
                            </Card>
                            {/* Comparison Section */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="w-full flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 p-4 border-b border-blue-200 transition-colors">
                                    <button
                                        onClick={() => {
                                            if (!showComparison && !comparisonData && invoice) {
                                                handleLoadComparison();
                                            } else {
                                                setShowComparison(!showComparison);
                                            }
                                        }}
                                        className="flex items-center gap-3 flex-1"
                                    >
                                        {showComparison ? (
                                            <ChevronUp className="text-blue-600" size={20} />
                                        ) : (
                                            <ChevronDown className="text-blue-600" size={20} />
                                        )}
                                        <h3 className="text-lg font-semibold text-blue-900">Dữ liệu đối sánh Off-chain & On-chain</h3>
                                    </button>
                                    <div className="flex items-center gap-3">
                                        {comparisonData && (
                                            <div className="text-sm font-medium text-blue-700">
                                                {comparisonStats.matched} / {comparisonStats.total} trùng khớp
                                            </div>
                                        )}
                                        {showComparison && comparisonData && (
                                            <IconButton
                                                onClick={handleLoadComparison}
                                                disabled={loadingComparison}
                                                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                                                title="Làm mới dữ liệu đối sánh"
                                                icon={loadingComparison ? <SpinnerIcon /> : <ReloadIcon />}

                                            />

                                        )}
                                    </div>
                                </div>

                                {showComparison && (
                                    <div className="p-6 bg-white space-y-6">
                                        {loadingComparison ? (
                                            <div className="flex justify-center items-center py-20">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            </div>
                                        ) : comparisonData ? (
                                            <>
                                                {/* Comparison Table */}
                                                <div className="overflow-x-auto">
                                                    <Table
                                                        data={getComparisonData()}
                                                        autoHeight
                                                        bordered
                                                        cellBordered
                                                        className="comparison-table"
                                                    >
                                                        <Table.Column width={200} align="left" fixed>
                                                            <Table.HeaderCell style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                                                                Trường dữ liệu
                                                            </Table.HeaderCell>
                                                            <Table.Cell dataKey="field" style={{ fontWeight: '600' }} />
                                                        </Table.Column>

                                                        <Table.Column width={300} align="left" flexGrow={1}>
                                                            <Table.HeaderCell style={{ background: '#e3f2fd', fontWeight: 'bold', color: '#1565c0' }}>
                                                                <div className="flex items-center gap-2">
                                                                    <AlertCircle size={16} />
                                                                    Dữ liệu Off-chain
                                                                </div>
                                                            </Table.HeaderCell>
                                                            <Table.Cell dataKey="offChain" style={{ wordBreak: 'break-word' }} />
                                                        </Table.Column>

                                                        <Table.Column width={300} align="left" flexGrow={1}>
                                                            <Table.HeaderCell style={{ background: '#e8f5e8', fontWeight: 'bold', color: '#2e7d32' }}>
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle size={16} />
                                                                    Dữ liệu On-chain
                                                                </div>
                                                            </Table.HeaderCell>
                                                            <Table.Cell dataKey="onChain" style={{ wordBreak: 'break-word' }} />
                                                        </Table.Column>

                                                        <Table.Column width={120} align="center" fixed="right">
                                                            <Table.HeaderCell style={{ background: '#fff3e0', fontWeight: 'bold', color: '#ef6c00' }}>
                                                                Kết quả
                                                            </Table.HeaderCell>
                                                            <Table.Cell>
                                                                {(rowData: any) => (
                                                                    <div className="flex items-center justify-center">
                                                                        <span
                                                                            className={`text-lg font-bold ${rowData.comparison.color}`}
                                                                            title={rowData.comparison.match ? 'Trùng khớp' : 'Không trùng khớp'}
                                                                        >
                                                                            {rowData.comparison.icon}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Table.Cell>
                                                        </Table.Column>
                                                    </Table>
                                                </div>

                                                {/* Statistics */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                                        <div className="text-2xl font-bold text-green-600 mb-1">
                                                            {comparisonStats.matched}
                                                        </div>
                                                        <div className="text-sm text-green-700">Trùng khớp</div>
                                                    </div>
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                                                        <div className="text-2xl font-bold text-red-600 mb-1">
                                                            {comparisonStats.notMatched}
                                                        </div>
                                                        <div className="text-sm text-red-700">Không trùng khớp</div>
                                                    </div>
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                                        <div className="text-2xl font-bold text-gray-600 mb-1">
                                                            {comparisonStats.total}
                                                        </div>
                                                        <div className="text-sm text-gray-700">Tổng cộng</div>
                                                    </div>
                                                </div>

                                                {/* Legend */}
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <AlertCircle className="text-blue-600 w-5 h-5" />
                                                        <h3 className="font-semibold text-blue-800">Giải thích ký hiệu</h3>
                                                    </div>
                                                    <div className="text-blue-700 text-sm space-y-1">
                                                        <p><span className="text-green-600 font-bold">✓</span> - Dữ liệu trùng khớp hoàn toàn</p>
                                                        <p><span className="text-red-600 font-bold">✗</span> - Dữ liệu không trùng khớp</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-600">Không có dữ liệu đối sánh</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex gap-3 justify-between w-full">
                        <div className="flex gap-3">
                            <Button
                                appearance="primary"
                                color="cyan"
                                onClick={() => {
                                    if (!showComparison && !comparisonData && invoice) {
                                        handleLoadComparison();
                                    } else {
                                        setShowComparison(!showComparison);
                                    }
                                }}
                                loading={loadingComparison}
                                disabled={!invoice}
                            >
                                <AlertCircle className="inline-block mr-2" size={16} />
                                {showComparison ? 'Ẩn đối sánh' : 'Xem đối sánh'}
                            </Button>
                            <Button
                                appearance="primary"
                                color="green"
                                onClick={handleSyncBlockchain}
                                loading={syncLoading}
                                disabled={!invoice}
                            >
                                <Clock className="inline-block mr-2" size={16} />
                                Đồng bộ blockchain
                            </Button>
                        </div>
                        <Button onClick={onClose} appearance="default">
                            Đóng
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
