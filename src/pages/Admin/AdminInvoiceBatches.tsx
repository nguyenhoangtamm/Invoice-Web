import React, { useState, useEffect, FC } from 'react';
import { invoiceBatchService } from '../../api/services/invoiceBatchService';
import type { InvoiceBatch, CreateInvoiceBatchRequest, UpdateInvoiceBatchRequest } from '../../types/admin';
import { Button, Form, Modal, InputPicker, DatePicker } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
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

                    <Form.Group controlId="batchCid">
                        <Form.ControlLabel>Batch CID</Form.ControlLabel>
                        <Form.Control name="batchCid" />
                    </Form.Group>

                    <Form.Group controlId="status">
                        <Form.ControlLabel>Trạng thái</Form.ControlLabel>
                        <Form.Control
                            name="status"
                            accepter={InputPicker}
                            data={[
                                { label: 'Nháp', value: 0 },
                                { label: 'Đang xử lý', value: 1 },
                                { label: 'Hoàn thành', value: 2 },
                                { label: 'Thất bại', value: 3 },
                            ]}
                            style={{ width: '100%' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="txHash">
                        <Form.ControlLabel>Tx Hash</Form.ControlLabel>
                        <Form.Control name="txHash" />
                    </Form.Group>

                    <Form.Group controlId="blockNumber">
                        <Form.ControlLabel>Block Number</Form.ControlLabel>
                        <Form.Control name="blockNumber" type="number" />
                    </Form.Group>

                    <Form.Group controlId="confirmedAt">
                        <Form.ControlLabel>Confirmed At</Form.ControlLabel>
                        <Form.Control name="confirmedAt" accepter={DatePicker} format="yyyy-MM-dd" style={{ width: '100%' }} />
                    </Form.Group>

                    {/* Removed batchName and description fields per requested JSON shape */}
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
        count: 0,
        merkleRoot: '' as any,
        batchCid: null,
        status: undefined,
        txHash: null,
        blockNumber: null,
        confirmedAt: null,
    });
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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
                // normalize formData before sending
                const updatePayload: any = { id: editingBatch.id, ...formData };
                if (updatePayload.confirmedAt instanceof Date) {
                    updatePayload.confirmedAt = updatePayload.confirmedAt.toISOString();
                }
                if (typeof updatePayload.status === 'string' && !isNaN(Number(updatePayload.status))) {
                    updatePayload.status = Number(updatePayload.status);
                }
                const response = await invoiceBatchService.updateInvoiceBatch(updatePayload as UpdateInvoiceBatchRequest);
                if (response.success) {
                    await loadBatches();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const createPayload: any = { ...formData };
                if (createPayload.confirmedAt instanceof Date) {
                    createPayload.confirmedAt = createPayload.confirmedAt.toISOString();
                }
                if (typeof createPayload.status === 'string' && !isNaN(Number(createPayload.status))) {
                    createPayload.status = Number(createPayload.status);
                }
                const response = await invoiceBatchService.createInvoiceBatch(createPayload as CreateInvoiceBatchRequest);
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
            count: batch.count ?? batch.totalInvoices ?? 0,
            merkleRoot: batch.merkleRoot ?? null,
            batchCid: batch.batchCid ?? null,
            status: batch.status ?? undefined,
            txHash: batch.txHash ?? null,
            blockNumber: batch.blockNumber ?? null,
            confirmedAt: batch.confirmedAt ? new Date(batch.confirmedAt) : null,
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            const response = await invoiceBatchService.deleteInvoiceBatch(deleteTargetId);
            if (response.success) {
                await loadBatches();
            }
        } catch (error) {
            console.error('Error deleting batch:', error);
        } finally {
            setDeleteLoading(false);
            setDeleteTargetId(null);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            batchId: '',
            count: 0,
            merkleRoot: '' as any,
            batchCid: null,
            status: undefined,
            txHash: null,
            blockNumber: null,
            confirmedAt: null,
        });
        setEditingBatch(null);
    };

    // RSuite Form will provide the entire form value object on change
    const handleFormChange = (value: Partial<CreateInvoiceBatchRequest>) => {
        setFormData(prev => ({
            ...prev,
            ...value,
            count: value.count !== undefined ? Number(value.count) : prev.count,
            blockNumber: value.blockNumber !== undefined && value.blockNumber !== null ? Number((value as any).blockNumber) : prev.blockNumber,
            // keep status as provided (number or string)
            status: (value as any).status !== undefined ? (value as any).status : prev.status,
            // keep confirmedAt as-is (Date or string) — normalize before submit
            confirmedAt: (value as any).confirmedAt !== undefined ? (value as any).confirmedAt : prev.confirmedAt,
        } as CreateInvoiceBatchRequest));
    };

    const getStatusBadge = (status: string | number) => {
        // Support both numeric and string status representations
        const numeric = typeof status === 'number' ? status : (Number(status) >= 0 ? Number(status) : NaN);

        const configByNumber: Record<number, { label: string; className: string }> = {
            0: { label: 'Nháp', className: 'bg-gray-100 text-gray-800' },
            1: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
            2: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
            3: { label: 'Thất bại', className: 'bg-red-100 text-red-800' },
        };

        const configByString: Record<string, { label: string; className: string }> = {
            'draft': { label: 'Nháp', className: 'bg-gray-100 text-gray-800' },
            'processing': { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' },
            'completed': { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
            'failed': { label: 'Thất bại', className: 'bg-red-100 text-red-800' },
        };

        let config = undefined as { label: string; className: string } | undefined;
        if (!Number.isNaN(numeric)) {
            config = configByNumber[numeric];
        }
        if (!config) {
            config = configByString[String(status) as keyof typeof configByString];
        }
        if (!config) {
            config = configByNumber[0];
        }

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
                {config.label}
            </span>
        );
    };
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
            key: 'batchCid',
            label: 'Batch CID',
            render: (row: any) => row.batchCid ? <div className="truncate max-w-xs">{row.batchCid}</div> : '-',
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
            flexGrow: 1,
            render: (row: any) => (
                <div>
                    <Button appearance="link" size="sm" className="mr-3" onClick={() => handleEdit(row)}>Sửa</Button>
                    <Button appearance="link" size="sm" color="red" onClick={() => setDeleteTargetId(String(row.id))}>Xóa</Button>
                </div>
            ),
        },
    ];
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

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={performDelete}
                title="Xóa lô hóa đơn"
                message="Bạn có chắc chắn muốn xóa lô hóa đơn này?"
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleteLoading}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
            </div>
        </div>
    );
}