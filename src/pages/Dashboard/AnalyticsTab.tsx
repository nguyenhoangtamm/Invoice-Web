import React from 'react';
import { BarChart3 } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
    return (
        <div className="text-center py-20">
            <BarChart3 size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thống kê & Phân tích</h2>
            <p className="text-gray-600">Tính năng đang được phát triển</p>
        </div>
    );
};

export default AnalyticsTab;
