import React, { useState } from 'react';
import { Plus, Key, Trash2, Eye, EyeOff, Copy } from 'lucide-react';

interface ApiKey {
    id: number;
    name: string;
    key: string;
    created: string;
    lastUsed: string;
}

const ApiKeysTab: React.FC = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([
        { id: 1, name: 'Production Key', key: 'ik_prod_a1b2c3d4e5f6g7h8', created: '2025-01-15', lastUsed: '2025-11-13' }
    ]);
    const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});

    const generateApiKey = () => {
        const newKey = {
            id: apiKeys.length + 1,
            name: `API Key ${apiKeys.length + 1}`,
            key: `ik_prod_${Math.random().toString(36).substr(2, 16)}`,
            created: new Date().toISOString().split('T')[0],
            lastUsed: 'Chưa sử dụng'
        };
        setApiKeys([...apiKeys, newKey]);
    };

    const toggleShowApiKey = (id: number) => {
        setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const deleteApiKey = (id: number) => {
        setApiKeys(prev => prev.filter(key => key.id !== id));
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
                    <p className="text-gray-600 mt-1">Quản lý API keys để tích hợp với hệ thống của bạn</p>
                </div>
                <button
                    onClick={generateApiKey}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tạo API Key
                </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                    ⚠️ Cấu hình whitelist endpoints để ngăn chặn sử dụng trái phép. API keys có quyền truy cập đầy đủ vào tài khoản của bạn.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {apiKeys.map((apiKey, index) => (
                    <div key={apiKey.id} className={`p-6 ${index !== apiKeys.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Key className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-sm text-gray-500">Tạo: {apiKey.created}</span>
                                        <span className="text-sm text-gray-500">Sử dụng: {apiKey.lastUsed}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteApiKey(apiKey.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <code className="text-sm font-mono text-gray-700">
                                {showApiKey[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                            </code>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleShowApiKey(apiKey.id)}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                >
                                    {showApiKey[apiKey.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(apiKey.key)}
                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
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
