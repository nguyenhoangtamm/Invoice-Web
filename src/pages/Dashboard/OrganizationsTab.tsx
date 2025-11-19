import React, { useEffect, useState } from 'react';
import { Plus, Settings, Trash2, Building2 } from 'lucide-react';
import type { Organization } from '../../types/organization';
import { getOrganizationByMe } from '../../api/services/organizationService';
import { useAuth } from '../../contexts/AuthContext';

const OrganizationsTab: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
                const response = await getOrganizationByMe();
                if (response.succeeded && response.data) {
                    const orgDatas = response.data;
                    orgDatas.forEach((orgData) => {
                        const organization: Organization = {
                            id: orgData.id.toString(),
                            organizationName: orgData.organizationName,
                            taxCode: orgData.organizationTaxId,
                            address: orgData.organizationAddress,
                            phone: orgData.organizationPhone,
                            email: orgData.organizationEmail,
                            isActive: true,
                            createdAt: '',
                            updatedAt: ''
                        };
                        setOrganizations([organization]);
                    }
                );
                } else {
                    setOrganizations([]);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
                setOrganizations([]);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrganizations();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Tổ chức</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Plus size={20} />
                    Thêm tổ chức
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {organizations.map((org, index) => (
                    <div key={org.id} className={`p-6 ${index !== organizations.length - 1 ? 'border-b border-gray-200' : ''}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Building2 className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{org.organizationName}</h3>
                                    <p className="text-gray-600 mt-1">Mã số thuế: {org.taxCode}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-sm text-gray-500">ID: ORG-{org.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${org.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {org.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                    <Settings size={20} />
                                </button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrganizationsTab;
