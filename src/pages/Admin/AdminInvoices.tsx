import React, { useState, useEffect, FC } from 'react';
import type { Invoice, CreateInvoiceRequest, UpdateInvoiceRequest } from '../../types/invoice';
import type { PaginatedResult } from '../../types/common';
import { Button, Form, Modal, InputPicker, DatePicker } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import AdminSearchBar, { SearchFilter, SearchParams } from '../../components/common/AdminSearchBar';
import InvoiceDetail from '../../components/InvoiceDetail';
import type { TableColumn } from '../../components/common/table';
import {
    getInvoicesPaginated,
    createInvoice,
    updateInvoice,
    deleteInvoice
} from '../../api/services/invoiceService';
import { getSimplifiedInvoiceStatusText, getSimplifiedInvoiceStatusColor } from '../../utils/helpers';

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
                            <Form.ControlLabel>Số biểu mẫu *</Form.ControlLabel>
                            <Form.Control name="formNumber" />
                        </Form.Group>

                        <Form.Group controlId="serial">
                            <Form.ControlLabel>Số seri *</Form.ControlLabel>
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
                            <Form.ControlLabel>Tên người bán *</Form.ControlLabel>
                            <Form.Control name="sellerName" />
                        </Form.Group>

                        <Form.Group controlId="customerName">
                            <Form.ControlLabel>Tên khách hàng *</Form.ControlLabel>
                            <Form.Control name="customerName" />
                        </Form.Group>

                        <Form.Group controlId="sellerTaxId">
                            <Form.ControlLabel>Mã số thuế người bán *</Form.ControlLabel>
                            <Form.Control name="sellerTaxId" />
                        </Form.Group>

                        <Form.Group controlId="customerTaxId">
                            <Form.ControlLabel>Mã số thuế khách hàng *</Form.ControlLabel>
                            <Form.Control name="customerTaxId" />
                        </Form.Group>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group controlId="sellerAddress">
                            <Form.ControlLabel>Địa chỉ người bán *</Form.ControlLabel>
                            <Form.Control name="sellerAddress" />
                        </Form.Group>

                        <Form.Group controlId="customerAddress">
                            <Form.ControlLabel>Địa chỉ khách hàng *</Form.ControlLabel>
                            <Form.Control name="customerAddress" />
                        </Form.Group>

                        <Form.Group controlId="sellerPhone">
                            <Form.ControlLabel>Điện thoại người bán *</Form.ControlLabel>
                            <Form.Control name="sellerPhone" />
                        </Form.Group>

                        <Form.Group controlId="customerPhone">
                            <Form.ControlLabel>Điện thoại khách hàng *</Form.ControlLabel>
                            <Form.Control name="customerPhone" />
                        </Form.Group>

                        <Form.Group controlId="sellerEmail">
                            <Form.ControlLabel>Email người bán *</Form.ControlLabel>
                            <Form.Control name="sellerEmail" type="email" />
                        </Form.Group>

                        <Form.Group controlId="customerEmail">
                            <Form.ControlLabel>Email khách hàng *</Form.ControlLabel>
                            <Form.Control name="customerEmail" type="email" />
                        </Form.Group>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <Form.Group controlId="subTotal">
                            <Form.ControlLabel>Tổng phụ *</Form.ControlLabel>
                            <Form.Control name="subTotal" type="number" step="0.01" />
                        </Form.Group>

                        <Form.Group controlId="taxAmount">
                            <Form.ControlLabel>Tiền thuế *</Form.ControlLabel>
                            <Form.Control name="taxAmount" type="number" step="0.01" />
                        </Form.Group>

                        <Form.Group controlId="discountAmount">
                            <Form.ControlLabel>Tiền giảm giá *</Form.ControlLabel>
                            <Form.Control name="discountAmount" type="number" step="0.01" />
                        </Form.Group>

                        <Form.Group controlId="totalAmount">
                            <Form.ControlLabel>Tổng tiền *</Form.ControlLabel>
                            <Form.Control name="totalAmount" type="number" step="0.01" />
                        </Form.Group>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group controlId="currency">
                            <Form.ControlLabel>Tiền tệ *</Form.ControlLabel>
                            <Form.Control
                                name="currency"
                                accepter={InputPicker}
                                data={[
                                    { label: 'VND', value: 'VND' },
                                    { label: 'USD', value: 'USD' },
                                    { label: 'EUR', value: 'EUR' },
                                ]}
                                style={{ width: '100%' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="issuedDate">
                            <Form.ControlLabel>Ngày phát hành *</Form.ControlLabel>
                            <Form.Control name="issuedDate" accepter={DatePicker} style={{ width: '100%' }} />
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
        formNumber: '',
        serial: '',
        organizationId: 1,
        sellerName: '',
        sellerTaxId: '',
        sellerAddress: '',
        sellerPhone: '',
        sellerEmail: '',
        customerName: '',
        customerTaxId: '',
        customerAddress: '',
        customerPhone: '',
        customerEmail: '',
        status: 1,
        issuedDate: new Date().toISOString(),
        subTotal: 0,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 0,
        currency: 'VND',
        note: '',
        lines: []
    });
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Pagination states
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Search states
    const [searchParams, setSearchParams] = useState<SearchParams>({});

    useEffect(() => {
        loadInvoices();
    }, [pageIndex, pageSize, searchParams]);

    const loadInvoices = async () => {
        setLoading(true);
        try {
            const response = await getInvoicesPaginated(
                pageIndex + 1,
                pageSize,
                searchParams.status as string,
                searchParams.quickSearch
            );

            if (response.succeeded && response.data) {
                setInvoices(response.data || []);
                setTotalCount(response.totalCount || 0);
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
                    id: editingInvoice.id.toString(),
                    ...formData,
                };
                const response = await updateInvoice(updateData);
                if (response.succeeded) {
                    await loadInvoices();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await createInvoice(formData);
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

    const handleViewDetail = (invoice: Invoice) => {
        setSelectedInvoiceId(invoice.id);
        setDetailModalOpen(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setFormData({
            invoiceNumber: invoice.invoiceNumber || '',
            formNumber: invoice.formNumber || '',
            serial: invoice.serial || '',
            organizationId: invoice.organizationId || 1,
            sellerName: invoice.sellerName || '',
            sellerTaxId: invoice.sellerTaxId || '',
            sellerAddress: invoice.sellerAddress || '',
            sellerPhone: invoice.sellerPhone || '',
            sellerEmail: invoice.sellerEmail || '',
            customerName: invoice.customerName || '',
            customerTaxId: invoice.customerTaxId || '',
            customerAddress: invoice.customerAddress || '',
            customerPhone: invoice.customerPhone || '',
            customerEmail: invoice.customerEmail || '',
            status: invoice.status,
            issuedDate: invoice.issuedDate || new Date().toISOString(),
            subTotal: invoice.subTotal || 0,
            taxAmount: invoice.taxAmount || 0,
            discountAmount: invoice.discountAmount || 0,
            totalAmount: invoice.totalAmount || 0,
            currency: invoice.currency || 'VND',
            note: invoice.note || '',
            lines: (invoice.lines || []).map(line => ({
                invoiceId: line.invoiceId,
                lineNumber: line.lineNumber,
                name: line.name,
                unit: line.unit || '',
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount,
                taxRate: line.taxRate,
                taxAmount: line.taxAmount,
                lineTotal: line.lineTotal
            }))
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            const response = await deleteInvoice(deleteTargetId);
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
            formNumber: '',
            serial: '',
            organizationId: 1,
            sellerName: '',
            sellerTaxId: '',
            sellerAddress: '',
            sellerPhone: '',
            sellerEmail: '',
            customerName: '',
            customerTaxId: '',
            customerAddress: '',
            customerPhone: '',
            customerEmail: '',
            status: 1,
            issuedDate: new Date().toISOString(),
            subTotal: 0,
            taxAmount: 0,
            discountAmount: 0,
            totalAmount: 0,
            currency: 'VND',
            note: '',
            lines: []
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
        const label = getSimplifiedInvoiceStatusText(status);
        const className = getSimplifiedInvoiceStatusColor(status).replace('text-yellow-700', 'text-yellow-800').replace('text-green-700', 'text-green-800');

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
                {label}
            </span>
        );
    };

    const columns: TableColumn[] = [
        {
            key: 'invoiceNumber',
            label: 'Số hóa đơn',
            dataKey: 'invoiceNumber',
            width: 150,
        },
        {
            label: 'Số biểu mẫu',
            dataKey: 'formNumber',
            key: 'formNumber',
            width: 150,
        },
        {
            key: 'serial',
            label: 'Số seri',
            dataKey: 'serial',
            width: 150,
        },
        {
            label: 'Mã tra cứu',
            dataKey: 'lookupCode',
            key: 'lookupCode',
            width: 200,
        },
        {
            key: "sellerName",
            label: 'Người bán',
            dataKey: "sellerName",
            flexGrow: 1,
        },
        {
            key: 'customerName',
            label: 'Người mua',
            dataKey: 'customerName',
            render: (row: any) => row.customerName || '-',
            flexGrow: 1,
        },
        {
            key: 'totalAmount',
            label: 'Tổng tiền',
            render: (row: any) => row.totalAmount ?
                `${Number(row.totalAmount).toLocaleString('vi-VN')} ${row.currency || 'VND'}` : '-',
            width: 150,
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row: any) => getStatusBadge(row.status),
            width: 120,
        },
        {
            key: 'issuedDate',
            label: 'Ngày phát hành',
            render: (row: any) => row.issuedDate ? new Date(row.issuedDate).toLocaleDateString('vi-VN') : '-',
            width: 150,
        },
        {
            key: 'actions',
            label: 'Thao tác',
            isAction: true,
            width: 280,
            render: (row: any) => (
                <div className="flex gap-2">
                    <Button appearance="link" size="sm" onClick={() => handleViewDetail(row)}>Xem chi tiết</Button>
                    <Button appearance="link" size="sm" color="blue" onClick={() => handleEdit(row)}>Sửa</Button>
                    <Button appearance="link" size="sm" color="red" onClick={() => setDeleteTargetId(row.id)}>Xóa</Button>
                </div>
            ),
        },
    ];

    // Search handlers
    const handleSearch = (params: SearchParams) => {
        setSearchParams(params);
        setPageIndex(0);
    };

    // Search filters configuration
    const searchFilters: SearchFilter[] = [
        {
            field: 'status',
            type: 'select',
            label: 'Trạng thái',
            options: [
                { label: 'Nháp', value: 0 },
                { label: 'Đã phát hành', value: 1 },
                { label: 'Đã hủy', value: 2 },
                { label: 'Đã xác thực', value: 101 },
                { label: 'Lỗi xác thực', value: 102 },
            ]
        },
        {
            field: 'dateRange',
            type: 'dateRange',
            label: 'Ngày tạo'
        }
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

            <AdminSearchBar
                filters={searchFilters}
                onSearch={handleSearch}
                loading={loading}
                placeholder="Tìm kiếm theo số hóa đơn, tên khách hàng, tên người bán, mã số thuế..."
            />

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

            {selectedInvoiceId && (
                <InvoiceDetail
                    data={}
                    open={detailModalOpen}
                    onClose={() => {
                        setDetailModalOpen(false);
                        setSelectedInvoiceId(null);
                    }}
                />
            )}

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
                    height={560}
                />
            </div>
        </div>
    );
}