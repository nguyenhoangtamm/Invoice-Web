import React, { useState, useEffect } from 'react';
import { X, Building2, Phone, Mail, MapPin, Hash, CreditCard } from 'lucide-react';
import { updateOrganization, getOrganizationById } from '../api/services/organizationService';
import type { Organization } from '../types/organization';
import { useToast } from './common/ToastProvider';

interface EditOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOrganizationUpdated: () => void;
    organizationId?: string | number;
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
    isOpen,
    onClose,
    onOrganizationUpdated,
    organizationId
}) => {
    if (!isOpen || !organizationId) return null;
    const [formData, setFormData] = useState<Organization>({
        id: 0,
        organizationName: '',
        organizationTaxId: '',
        organizationAddress: '',
        organizationPhone: '',
        organizationEmail: '',
        organizationBankAccount: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Organization>>({});
    const { showToast } = useToast();

    // Fetch organization data when modal opens
    useEffect(() => {
        const fetchOrganization = async () => {
            if (!isOpen || !organizationId) return;

            setFetchLoading(true);
            try {
                const response = await getOrganizationById(typeof organizationId === 'string' ? parseInt(organizationId) : organizationId);
                if (response.succeeded && response.data) {
                    const org = response.data;
                    setFormData({
                        id: org.id,
                        organizationName: org.organizationName || '',
                        organizationTaxId: org.organizationTaxId || '',
                        organizationAddress: org.organizationAddress || '',
                        organizationPhone: org.organizationPhone || '',
                        organizationEmail: org.organizationEmail || '',
                        organizationBankAccount: org.organizationBankAccount || ''
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
        const newErrors: Partial<Organization> = {};

        if (!formData.organizationName.trim()) {
            newErrors.organizationName = 'Tên tổ chức là bắt buộc';
        }

        if (!formData.organizationTaxId?.trim()) {
            newErrors.organizationTaxId = 'Mã số thuế là bắt buộc';
        } else if (!/^[0-9]{10,13}$/.test(formData.organizationTaxId.trim())) {
            newErrors.organizationTaxId = 'Mã số thuế phải từ 10-13 chữ số';
        }

        if (!formData.organizationAddress?.trim()) {
            newErrors.organizationAddress = 'Địa chỉ là bắt buộc';
        }

        if (!formData.organizationPhone?.trim()) {
            newErrors.organizationPhone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.organizationPhone.replace(/\s/g, ''))) {
            newErrors.organizationPhone = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!formData.organizationEmail?.trim()) {
            newErrors.organizationEmail = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizationEmail)) {
            newErrors.organizationEmail = 'Email không hợp lệ';
        }

        if (!formData.organizationBankAccount?.trim()) {
            newErrors.organizationBankAccount = 'Số tài khoản ngân hàng là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const apiPayload = {
                id: formData.id,
                organizationName: formData.organizationName,
                organizationTaxId: formData.organizationTaxId,
                organizationAddress: formData.organizationAddress,
                organizationPhone: formData.organizationPhone,
                organizationEmail: formData.organizationEmail,
                organizationBankAccount: formData.organizationBankAccount
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
                setErrors({ organizationName: errorMessage });
            }
        } catch (error) {
            console.error('Error updating organization:', error);
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi cập nhật tổ chức'
            });
            setErrors({ organizationName: 'Có lỗi xảy ra khi cập nhật tổ chức' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof Organization, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setFormData({
            id: 0,
            organizationName: '',
            organizationTaxId: '',
            organizationAddress: '',
            organizationPhone: '',
            organizationEmail: '',
            organizationBankAccount: ''
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
                                        value={formData.organizationName}
                                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.organizationName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập tên tổ chức"
                                    />
                                </div>
                                {errors.organizationName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
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
                                        value={formData.organizationTaxId}
                                        onChange={(e) => handleInputChange('organizationTaxId', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.organizationTaxId ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="0123456789"
                                    />
                                </div>
                                {errors.organizationTaxId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organizationTaxId}</p>
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
                                        value={formData.organizationPhone || ''}
                                        onChange={(e) => handleInputChange('organizationPhone', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.organizationPhone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="0123456789"
                                    />
                                </div>
                                {errors.organizationPhone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organizationPhone}</p>
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
                                        value={formData.organizationEmail || ''}
                                        onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.organizationEmail ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="example@company.com"
                                    />
                                </div>
                                {errors.organizationEmail && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organizationEmail}</p>
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
                                        value={formData.organizationAddress || ''}
                                        onChange={(e) => handleInputChange('organizationAddress', e.target.value)}
                                        rows={3}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.organizationAddress ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập địa chỉ tổ chức"
                                    />
                                </div>
                                {errors.organizationAddress && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organizationAddress}</p>
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
                                        value={formData.organizationBankAccount || ''}
                                        onChange={(e) => handleInputChange('organizationBankAccount', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.organizationBankAccount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập số tài khoản ngân hàng"
                                    />
                                </div>
                                {errors.organizationBankAccount && (
                                    <p className="mt-1 text-sm text-red-600">{errors.organizationBankAccount}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Mô tả về tổ chức (tùy chọn)"
                                    disabled
                                />
                            </div>

                            {/* Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        disabled
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