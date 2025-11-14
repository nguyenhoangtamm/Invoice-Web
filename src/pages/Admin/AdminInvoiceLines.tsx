import React, { useState, useEffect } from 'react';
import { invoiceLineService } from '../../api/services/invoiceLineService';
import type { InvoiceLine, CreateInvoiceLineRequest, UpdateInvoiceLineRequest } from '../../api/services/invoiceLineService';

export default function AdminInvoiceLines() {
    const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingLine, setEditingLine] = useState<InvoiceLine | null>(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
    const [formData, setFormData] = useState<CreateInvoiceLineRequest>({
        invoiceId: '',
        lineNumber: 1,
        description: '',
        unit: '',
        quantity: 1,
        unitPrice: 0,
        taxAmount: 0,
    });

    useEffect(() => {
        loadInvoiceLines();
    }, []);

    const loadInvoiceLines = async () => {
        setLoading(true);
        try {
            const response = await invoiceLineService.getAllInvoiceLines();
            if (response.success && response.data) {
                setInvoiceLines(response.data);
            }
        } catch (error) {
            console.error('Error loading invoice lines:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadInvoiceLinesByInvoice = async (invoiceId: string) => {
        if (!invoiceId) {
            loadInvoiceLines();
            return;
        }

        setLoading(true);
        try {
            const response = await invoiceLineService.getInvoiceLinesByInvoice(invoiceId);
            if (response.success && response.data) {
                setInvoiceLines(response.data);
            }
        } catch (error) {
            console.error('Error loading invoice lines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingLine) {
                const updateData: UpdateInvoiceLineRequest = {
                    id: editingLine.id,
                    ...formData,
                };
                const response = await invoiceLineService.updateInvoiceLine(updateData);
                if (response.success) {
                    if (selectedInvoiceId) {
                        await loadInvoiceLinesByInvoice(selectedInvoiceId);
                    } else {
                        await loadInvoiceLines();
                    }
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await invoiceLineService.createInvoiceLine(formData);
                if (response.success) {
                    if (selectedInvoiceId) {
                        await loadInvoiceLinesByInvoice(selectedInvoiceId);
                    } else {
                        await loadInvoiceLines();
                    }
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
            description: line.description,
            unit: line.unit || '',
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxAmount: line.taxAmount || 0,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dòng hóa đơn này?')) {
            setLoading(true);
            try {
                const response = await invoiceLineService.deleteInvoiceLine(id);
                if (response.success) {
                    if (selectedInvoiceId) {
                        await loadInvoiceLinesByInvoice(selectedInvoiceId);
                    } else {
                        await loadInvoiceLines();
                    }
                }
            } catch (error) {
                console.error('Error deleting invoice line:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            invoiceId: selectedInvoiceId || '',
            lineNumber: 1,
            description: '',
            unit: '',
            quantity: 1,
            unitPrice: 0,
            taxAmount: 0,
        });
        setEditingLine(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleInvoiceFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const invoiceId = e.target.value;
        setSelectedInvoiceId(invoiceId);
        loadInvoiceLinesByInvoice(invoiceId);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Chi tiết Hóa đơn</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Chi tiết
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4 flex items-center space-x-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lọc theo mã hóa đơn:
                    </label>
                    <input
                        type="text"
                        value={selectedInvoiceId}
                        onChange={handleInvoiceFilterChange}
                        placeholder="Nhập mã hóa đơn..."
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={() => {
                            setSelectedInvoiceId('');
                            loadInvoiceLines();
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
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
                                Mã HĐ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Đơn vị
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Đơn giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thành tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoiceLines.map((line) => (
                            <tr key={line.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {line.invoiceId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {line.lineNumber}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {line.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {line.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {line.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatCurrency(line.unitPrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(line.lineTotal)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(line)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(line.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {invoiceLines.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        Không có chi tiết hóa đơn nào
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingLine ? 'Sửa Chi tiết Hóa đơn' : 'Thêm Chi tiết Hóa đơn'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Mã hóa đơn *
                                    </label>
                                    <input
                                        type="text"
                                        name="invoiceId"
                                        required
                                        value={formData.invoiceId}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập mã hóa đơn"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Số thứ tự *
                                        </label>
                                        <input
                                            type="number"
                                            name="lineNumber"
                                            required
                                            value={formData.lineNumber}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Đơn vị
                                        </label>
                                        <input
                                            type="text"
                                            name="unit"
                                            value={formData.unit}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="VND, Cái, Hộp..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Mô tả *
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Mô tả sản phẩm/dịch vụ"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Số lượng *
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            required
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            min="1"
                                            step="0.01"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Đơn giá *
                                        </label>
                                        <input
                                            type="number"
                                            name="unitPrice"
                                            required
                                            value={formData.unitPrice}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Thuế
                                    </label>
                                    <input
                                        type="number"
                                        name="taxAmount"
                                        value={formData.taxAmount}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-sm text-gray-700">
                                        <strong>Thành tiền: </strong>
                                        {formatCurrency((formData.quantity * formData.unitPrice) + (formData.taxAmount || 0))}
                                    </div>
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
                                        {loading ? 'Đang lưu...' : editingLine ? 'Cập nhật' : 'Thêm'}
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