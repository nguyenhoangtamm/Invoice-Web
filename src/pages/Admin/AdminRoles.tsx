import React, { useState, useEffect, FC } from 'react';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from '../../types/role';
import type { PaginatedResult } from '../../types/common';
import { Button, Form, Modal, Checkbox } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import {
    getRolesPaginated,
    createRole,
    updateRole,
    deleteRole
} from '../../api/services/roleService';

type Props = {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingRole: Role | null;
    formValue: CreateRoleRequest;
    onChange: (val: Partial<CreateRoleRequest>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
};

const RoleModal: FC<Props> = ({ open, onClose, loading, editingRole, formValue, onChange, onSubmit }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size="sm"
        >
            <Modal.Header>
                <Modal.Title>{editingRole ? 'Sửa Vai trò' : 'Tạo Vai trò'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    fluid
                    formValue={formValue}
                    onChange={(val: any) => onChange(val)}
                >
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Tên vai trò *</Form.ControlLabel>
                        <Form.Control name="name" />
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.ControlLabel>Mô tả</Form.ControlLabel>
                        <Form.Control
                            name="description"
                            componentClass="textarea"
                            rows={3}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    appearance="subtle"
                    onClick={onClose}
                >
                    Hủy
                </Button>
                <Button
                    appearance="primary"
                    onClick={() => { void onSubmit(); }}
                    loading={loading}
                >
                    {editingRole ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default function AdminRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<CreateRoleRequest>({
        name: '',
        description: '',
        isActive: true,
    });
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Pagination states
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadRoles();
    }, [pageIndex, pageSize]);

    const loadRoles = async () => {
        setLoading(true);
        try {
            const response = await getRolesPaginated(pageIndex + 1, pageSize);
            if (response.succeeded && response.data) {
                setRoles(response.data || []);
                setTotalCount(response.totalPages || 0);
            }
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setLoading(true);

        try {
            if (editingRole) {
                const updateData: UpdateRoleRequest = {
                    id: editingRole.id,
                    ...formData,
                };
                const response = await updateRole(updateData);
                if (response.succeeded) {
                    await loadRoles();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await createRole(formData);
                if (response.succeeded) {
                    await loadRoles();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving role:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            isActive: role.isActive,
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            const response = await deleteRole(deleteTargetId);
            if (response.succeeded) {
                await loadRoles();
            }
        } catch (error) {
            console.error('Error deleting role:', error);
        } finally {
            setDeleteLoading(false);
            setDeleteTargetId(null);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            isActive: true,
        });
        setEditingRole(null);
    };

    const handleFormChange = (value: Partial<CreateRoleRequest>) => {
        setFormData(prev => ({
            ...prev,
            ...value,
        }));
    };

    // Pagination handlers
    const handlePageChange = (newPageIndex: number) => {
        setPageIndex(newPageIndex);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setPageIndex(0); // Reset to first page when changing page size
    };

    const columns: TableColumn[] = [
        {
            key: 'name',
            label: 'Tên vai trò',
            dataKey: 'name',
        },
        {
            key: 'description',
            label: 'Mô tả',
            dataKey: 'description',
            render: (row: any) => row.description || '-',
        },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            render: (row: any) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('vi-VN') : '-',
        },
        {
            key: 'actions',
            label: 'Thao tác',
            isAction: true,
            flexGrow: 1,
            render: (row: any) => (
                <div>
                    <Button appearance="link" size="sm" className="mr-3" onClick={() => handleEdit(row)}>Sửa</Button>
                    <Button appearance="link" size="sm" color="red" onClick={() => setDeleteTargetId(String(row.id))}>Xóa</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Vai trò</h2>
                <Button
                    appearance="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md"
                >
                    Tạo Vai trò mới
                </Button>
            </div>

            <RoleModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                loading={loading}
                editingRole={editingRole}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={performDelete}
                title="Xóa vai trò"
                message="Bạn có chắc chắn muốn xóa vai trò này?"
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleteLoading}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table
                    data={roles}
                    columns={columns}
                    loading={loading}
                    className="w-full"
                    showRowNumbers={true}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    emptyText="Không có vai trò nào"
                    showPagination={true}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    height={560}
                />
            </div>
        </div>
    );
}