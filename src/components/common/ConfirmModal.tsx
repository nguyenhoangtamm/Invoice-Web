import React from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle, X } from 'lucide-react';

export type ConfirmType = 'delete' | 'warning' | 'info' | 'success';

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    message: string;
    type?: ConfirmType;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warning',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    loading = false
}: ConfirmModalProps) {
    const handleConfirm = async () => {
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            // Error handling is done by parent component
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'delete':
                return <Trash2 className="w-6 h-6 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            case 'info':
                return <Info className="w-6 h-6 text-blue-600" />;
            case 'success':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            default:
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
        }
    };

    const getConfirmButtonClass = () => {
        switch (type) {
            case 'delete':
                return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
            default:
                return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
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
                        <div className="flex items-center">
                            {getIcon()}
                            <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonClass()}`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang xử lý...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}