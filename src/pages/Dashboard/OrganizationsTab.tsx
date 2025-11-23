import React, { useEffect, useState } from 'react';
import { Plus, Settings, Trash2, Building2, Edit } from 'lucide-react';
import type { Organization } from '../../types/organization';
import { getOrganizationByMe, deleteOrganization, updateOrganizationStatus } from '../../api/services/organizationService';
import { useAuth } from '../../contexts/AuthContext';
import AddOrganizationModal from '../../components/AddOrganizationModal';
import EditOrganizationModal from '../../components/EditOrganizationModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/ToastProvider';

const OrganizationsTab: React.FC = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState<string>('');

    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
                const response = await getOrganizationByMe();
                if (response.succeeded && response.data) {
                    const orgDatas = response.data;
                    const organizationsList = orgDatas.map((orgData) => {
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
                        return organization;
                    });
                    setOrganizations(organizationsList);
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

    const handleDeleteOrganization = async () => {
        if (!selectedOrgId) return;

        try {
            const response = await deleteOrganization(selectedOrgId);
            if (response.succeeded) {
                setOrganizations(prev => prev.filter(org => org.id !== selectedOrgId));
                setDeleteModalOpen(false);
                setSelectedOrgId('');
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Tổ chức đã được xóa thành công!'
                });
            } else {
                console.error('Error deleting organization:', response.message);
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: response.message || 'Có lỗi xảy ra khi xóa tổ chức'
                });
            }
        } catch (error) {
            console.error('Error deleting organization:', error);
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi xóa tổ chức'
            });
        }
    };

    const handleToggleStatus = async (orgId: string, currentStatus: boolean) => {
        try {
            const response = await updateOrganizationStatus(parseInt(orgId), !currentStatus);
            if (response.succeeded) {
                setOrganizations(prev =>
                    prev.map(org =>
                        org.id === orgId
                            ? { ...org, isActive: !currentStatus }
                            : org
                    )
                );
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: `Trạng thái tổ chức đã được ${!currentStatus ? 'kích hoạt' : 'tắt'}`
                });
            } else {
                console.error('Error updating organization status:', response.message);
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: response.message || 'Có lỗi xảy ra khi cập nhật trạng thái tổ chức'
                });
            }
        } catch (error) {
            console.error('Error updating organization status:', error);
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi cập nhật trạng thái tổ chức'
            });
        }
    };

    const handleOrganizationAdded = () => {
        // Refresh the organizations list
        if (user) {
            const fetchOrganizations = async () => {
                setLoading(true);
                try {
                    const response = await getOrganizationByMe();
                    if (response.succeeded && response.data) {
                        const orgDatas = response.data;
                        const organizationsList = orgDatas.map((orgData) => {
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
                            return organization;
                        });
                        setOrganizations(organizationsList);
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
            fetchOrganizations();
        }
    };

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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Thêm tổ chức
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {organizations.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có tổ chức nào</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Bắt đầu bằng cách tạo tổ chức đầu tiên của bạn.
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                        >
                            <Plus size={20} />
                            Thêm tổ chức đầu tiên
                        </button>
                    </div>
                ) : (
                    organizations.map((org, index) => (
                        <div key={org.id} className={`p-6 ${index !== organizations.length - 1 ? 'border-b border-gray-200' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Building2 className="text-blue-600" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{org.organizationName}</h3>
                                        <p className="text-gray-600 mt-1">Mã số thuế: {org.taxCode}</p>
                                        {org.address && (
                                            <p className="text-sm text-gray-500 mt-1">Địa chỉ: {org.address}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-4 mt-3">
                                            <span className="text-sm text-gray-500">ID: ORG-{org.id}</span>
                                            {org.phone && (
                                                <span className="text-sm text-gray-500">SĐT: {org.phone}</span>
                                            )}
                                            {org.email && (
                                                <span className="text-sm text-gray-500">Email: {org.email}</span>
                                            )}
                                            <button
                                                onClick={() => handleToggleStatus(org.id, org.isActive)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${org.isActive
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                {org.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedOrgId(org.id);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                        title="Chỉnh sửa tổ chức"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedOrgId(org.id);
                                            setDeleteModalOpen(true);
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Xóa tổ chức"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Organization Modal */}
            <AddOrganizationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onOrganizationAdded={handleOrganizationAdded}
            />

            {/* Edit Organization Modal */}
            <EditOrganizationModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedOrgId('');
                }}
                onOrganizationUpdated={handleOrganizationAdded}
                organizationId={selectedOrgId}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedOrgId('');
                }}
                onConfirm={handleDeleteOrganization}
                title="Xóa tổ chức"
                message="Bạn có chắc chắn muốn xóa tổ chức này? Hành động này không thể hoàn tác."
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
            />
        </div>
    );
};

export default OrganizationsTab;
