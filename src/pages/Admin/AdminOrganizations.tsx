import React, { useState, useEffect } from 'react';
import { organizationService } from '../../api/services/organizationService';
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../types/admin';

export default function AdminOrganizations() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
    const [deletingOrganization, setDeletingOrganization] = useState<Organization | null>(null);

    const {
        data,
        loading,
        error,
        handlePageChange,
        handlePageSizeChange,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useAdminData<Organization, CreateOrganizationRequest, UpdateOrganizationRequest>({
        fetchPaginated: organizationService.getOrganizationsPaginated.bind(organizationService),
        create: organizationService.createOrganization.bind(organizationService),
        update: organizationService.updateOrganization.bind(organizationService),
        delete: organizationService.deleteOrganization.bind(organizationService),
        getById: organizationService.getOrganizationById.bind(organizationService),
    });

    const columns: Column<Organization>[] = [
        {
            key: 'name',
            title: 'Tên tổ chức',
            width: '200px',
        },
        {
            key: 'email',
            title: 'Email',
            width: '180px',
        },
        {
            key: 'phone',
            title: 'Số điện thoại',
            width: '120px',
        },
        {
            key: 'taxCode',
            title: 'Mã số thuế',
            width: '120px',
        },
        {
            key: 'address',
            title: 'Địa chỉ',
            width: '200px',
            render: (value) => (
                <div className="truncate max-w-48" title={value}>
                    {value || '-'}
                </div>
            ),
        },
        {
            key: 'isActive',
            title: 'Trạng thái',
            width: '100px',
        },
        {
            key: 'createdAt',
            title: 'Ngày tạo',
            width: '120px',
        },
    ];

    const formFields: Field[] = [
        {
            name: 'name',
            label: 'Tên tổ chức',
            type: 'text',
            required: true,
            maxLength: 200,
            placeholder: 'Nhập tên tổ chức'
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            maxLength: 100,
            placeholder: 'Nhập địa chỉ email'
        },
        {
            name: 'phone',
            label: 'Số điện thoại',
            type: 'text',
            maxLength: 20,
            placeholder: 'Nhập số điện thoại'
        },
        {
            name: 'taxCode',
            label: 'Mã số thuế',
            type: 'text',
            maxLength: 20,
            placeholder: 'Nhập mã số thuế'
        },
        {
            name: 'address',
            label: 'Địa chỉ',
            type: 'textarea',
            maxLength: 300,
            placeholder: 'Nhập địa chỉ tổ chức',
            rows: 3
        },
        {
            name: 'description',
            label: 'Mô tả',
            type: 'textarea',
            maxLength: 500,
            placeholder: 'Nhập mô tả về tổ chức',
            rows: 3
        },
        {
            name: 'isActive',
            label: 'Hoạt động',
            type: 'checkbox',
        }
    ];

    const handleAdd = () => {
        setIsCreateModalOpen(true);
    };

    const handleEdit = (organization: Organization) => {
        setEditingOrganization(organization);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (organization: Organization) => {
        setDeletingOrganization(organization);
        setIsDeleteModalOpen(true);
    };

    const handleCreateSubmit = async (formData: CreateOrganizationRequest): Promise<boolean> => {
        return await handleCreate(formData);
    };

    const handleEditSubmit = async (formData: Partial<Organization>): Promise<boolean> => {
        if (!editingOrganization) return false;
        
        const updateData: UpdateOrganizationRequest = {
            id: editingOrganization.id,
            name: formData.name!,
            email: formData.email,
            phone: formData.phone,
            taxCode: formData.taxCode,
            address: formData.address,
            description: formData.description,
            isActive: formData.isActive ?? true,
        };
        
        return await handleUpdate(updateData);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingOrganization) return;
        
        const success = await handleDelete(deletingOrganization.id);
        if (success) {
            setIsDeleteModalOpen(false);
            setDeletingOrganization(null);
        }
    };

    return (
        <>
            <AdminTable<Organization>
                title="Quản lý tổ chức"
                columns={columns}
                data={data}
                loading={loading}
                error={error}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                addButtonText="Thêm tổ chức"
            />

            <AdminModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                title="Thêm tổ chức mới"
                fields={formFields}
            />

            <AdminModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingOrganization(null);
                }}
                onSubmit={handleEditSubmit}
                title="Chỉnh sửa tổ chức"
                fields={formFields}
                initialData={editingOrganization || undefined}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingOrganization(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa tổ chức"
                message={`Bạn có chắc chắn muốn xóa tổ chức "${deletingOrganization?.name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                type="danger"
            />
        </>
    );
}