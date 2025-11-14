import React from 'react';
import { X } from 'lucide-react';

export interface Field {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string | number }[];
    rows?: number; // for textarea
}

export interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: Field[];
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => Promise<void>;
    submitText?: string;
    loading?: boolean;
}

export function AdminModal({
    isOpen,
    onClose,
    title,
    fields,
    initialData = {},
    onSubmit,
    submitText = 'Lưu',
    loading = false
}: AdminModalProps) {
    const [formData, setFormData] = React.useState<Record<string, any>>(initialData);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        setFormData(initialData);
        setErrors({});
    }, [initialData, isOpen]);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} là bắt buộc`;
            }

            if (field.type === 'email' && formData[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.name])) {
                    newErrors[field.name] = 'Email không hợp lệ';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            // Error handling is done by parent component
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(field => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>

                                {field.type === 'select' ? (
                                    <select
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors[field.name] ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">-- Chọn {field.label} --</option>
                                        {field.options?.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        rows={field.rows || 3}
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors[field.name] ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                ) : field.type === 'checkbox' ? (
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData[field.name] || false}
                                            onChange={(e) => handleChange(field.name, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{field.placeholder}</span>
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        placeholder={field.placeholder}
                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors[field.name] ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                )}

                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang xử lý...
                                    </div>
                                ) : (
                                    submitText
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}