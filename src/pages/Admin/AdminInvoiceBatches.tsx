import React, { useState, useEffect } from 'react';
import { invoiceBatchService } from '../../api/services/invoiceBatchService';
import type { InvoiceBatch, CreateInvoiceBatchRequest, UpdateInvoiceBatchRequest } from '../../types/admin';

export default function AdminInvoiceBatches() {
    const [batches, setBatches] = useState<InvoiceBatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBatch, setEditingBatch] = useState<InvoiceBatch | null>(null);
    const [formData, setFormData] = useState<CreateInvoiceBatchRequest>({
        batchName: '',
        description: '',
    });

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const response = await invoiceBatchService.getAllInvoiceBatches();
            if (response.success && response.data) {
                setBatches(response.data);
            }
        } catch (error) {
            console.error('Error loading batches:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            batchName: batch.batchName,
            description: batch.description || '',
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
            batchName: '',
            description: '',
        });
        setEditingBatch(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Tạo Lô mới
                </button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên lô
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiến độ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Số lượng HĐ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {batches.map((batch) => (
                            <tr key={batch.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                                        {batch.description && (
                                            <div className="text-sm text-gray-500">{batch.description}</div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(batch.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                                width: `${getProgressPercentage(batch.processedInvoices, batch.totalInvoices)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {getProgressPercentage(batch.processedInvoices, batch.totalInvoices)}%
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="text-center">
                                        <div className="font-medium">{batch.processedInvoices}/{batch.totalInvoices}</div>
                                        <div className="text-xs">đã xử lý</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(batch.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(batch)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                        disabled={batch.status === 'processing'}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(batch.id)}
                                        className="text-red-600 hover:text-red-900"
                                        disabled={batch.status === 'processing'}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {batches.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        Không có lô hóa đơn nào
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingBatch ? 'Sửa Lô Hóa đơn' : 'Tạo Lô Hóa đơn'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tên lô *
                                    </label>
                                    <input
                                        type="text"
                                        name="batchName"
                                        required
                                        value={formData.batchName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập tên lô hóa đơn"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Mô tả
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Mô tả về lô hóa đơn này"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {loading ? 'Đang lưu...' : editingBatch ? 'Cập nhật' : 'Tạo mới'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}