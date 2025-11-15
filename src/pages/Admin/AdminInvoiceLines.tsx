import React, { useState, useEffect, FC } from 'react';
import { BaseApiClient } from '../../api/baseApiClient';
import type { ApiResponse, PaginatedResponse } from '../../types/invoice';
import { Button, Form, Modal, InputPicker, InputNumber } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import { CreateInvoiceLineRequest, InvoiceLine, UpdateInvoiceLineRequest } from '../../types/invoiceLine';
import { invoiceLineService } from '../../api/services/invoiceLineService';

type Props = {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingLine: InvoiceLine | null;
    formValue: CreateInvoiceLineRequest;
    onChange: (val: Partial<CreateInvoiceLineRequest>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
};

const InvoiceLineModal: FC<Props> = ({ open, onClose, loading, editingLine, formValue, onChange, onSubmit }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size="md"
        >
            <Modal.Header>
                <Modal.Title>{editingLine ? 'Sửa Chi tiết hóa đơn' : 'Tạo Chi tiết hóa đơn'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    fluid
                    formValue={formValue}
                    onChange={(val: any) => onChange(val)}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group controlId="invoiceId">
                            <Form.ControlLabel>ID Hóa đơn *</Form.ControlLabel>
                            <Form.Control name="invoiceId" accepter={InputNumber} />
                        </Form.Group>

                        <Form.Group controlId="lineNumber">
                            <Form.ControlLabel>Số dòng *</Form.ControlLabel>
                            <Form.Control name="lineNumber" accepter={InputNumber} />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="description">
                        <Form.ControlLabel>Mô tả</Form.ControlLabel>
                        <Form.Control
                            name="description"
                            componentClass="textarea"
                            rows={3}
                        />
                    </Form.Group>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Group controlId="unit">
                            <Form.ControlLabel>Đơn vị</Form.ControlLabel>
                            <Form.Control name="unit" />
                        </Form.Group>

                        <Form.Group controlId="quantity">
                            <Form.ControlLabel>Số lượng *</Form.ControlLabel>
                            <Form.Control name="quantity" accepter={InputNumber} min={0} step={0.01} />
                        </Form.Group>

                        <Form.Group controlId="unitPrice">
                            <Form.ControlLabel>Đơn giá *</Form.ControlLabel>
                            <Form.Control name="unitPrice" accepter={InputNumber} min={0} step={0.01} />
                        </Form.Group>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Form.Group controlId="discount">
                            <Form.ControlLabel>Chiết khấu</Form.ControlLabel>
                            <Form.Control name="discount" accepter={InputNumber} min={0} step={0.01} />
                        </Form.Group>

                        <Form.Group controlId="taxRate">
                            <Form.ControlLabel>Thuế suất (%)</Form.ControlLabel>
                            <Form.Control name="taxRate" accepter={InputNumber} min={0} max={100} step={0.01} />
                        </Form.Group>

                        <Form.Group controlId="taxAmount">
                            <Form.ControlLabel>Tiền thuế</Form.ControlLabel>
                            <Form.Control name="taxAmount" accepter={InputNumber} min={0} step={0.01} />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="lineTotal">
                        <Form.ControlLabel>Tổng dòng *</Form.ControlLabel>
                        <Form.Control name="lineTotal" accepter={InputNumber} min={0} step={0.01} />
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
                    {editingLine ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default function AdminInvoiceLines() {
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingLine, setEditingLine] = useState<InvoiceLine | null>(null);
    const [formData, setFormData] = useState<CreateInvoiceLineRequest>({
        invoiceId: 1,
        lineNumber: 1,
        quantity: 1,
        unitPrice: 0,
        lineTotal: 0,
    });
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadInvoiceLines();
    }, []);

    const loadInvoiceLines = async () => {
        setLoading(true);
        try {
            const response = await invoiceLineService.getInvoiceLinesPaginated();
            if (response.success && response.data) {
                setInvoiceLines(response.data.data);
            }
        } catch (error) {
            console.error('Error loading invoice lines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setLoading(true);

        try {
            // Calculate line total if not provided
            const calculatedData = {
                ...formData,
                lineTotal: formData.lineTotal || (formData.quantity * formData.unitPrice * (1 - (formData.discount || 0) / 100) + (formData.taxAmount || 0))
            };

            if (editingLine) {
                const updateData: UpdateInvoiceLineRequest = {
                    id: editingLine.id,
                    ...calculatedData,
                };
                const response = await invoiceLineService.updateInvoiceLine(updateData);
                if (response.success) {
                    await loadInvoiceLines();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await invoiceLineService.createInvoiceLine(calculatedData);
                if (response.success) {
                    await loadInvoiceLines();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving invoice line:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (line: InvoiceLine) => {
        setEditingLine(line);
        setFormData({
            invoiceId: line.invoiceId,
            lineNumber: line.lineNumber,
            description: line.description || '',
            unit: line.unit || '',
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount || 0,
            taxRate: line.taxRate || 0,
            taxAmount: line.taxAmount || 0,
            lineTotal: line.lineTotal,
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            const response = await invoiceLineService.deleteInvoiceLine(deleteTargetId);
            if (response.success) {
                await loadInvoiceLines();
            }
        } catch (error) {
            console.error('Error deleting invoice line:', error);
        } finally {
            setDeleteLoading(false);
            setDeleteTargetId(null);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            invoiceId: 1,
            lineNumber: 1,
            quantity: 1,
            unitPrice: 0,
            lineTotal: 0,
        });
        setEditingLine(null);
    };

    const handleFormChange = (value: Partial<CreateInvoiceLineRequest>) => {
        setFormData(prev => {
            const newData = { ...prev, ...value };

            // Auto-calculate lineTotal when other values change
            if (value.quantity !== undefined || value.unitPrice !== undefined ||
                value.discount !== undefined || value.taxAmount !== undefined) {
                const qty = newData.quantity || 0;
                const price = newData.unitPrice || 0;
                const discount = newData.discount || 0;
                const tax = newData.taxAmount || 0;
                newData.lineTotal = (qty * price * (1 - discount / 100)) + tax;
            }

            return newData;
        });
    };

    const columns: TableColumn[] = [
        {
            key: 'invoiceId',
            label: 'ID Hóa đơn',
            dataKey: 'invoiceId',
        },
        {
            key: 'lineNumber',
            label: 'Số dòng',
            dataKey: 'lineNumber',
        },
        {
            key: 'description',
            label: 'Mô tả',
            render: (row: any) => (
                <div className="truncate max-w-xs" title={row.description}>
                    {row.description || '-'}
                </div>
            ),
        },
        {
            key: 'quantity',
            label: 'Số lượng',
            render: (row: any) => `${row.quantity} ${row.unit || ''}`.trim(),
        },
        {
            key: 'unitPrice',
            label: 'Đơn giá',
            render: (row: any) => Number(row.unitPrice).toLocaleString('vi-VN'),
        },
        {
            key: 'lineTotal',
            label: 'Tổng dòng',
            render: (row: any) => Number(row.lineTotal).toLocaleString('vi-VN'),
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
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Chi tiết Hóa đơn</h2>
                <Button
                    appearance="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md"
                >
                    Tạo Chi tiết mới
                </Button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            <InvoiceLineModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                loading={loading}
                editingLine={editingLine}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={performDelete}
                title="Xóa chi tiết hóa đơn"
                message="Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?"
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleteLoading}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table
                    data={invoiceLines}
                    columns={columns}
                    loading={loading}
                    className="w-full"
                    showRowNumbers={false}
                    pageIndex={0}
                    pageSize={10}
                    emptyText="Không có chi tiết hóa đơn nào"
                    showPagination={true}
                    totalCount={invoiceLines.length}
                />
            </div>
        </div>
    );
}