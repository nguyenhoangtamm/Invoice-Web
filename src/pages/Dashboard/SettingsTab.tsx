import React from 'react';
import { Settings } from 'lucide-react';

const SettingsTab: React.FC = () => {
    return (
        <div className="text-center py-20">
            <Settings size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt</h2>
            <p className="text-gray-600">Tính năng đang được phát triển</p>
        </div>
    );
};

export default SettingsTab;
