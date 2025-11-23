import React, { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, MapPin, Hash, CreditCard } from 'lucide-react';
import { updateOrganization, getOrganizationById } from '../api/services/organizationService';
import type { UpdateOrganizationFormData, Organization } from '../types/organization';
import { useToast } from './common/ToastProvider';

interface EditOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrganizationUpdated: () => void;
    organizationId: string;
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
    isOpen,
    onClose,
    onOrganizationUpdated,
    organizationId
}) => {
    const [formData, setFormData] = useState<UpdateOrganizationFormData>({
        id: '',
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        taxCode: '',
        bankAccount: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<UpdateOrganizationFormData>>({});
    const { showToast } = useToast();

    // Fetch organization data when modal opens
    useEffect(() => {
        const fetchOrganization = async () => {
            if (!isOpen || !organizationId) return;

            setFetchLoading(true);
            try {
                const response = await getOrganizationById(organizationId);
                if (response.succeeded && response.data) {
                    const org = response.data;
                    setFormData({
                        id: org.id,
                        name: org.organizationName,
                        description: org.description || '',
                        address: org.address || '',
                        phone: org.phone || '',
                        email: org.email || '',
                        taxCode: org.taxCode || '',
                        bankAccount: '', // This field might not be available in org data
                        isActive: org.isActive
                    });
                }
            } catch (error) {
                console.error('Error fetching organization:', error);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchOrganization();
    }, [isOpen, organizationId]);

    const validateForm = (): boolean => {
        const newErrors: Partial<UpdateOrganizationFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên tổ chức là bắt buộc';
        }

        if (!formData.taxCode?.trim()) {
            newErrors.taxCode = 'Mã số thuế là bắt buộc';
        } else if (!/^[0-9]{10,13}$/.test(formData.taxCode.trim())) {
            newErrors.taxCode = 'Mã số thuế phải từ 10-13 chữ số';
        }

        if (!formData.address?.trim()) {
            newErrors.address = 'Địa chỉ là bắt buộc';
        }

        if (!formData.phone?.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.bankAccount?.trim()) {
            newErrors.bankAccount = 'Số tài khoản ngân hàng là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // Convert form data to API payload
            const apiPayload = {
                id: formData.id,
                organizationName: formData.name,
                organizationTaxId: formData.taxCode || '',
                organizationAddress: formData.address || '',
                organizationPhone: formData.phone || '',
                organizationEmail: formData.email || '',
                organizationBankAccount: formData.bankAccount || ''
            };
            const response = await updateOrganization(apiPayload);

            if (response.succeeded) {
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Tổ chức đã được cập nhật thành công!'
                });
                onOrganizationUpdated();
                onClose();
            } else {
                // Handle API error
                const errorMessage = response.message || 'Có lỗi xảy ra khi cập nhật tổ chức';
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: errorMessage
                });
                setErrors({ name: errorMessage });
            }
        } catch (error) {
            console.error('Error updating organization:', error);
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi cập nhật tổ chức'
            });
            setErrors({ name: 'Có lỗi xảy ra khi cập nhật tổ chức' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof UpdateOrganizationFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setFormData({
            id: '',
            name: '',
            description: '',
            address: '',
            phone: '',
            email: '',
            taxCode: '',
            bankAccount: '',
            isActive: true
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa tổ chức</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {fetchLoading ? (
                    <div className="p-8 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Organization Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên tổ chức *
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập tên tổ chức"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Tax Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã số thuế *
                                </label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={formData.taxCode}
                                        onChange={(e) => handleInputChange('taxCode', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.taxCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="0123456789"
                                    />
                                </div>
                                {errors.taxCode && (
                                    <p className="mt-1 text-sm text-red-600">{errors.taxCode}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={formData.phone || ''}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="0123456789"
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="example@company.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <textarea
                                        value={formData.address || ''}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        rows={3}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập địa chỉ tổ chức"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>

                            {/* Bank Account */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số tài khoản ngân hàng *
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={formData.bankAccount || ''}
                                        onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.bankAccount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập số tài khoản ngân hàng"
                                    />
                                </div>
                                {errors.bankAccount && (
                                    <p className="mt-1 text-sm text-red-600">{errors.bankAccount}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Mô tả về tổ chức (tùy chọn)"
                                />
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Kích hoạt tổ chức</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    'Cập nhật'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditOrganizationModal;