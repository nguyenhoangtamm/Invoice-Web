import React, { useState, useEffect, FC } from 'react';
import { invoiceBatchService } from '../../api/services/invoiceBatchService';
import type { InvoiceBatch, CreateInvoiceBatchRequest, UpdateInvoiceBatchRequest } from '../../types/admin';
import { Button, Form, Modal } from 'rsuite';
import Table from '../../components/common/table';
import type { TableColumn } from '../../components/common/table';

type Props = {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingBatch: InvoiceBatch | null;
    formValue: CreateInvoiceBatchRequest;
    onChange: (val: Partial<CreateInvoiceBatchRequest>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
};

const InvoiceBatchModal: FC<Props> = ({ open, onClose, loading, editingBatch, formValue, onChange, onSubmit }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size="sm"
        >
            <Modal.Header>
                <Modal.Title>{editingBatch ? 'Sửa Lô Hóa đơn' : 'Tạo Lô Hóa đơn'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    fluid
                    formValue={formValue}
                    onChange={(val: any) => onChange(val)}
                >
                    <Form.Group controlId="batchId">
                        <Form.ControlLabel>Mã lô *</Form.ControlLabel>
                        <Form.Control name="batchId" />
                    </Form.Group>

                    <Form.Group controlId="count">
                        <Form.ControlLabel>Số lượng *</Form.ControlLabel>
                        <Form.Control name="count" type="number" />
                    </Form.Group>

                    <Form.Group controlId="merkleRoot">
                        <Form.ControlLabel>Merkle Root</Form.ControlLabel>
                        <Form.Control name="merkleRoot" />
                    </Form.Group>

                    <Form.Group controlId="batchName">
                        <Form.ControlLabel>Tên lô *</Form.ControlLabel>
                        <Form.Control name="batchName" />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.ControlLabel>Mô tả</Form.ControlLabel>
                        <Form.Control name="description" accepter="textarea" rows={3} />
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
                    {editingBatch ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default function AdminInvoiceBatches() {
    const [batches, setBatches] = useState<InvoiceBatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBatch, setEditingBatch] = useState<InvoiceBatch | null>(null);
    const [formData, setFormData] = useState<CreateInvoiceBatchRequest>({
        batchId: '',
        batchName: '',
        description: '',
        count: 0,
        merkleRoot: '' as any,
    });

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const response = await invoiceBatchService.getInvoiceBatchesPaginated();
            if (response.success && response.data) {
                setBatches(response.data.data);
            }
        } catch (error) {
            console.error('Error loading batches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setLoading(true);

        try {
            if (editingBatch) {
                const updateData: UpdateInvoiceBatchRequest = {
                    id: editingBatch.id,
                    ...formData,
                    status: editingBatch.status,
                };
                const response = await invoiceBatchService.updateInvoiceBatch(updateData);
                if (response.success) {
                    await loadBatches();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await invoiceBatchService.createInvoiceBatch(formData);
                if (response.success) {
                    await loadBatches();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving batch:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (batch: InvoiceBatch) => {
        setEditingBatch(batch);
        setFormData({
            batchId: String(batch.batchId ?? batch.id ?? ''),
            batchName: batch.batchName ?? '',
            description: batch.description || '',
            count: batch.count ?? batch.totalInvoices ?? 0,
            merkleRoot: batch.merkleRoot ?? null,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lô hóa đơn này?')) {
            setLoading(true);
            try {
                const response = await invoiceBatchService.deleteInvoiceBatch(id);
                if (response.success) {
                    await loadBatches();
                }
            } catch (error) {
                console.error('Error deleting batch:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            batchId: '',
            batchName: '',
            description: '',
            count: 0,
            merkleRoot: '' as any,
        });
        setEditingBatch(null);
    };

    // RSuite Form will provide the entire form value object on change
    const handleFormChange = (value: Partial<CreateInvoiceBatchRequest>) => {
        setFormData(prev => ({
            ...prev,
            ...value,
            count: value.count !== undefined ? Number(value.count) : prev.count,
        } as CreateInvoiceBatchRequest));
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'draft': { label: 'Nháp', className: 'bg-gray-100 text-gray-800' },
            'processing': { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
            'completed': { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
            'failed': { label: 'Thất bại', className: 'bg-red-100 text-red-800' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const getProgressPercentage = (processed: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((processed / total) * 100);
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Lô Hóa đơn</h2>
                <Button
                    appearance="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md"
                >
                    Tạo Lô mới
                </Button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            <InvoiceBatchModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                loading={loading}
                editingBatch={editingBatch}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Use shared Table component */}
                {
                    (() => {
                        const columns: TableColumn[] = [
                            {
                                key: 'batchId',
                                label: 'Mã lô',
                                dataKey: 'batchId',
                                render: (row: any) => row.batchId || row.batchName || '-',
                            },
                            {
                                key: 'status',
                                label: 'Trạng thái',
                                render: (row: any) => getStatusBadge(String(row.status)),
                            },
                            {
                                key: 'count',
                                label: 'Số lượng',
                                dataKey: 'count',
                                render: (row: any) => row.count ?? row.totalInvoices ?? 0,
                            },
                            {
                                key: 'merkleRoot',
                                label: 'Merkle Root',
                                render: (row: any) => row.merkleRoot ? <div className="truncate max-w-xs">{row.merkleRoot}</div> : '-',
                            },
                            {
                                key: 'txHash',
                                label: 'Tx Hash',
                                render: (row: any) => row.txHash ? <div className="truncate max-w-xs">{row.txHash}</div> : '-',
                            },
                            {
                                key: 'blockNumber',
                                label: 'Block',
                                dataKey: 'blockNumber',
                            },
                            {
                                key: 'confirmedAt',
                                label: 'Xác nhận',
                                render: (row: any) => row.confirmedAt ? new Date(row.confirmedAt).toLocaleString('vi-VN') : '-',
                            },
                            {
                                key: 'actions',
                                label: 'Thao tác',
                                isAction: true,
                                render: (row: any) => (
                                    <div>
                                        <Button appearance="link" size="sm" className="mr-3" onClick={() => handleEdit(row)}>Sửa</Button>
                                        <Button appearance="link" size="sm" color="red" onClick={() => handleDelete(String(row.id))}>Xóa</Button>
                                    </div>
                                ),
                            },
                        ];

                        return (
                            <Table
                                data={batches}
                                columns={columns}
                                loading={loading}
                                className="w-full"
                                showRowNumbers={false}
                                pageIndex={0}
                                pageSize={10}
                                emptyText="Không có lô hóa đơn nào"
                            />
                        );
                    })()
                }
            </div>
        </div>
    );
}