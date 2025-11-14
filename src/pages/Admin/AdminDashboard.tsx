import React from 'react';

export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-800">Total Users</h3>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800">Total Invoices</h3>
                    <p className="text-2xl font-bold text-green-600">5,678</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-yellow-800">Pending Approvals</h3>
                    <p className="text-2xl font-bold text-yellow-600">12</p>
                </div>
            </div>
        </div>
    );
}