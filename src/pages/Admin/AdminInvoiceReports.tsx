import React, { useState, useEffect } from 'react';
import type { InvoiceReport } from '../../types/invoice';
import type { PaginatedResult } from '../../types/common';
import { Button, Message, toaster } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import {
    getInvoiceReportsPaginated,
    updateInvoiceReportStatus,
} from '../../api/services/invoiceReportService';
import { InvoiceReportStatus, InvoiceReportReason } from '../../enums/invoiceEnum';
import InvoiceReportDetail from '../../components/InvoiceReportDetail';

export default function AdminInvoiceReports() {
    const [reports, setReports] = useState<InvoiceReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<InvoiceReport | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [statusChangeTarget, setStatusChangeTarget] = useState<{ reportId: number; status: string } | null>(null);
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);

    // Pagination states
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadReports();
    }, [pageIndex, pageSize]);

    const loadReports = async () => {
        setLoading(true);
        try {
            const response = await getInvoiceReportsPaginated(pageIndex + 1, pageSize);
            if (response.succeeded && response.data) {
                setReports(response.data || []);
                setTotalCount(response.totalCount || 0);
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Lỗi tải danh sách báo cáo
                </Message>
            );
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (report: InvoiceReport) => {
        setSelectedReport(report);
        setDetailModalOpen(true);
    };

    const handleStatusChange = async () => {
        if (!statusChangeTarget) return;

        setStatusChangeLoading(true);
        try {
            const response = await updateInvoiceReportStatus(
                statusChangeTarget.reportId,
                statusChangeTarget.status as "pending" | "resolved" | "dismissed"
            );

            if (response.succeeded) {
                toaster.push(
                    <Message type="success" showIcon>
                        Cập nhật trạng thái thành công
                    </Message>
                );
                await loadReports();
                setStatusChangeTarget(null);
            } else {
                toaster.push(
                    <Message type="error" showIcon>
                        {response.message || 'Lỗi cập nhật trạng thái'}
                    </Message>
                );
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toaster.push(
                <Message type="error" showIcon>
                    Có lỗi xảy ra khi cập nhật trạng thái
                </Message>
            );
        } finally {
            setStatusChangeLoading(false);
        }
    };

    // Pagination handlers
    const handlePageChange = (newPageIndex: number) => {
        setPageIndex(newPageIndex);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPageIndex(0);
    };

    const getStatusBadge = (status: number) => {
        let label = '';
        let className = '';

        switch (status) {
            case InvoiceReportStatus.Pending:
                label = 'Đang chờ';
                className = 'bg-yellow-100 text-yellow-800';
                break;
            case InvoiceReportStatus.Reviewing:
                label = 'Đang xem xét';
                className = 'bg-blue-100 text-blue-800';
                break;
            case InvoiceReportStatus.Resolved:
                label = 'Đã giải quyết';
                className = 'bg-green-100 text-green-800';
                break;
            case InvoiceReportStatus.Rejected:
                label = 'Bị từ chối';
                className = 'bg-red-100 text-red-800';
                break;
            case InvoiceReportStatus.Closed:
                label = 'Đã đóng';
                className = 'bg-gray-100 text-gray-800';
                break;
            default:
                label = 'Không xác định';
                className = 'bg-gray-100 text-gray-800';
        }

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
                {label}
            </span>
        );
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

    const columns: TableColumn[] = [
        {
            key: 'invoiceId',
            label: 'Mã hóa đơn',
            dataKey: 'invoiceId',
            width: 120,
        },
        {
            key: 'reason',
            label: 'Lý do',
            render: (row: any) => getReasonText(row.reason),
            flexGrow: 1,
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row: any) => getStatusBadge(row.status),
            width: 140,
        },
        {
            key: 'createdAt',
            label: 'Ngày báo cáo',
            render: (row: any) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('vi-VN') : '-',
            width: 180,
        },
        {
            key: 'description',
            label: 'Mô tả',
            render: (row: any) => row.description ? row.description.substring(0, 50) + (row.description.length > 50 ? '...' : '') : '-',
            flexGrow: 1,
        },
        {
            key: 'actions',
            label: 'Thao tác',
            isAction: true,
            width: 300,
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button appearance="link" size="sm" onClick={() => handleViewDetail(row)}>
                        Xem xét
                    </Button>
                    {/* <Button
                        appearance="link"
                        size="sm"
                        color="blue"
                        onClick={() => setStatusChangeTarget({ reportId: row.id, status: 'reviewing' })}
                    >
                        Xem xét
                    </Button>
                    {row.status !== InvoiceReportStatus.Resolved && (
                        <Button
                            appearance="link"
                            size="sm"
                            color="green"
                            onClick={() => setStatusChangeTarget({ reportId: row.id, status: 'resolved' })}
                        >
                            Giải quyết
                        </Button>
                    )} */}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Báo cáo Hóa đơn</h2>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table
                    data={reports}
                    columns={columns}
                    loading={loading}
                    className="w-full"
                    showRowNumbers={true}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    emptyText="Không có báo cáo nào"
                    showPagination={true}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    height={560}
                />
            </div>

            {/* Status Change Confirmation Modal */}
            <ConfirmModal
                isOpen={!!statusChangeTarget}
                onClose={() => setStatusChangeTarget(null)}
                onConfirm={handleStatusChange}
                title="Cập nhật trạng thái"
                message={`Bạn có chắc chắn muốn cập nhật trạng thái báo cáo?`}
                type="info"
                confirmText="Cập nhật"
                cancelText="Hủy"
                loading={statusChangeLoading}
            />

            {/* Detail Modal */}
            {selectedReport && (
                <InvoiceReportDetail
                    report={selectedReport}
                    open={detailModalOpen}
                    onClose={() => {
                        setDetailModalOpen(false);
                        setSelectedReport(null);
                    }}
                    onStatusChange={async () => {
                        await loadReports();
                    }}
                />
            )}
        </div>
    );
}
