import React, { useState, useEffect } from 'react';
import { Plus, Key, Trash2, Eye, EyeOff, Copy, AlertCircle } from 'lucide-react';
import { Modal, Form, Input, Button, Checkbox, SelectPicker, Message, useToaster, DatePicker } from 'rsuite';
import type { ApiKey } from '../../types/apiKey';
import { createApiKey, deleteApiKey, getApiKeysPaginated } from '../../api/services/apiKeyService';
import { getAllOrganizations } from '../../api/services/organizationService';

const ApiKeysTab: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [newApiKeyData, setNewApiKeyData] = useState<{
        apiKey?: string;
        name: string;
        expiresAt?: string;
    } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        active: true,
        organizationId: null as number | null,
        expirationDate: null as Date | null
    });
    const [organizations, setOrganizations] = useState<Array<{ id: number, name: string }>>([]);
    const toaster = useToaster();

    useEffect(() => {
        fetchApiKeys();
        fetchOrganizations();
    }, []);
    console.log('Organizations:', organizations);
    const fetchOrganizations = async () => {
        try {
            const response = await getAllOrganizations();
            if (response.succeeded && response.data && Array.isArray(response.data)) {
                console.log('Fetched organizations:', response.data);
                setOrganizations(response.data
                    .filter(org => org && org.id && org.organizationName) // Filter out invalid entries
                    .map(org => ({
                        id: org.id,
                        name: org.organizationName
                    })));
            } else {
                setOrganizations([]);
            }
        } catch (err) {
            console.error('Error fetching organizations:', err);
            setOrganizations([]);
        }
    };

    const fetchApiKeys = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getApiKeysPaginated();
            if (response.succeeded && response.data) {
                setApiKeys(response.data);
            } else {
                setError(response.message || 'Lỗi khi tải danh sách API keys');
            }
        } catch (err) {
            setError('Không thể tải danh sách API keys');
            console.error('Error fetching API keys:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateApiKey = async () => {
        try {
            setIsCreating(true);
            setError(null);

            // Calculate expirationDays from expirationDate
            let expirationDays = 30;
            if (formData.expirationDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expDate = new Date(formData.expirationDate);
                expDate.setHours(0, 0, 0, 0);
                expirationDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                expirationDays = Math.max(1, expirationDays); // Ensure at least 1 day
            }

            // Convert organizationId to number for API request
            const apiKeyData = {
                name: formData.name,
                active: formData.active,
                organizationId: formData.organizationId ? formData.organizationId : 0,
                expirationDays: expirationDays
            };

            const response = await createApiKey(apiKeyData);
            if (response.succeeded && response.data) {
                // Store the API key data to show in modal
                setNewApiKeyData({
                    apiKey: response.data.apiKey,
                    name: response.data.name,
                    expiresAt: response.data?.expiresAt
                });

                // Add the new API key to the list (without the actual key, only hash)
                const apiKeyWithoutKey = { ...response.data };
                delete apiKeyWithoutKey.apiKey; // Remove the actual API key from the stored data
                setApiKeys(prev => [...prev, apiKeyWithoutKey]);

                setShowCreateModal(false);
                setShowApiKeyModal(true); // Show the API key modal
                setFormData({
                    name: '',
                    active: true,
                    organizationId: null,
                    expirationDate: null
                });
            } else {
                setError(response.message || 'Lỗi khi tạo API key');
            }
        } catch (err) {
            setError('Không thể tạo API key mới');
            console.error('Error creating API key:', err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleFormChange = (field: string, value: string | number | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDeleteApiKey = async (id: string) => {
        try {
            setError(null);
            const response = await deleteApiKey(id);
            if (response.succeeded) {
                setApiKeys(prev => prev.filter(key => key.id !== id));
                toaster.push(<Message type="success">Xóa API key thành công!</Message>, {
                    placement: 'topCenter',
                    duration: 3000
                });
            } else {
                setError(response.message || 'Lỗi khi xóa API key');
            }
        } catch (err) {
            setError('Không thể xóa API key');
            console.error('Error deleting API key:', err);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toaster.push(<Message type="success">Đã copy API key vào clipboard!</Message>, {
                placement: 'topCenter',
                duration: 3000
            });
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            toaster.push(<Message type="error">Không thể copy API key!</Message>, {
                placement: 'topCenter',
                duration: 3000
            });
        }
    };

    const handleCloseApiKeyModal = () => {
        setShowApiKeyModal(false);
        setNewApiKeyData(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
                    <p className="text-gray-600 mt-1">Quản lý API keys để tích hợp với hệ thống của bạn</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    disabled={isCreating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={20} />
                    Tạo API Key mới
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    ⚠️ Cấu hình whitelist endpoints để ngăn chặn sử dụng trái phép. API keys có quyền truy cập đầy đủ vào tài khoản của bạn.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* Show API Key Modal - One time display */}
            <Modal
                open={showApiKeyModal}
                onClose={handleCloseApiKeyModal}
                size="lg"
                backdrop="static"
            >
                <Modal.Header>
                    <Modal.Title className="text-green-600 flex items-center gap-2">
                        <Key size={24} />
                        API Key được tạo thành công!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-yellow-800 font-semibold mb-1">Quan trọng!</h4>
                                    <p className="text-yellow-700 text-sm">
                                        Đây là lần duy nhất bạn có thể xem API key này.
                                        Hãy copy và lưu trữ ở nơi an toàn.
                                        Bạn sẽ không thể xem lại API key này sau khi đóng modal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên API Key
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-900 font-medium">{newApiKeyData?.name}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Key
                            </label>
                            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                                <code className="text-green-400 text-sm font-mono break-all">
                                    {newApiKeyData?.apiKey}
                                </code>
                                <Button
                                    onClick={() => copyToClipboard(newApiKeyData?.apiKey || '')}
                                    appearance="primary"
                                    size="sm"
                                    className="ml-3"
                                >
                                    <Copy size={16} className="mr-1" />
                                    Copy
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày hết hạn
                            </label>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-900">
                                    {newApiKeyData?.expiresAt ? formatDate(newApiKeyData.expiresAt) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleCloseApiKeyModal}
                        appearance="primary"
                    >
                        Đã lưu API Key
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Create API Key Modal */}
            <Modal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                size="md"
            >
                <Modal.Header>
                    <Modal.Title>Tạo API Key mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel>Tên API Key *</Form.ControlLabel>
                            <Form.Control
                                name="name"
                                accepter={Input}
                                value={formData.name}
                                onChange={(value) => handleFormChange('name', value)}
                                placeholder="Nhập tên cho API key"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Tổ chức *</Form.ControlLabel>
                            <Form.Control
                                name="organizationId"
                                accepter={SelectPicker}
                                data={organizations.length > 0 ? organizations
                                    .filter(org => org.id && org.name) // Ensure valid data
                                    .map(org => ({
                                        label: String(org.name || 'Không có tên'),
                                        value: org.id
                                    })) : []}
                                value={formData.organizationId}
                                onChange={(value) => handleFormChange('organizationId', value || null)}
                                placeholder={organizations.length === 0 ? "Đang tải..." : "Chọn tổ chức"}
                                style={{ width: '100%' }}
                                cleanable={false}
                                loading={organizations.length === 0}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>Ngày hết hạn *</Form.ControlLabel>
                            <Form.Control
                                name="expirationDate"
                                accepter={DatePicker}
                                value={formData.expirationDate}
                                onChange={(value) => handleFormChange('expirationDate', value)}
                                placeholder="Chọn ngày hết hạn"
                                style={{ width: '100%' }}
                                isoWeek={false}
                                format="dd/MM/yyyy"
                                disabledDate={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date ? date < today : false;
                                }}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Checkbox
                                checked={formData.active}
                                onChange={(value, checked) => handleFormChange('active', checked)}
                            >
                                Kích hoạt API Key
                            </Checkbox>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleCreateApiKey}
                        appearance="primary"
                        loading={isCreating}
                        disabled={!formData.name.trim() || !formData.organizationId || !formData.expirationDate}
                    >
                        Tạo API Key
                    </Button>
                    <Button
                        onClick={() => setShowCreateModal(false)}
                        appearance="subtle"
                    >
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : apiKeys.length === 0 ? (
                    <div className="text-center py-12">
                        <Key size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Chưa có API keys</h3>
                        <p className="text-gray-600">Tạo API key đầu tiên để bắt đầu tích hợp</p>
                    </div>
                ) : (
                    apiKeys.map((apiKey, index) => (
                        <div key={apiKey.id} className={`p-6 ${index !== apiKeys.length - 1 ? 'border-b border-gray-200' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <Key className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm text-gray-500">
                                                Tạo: {formatDate(apiKey.createdAt || apiKey.createdDate || '')}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {apiKey.expiresAt ? `Hết hạn: ${formatDate(apiKey.expiresAt)}` : `Hết hạn sau: ${apiKey.expirationDays} ngày`}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${apiKey.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {apiKey.active ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteApiKey(apiKey.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Hướng dẫn sử dụng API</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">1. Authentication</h4>
                        <div className="bg-gray-900 rounded-lg p-4">
                            <code className="text-green-400 text-sm">
                                curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                                &nbsp;&nbsp;https://api.invoicestorage.vn/v1/invoices
                            </code>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">2. Upload Invoice</h4>
                        <div className="bg-gray-900 rounded-lg p-4">
                            <code className="text-green-400 text-sm">
                                curl -X POST \<br />
                                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                                &nbsp;&nbsp;-F "file=@invoice.pdf" \<br />
                                &nbsp;&nbsp;https://api.invoicestorage.vn/v1/upload
                            </code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeysTab;
