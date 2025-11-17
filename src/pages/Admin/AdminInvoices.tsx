import React, { useState, useEffect, FC } from 'react';
import { BaseApiClient } from '../../api/baseApiClient';
import type { ApiResponse, Invoice, PaginatedResponse, CreateInvoiceRequest, UpdateInvoiceRequest } from '../../types/invoice';
import { Button, Form, Modal, InputPicker, DatePicker } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import { invoiceService } from '../../api/services/invoiceService';

type Props = {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingInvoice: Invoice | null;
    formValue: CreateInvoiceRequest;
    onChange: (val: Partial<CreateInvoiceRequest>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
};

const InvoiceModal: FC<Props> = ({ open, onClose, loading, editingInvoice, formValue, onChange, onSubmit }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size="lg"
        >
            <Modal.Header>
                <Modal.Title>{editingInvoice ? 'Sửa Hóa đơn' : 'Tạo Hóa đơn'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    fluid
                    formValue={formValue}
                    onChange={(val: any) => onChange(val)}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group controlId="invoiceNumber">
                            <Form.ControlLabel>Số hóa đơn *</Form.ControlLabel>
                            <Form.Control name="invoiceNumber" />
                        </Form.Group>

                        <Form.Group controlId="formNumber">
                            <Form.ControlLabel>Số biểu mẫu</Form.ControlLabel>
                            <Form.Control name="formNumber" />
                        </Form.Group>

                        <Form.Group controlId="serial">
                            <Form.ControlLabel>Số seri</Form.ControlLabel>
                            <Form.Control name="serial" />
                        </Form.Group>

                        <Form.Group controlId="status">
                            <Form.ControlLabel>Trạng thái</Form.ControlLabel>
                            <Form.Control
                                name="status"
                                accepter={InputPicker}
                                data={[
                                    { label: 'Nháp', value: 0 },
                                    { label: 'Đã phát hành', value: 1 },
                                    { label: 'Đã hủy', value: 2 },
                                    { label: 'Đã xác thực', value: 101 },
                                    { label: 'Lỗi xác thực', value: 102 },
                                ]}
                                style={{ width: '100%' }}
                            />
                        </Form.Group>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group controlId="sellerName">
                            <Form.ControlLabel>Tên người bán</Form.ControlLabel>
                            <Form.Control name="sellerName" />
                        </Form.Group>

                        <Form.Group controlId="customerName">
                            <Form.ControlLabel>Tên khách hàng</Form.ControlLabel>
                            <Form.Control name="customerName" />
                        </Form.Group>

                        <Form.Group controlId="sellerTaxId">
                            <Form.ControlLabel>Mã số thuế người bán</Form.ControlLabel>
                            <Form.Control name="sellerTaxId" />
                        </Form.Group>

                        <Form.Group controlId="customerTaxId">
                            <Form.ControlLabel>Mã số thuế khách hàng</Form.ControlLabel>
                            <Form.Control name="customerTaxId" />
                        </Form.Group>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Group controlId="subTotal">
                            <Form.ControlLabel>Tổng phụ</Form.ControlLabel>
                            <Form.Control name="subTotal" type="number" step="0.01" />
                        </Form.Group>

                        <Form.Group controlId="taxAmount">
                            <Form.ControlLabel>Tiền thuế</Form.ControlLabel>
                            <Form.Control name="taxAmount" type="number" step="0.01" />
                        </Form.Group>

                        <Form.Group controlId="totalAmount">
                            <Form.ControlLabel>Tổng tiền</Form.ControlLabel>
                            <Form.Control name="totalAmount" type="number" step="0.01" />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="note">
                        <Form.ControlLabel>Ghi chú</Form.ControlLabel>
                        <Form.Control
                            name="note"
                            componentClass="textarea"
                            rows={3}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    appearance="subtle"
                    onClick={onClose}
                >
                    Hủy
                </Button>
                <Button
                    appearance="primary"
                    onClick={() => { void onSubmit(); }}
                    loading={loading}
                >
                    {editingInvoice ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default function AdminInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [formData, setFormData] = useState<CreateInvoiceRequest>({
        invoiceNumber: '',
        organizationId: 1,
        status: 1,
        issueDate: new Date().toISOString(),
        totalAmount: 0,
    });
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Pagination states
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadInvoices();
    }, [pageIndex, pageSize]);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const response = await invoiceService.getInvoicesPaginated(pageIndex + 1, pageSize);
            if (response.succeeded && response.data) {
                setInvoices(response.data.data || []);
                setTotalCount(response.data.totalPages || 0);
            }
        } catch (error) {
            console.error('Error loading invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setLoading(true);

        try {
            if (editingInvoice) {
                const updateData: UpdateInvoiceRequest = {
                    id: editingInvoice.invoiceNumber || 'unknown',
                    ...formData,
                };
                const response = await invoiceService.updateInvoice(updateData);
                if (response.succeeded) {
                    await loadInvoices();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await invoiceService.createInvoice(formData);
                if (response.succeeded) {
                    await loadInvoices();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setFormData({
            invoiceNumber: invoice.invoiceNumber || '',
            organizationId: invoice.organizationId || 1,
            issueDate: invoice.issuedDate || new Date().toISOString(),
            totalAmount: invoice.totalAmount || 0,
            taxAmount: invoice.taxAmount || 0,
            discountAmount: invoice.discountAmount || 0,
            status: invoice.status,
            notes: invoice.note || '',
            batchId: invoice.batchId || undefined,
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            const response = await invoiceService.deleteInvoice(deleteTargetId);
            if (response.succeeded) {
                await loadInvoices();
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
        } finally {
            setDeleteLoading(false);
            setDeleteTargetId(null);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            invoiceNumber: '',
            organizationId: 1,
            status: 1,
            issueDate: new Date().toISOString(),
            totalAmount: 0,
        });
        setEditingInvoice(null);
    };

    const handleFormChange = (value: Partial<CreateInvoiceRequest>) => {
        setFormData(prev => ({
            ...prev,
            ...value,
        }));
    };

    // Pagination handlers
    const handlePageChange = (newPageIndex: number) => {
        setPageIndex(newPageIndex);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPageIndex(0); // Reset to first page when changing page size
    };

    const getStatusBadge = (status: number) => {
        const config = {
            0: { label: 'Nháp', className: 'bg-gray-100 text-gray-800' },
            1: { label: 'Đã phát hành', className: 'bg-blue-100 text-blue-800' },
            2: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
            101: { label: 'Đã xác thực', className: 'bg-green-100 text-green-800' },
            102: { label: 'Lỗi xác thực', className: 'bg-yellow-100 text-yellow-800' },
        }[status] || { label: 'Không xác định', className: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const columns: TableColumn[] = [
        {
            key: 'invoiceNumber',
            label: 'Số hóa đơn',
            dataKey: 'invoiceNumber',
        },
        {
            key: 'customerName',
            label: 'Khách hàng',
            dataKey: 'customerName',
            render: (row: any) => row.customerName || '-',
        },
        {
            key: 'totalAmount',
            label: 'Tổng tiền',
            render: (row: any) => row.totalAmount ?
                `${Number(row.totalAmount).toLocaleString('vi-VN')} ${row.currency || 'VND'}` : '-',
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row: any) => getStatusBadge(row.status),
        },
        {
            key: 'issuedDate',
            label: 'Ngày phát hành',
            render: (row: any) => row.issuedDate ? new Date(row.issuedDate).toLocaleDateString('vi-VN') : '-',
        },
        {
            key: 'actions',
            label: 'Thao tác',
            isAction: true,
            flexGrow: 1,
            render: (row: any) => (
                <div>
                    <Button appearance="link" size="sm" className="mr-3" onClick={() => handleEdit(row)}>Sửa</Button>
                    <Button appearance="link" size="sm" color="red" onClick={() => setDeleteTargetId(String(row.id))}>Xóa</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Hóa đơn</h2>
                <Button
                    appearance="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md"
                >
                    Tạo Hóa đơn mới
                </Button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            <InvoiceModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                loading={loading}
                editingInvoice={editingInvoice}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={performDelete}
                title="Xóa hóa đơn"
                message="Bạn có chắc chắn muốn xóa hóa đơn này?"
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleteLoading}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table
                    data={invoices}
                    columns={columns}
                    loading={loading}
                    className="w-full"
                    showRowNumbers={true}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    emptyText="Không có hóa đơn nào"
                    showPagination={true}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </div>
    );
}