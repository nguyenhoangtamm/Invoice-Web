import React, { useState, useEffect, FC } from 'react';
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from '../../types/organization';
import type { PaginatedResult } from '../../types/common';
import { Button, Form, Modal, Checkbox } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import { createOrganization, deleteOrganization, getOrganizationsPaginated, updateOrganization } from '../../api/services/organizationService';

type Props = {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingOrganization: Organization | null;
    formValue: CreateOrganizationRequest;
    onChange: (val: Partial<CreateOrganizationRequest>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
};

const OrganizationModal: FC<Props> = ({ open, onClose, loading, editingOrganization, formValue, onChange, onSubmit }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size="md"
        >
            <Modal.Header>
                <Modal.Title>{editingOrganization ? 'Sửa Tổ chức' : 'Tạo Tổ chức'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form
                    fluid
                    formValue={formValue}
                    onChange={(val: any) => onChange(val)}
                >
                    <Form.Group controlId="organizationName">
                        <Form.ControlLabel>Tên tổ chức *</Form.ControlLabel>
                        <Form.Control name="organizationName" />
                    </Form.Group>

                    <Form.Group controlId="organizationBankAccount">
                        <Form.ControlLabel>Số tài khoản</Form.ControlLabel>
                        <Form.Control
                            name="organizationBankAccount"
                        />
                    </Form.Group>

                    <Form.Group controlId="organizationTaxId">
                        <Form.ControlLabel>Mã số thuế</Form.ControlLabel>
                        <Form.Control name="organizationTaxId" />
                    </Form.Group>

                    <Form.Group controlId="organizationAddress">
                        <Form.ControlLabel>Địa chỉ</Form.ControlLabel>
                        <Form.Control
                            name="organizationAddress"
                            componentClass="textarea"
                            rows={3}
                        />
                    </Form.Group>

                    <Form.Group controlId="organizationPhone">
                        <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                        <Form.Control name="organizationPhone" />
                    </Form.Group>

                    <Form.Group controlId="organizationEmail">
                        <Form.ControlLabel>Email</Form.ControlLabel>
                        <Form.Control name="organizationEmail" type="email" />
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
                    {editingOrganization ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default function AdminOrganizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
    const [formData, setFormData] = useState<CreateOrganizationRequest>({
        organizationName: '',
        organizationTaxId: '',
        organizationAddress: '',
        organizationPhone: '',
        organizationEmail: '',
        organizationBankAccount: '',
    });
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Pagination states
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadOrganizations();
    }, [pageIndex, pageSize]);

    const loadOrganizations = async () => {
        setLoading(true);
        try {
            const response = await getOrganizationsPaginated(pageIndex + 1, pageSize);
            if (response.succeeded && response.data) {
                setOrganizations(response.data || []);
                setTotalCount(response.totalPages || 0);
            }
        } catch (error) {
            console.error('Error loading organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setLoading(true);

        try {
            if (editingOrganization) {
                const updateData: UpdateOrganizationRequest = {
                    id: editingOrganization.id,
                    ...formData,
                };
                const response = await updateOrganization(updateData);
                if (response.succeeded) {
                    await loadOrganizations();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await createOrganization(formData);
                if (response.succeeded) {
                    await loadOrganizations();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving organization:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (organization: Organization) => {
        setEditingOrganization(organization);
        setFormData({
            organizationName: organization.organizationName || '',
            organizationTaxId: organization.organizationTaxId || '',
            organizationAddress: organization.organizationAddress || '',
            organizationPhone: organization.organizationPhone || '',
            organizationEmail: organization.organizationEmail || '',
            organizationBankAccount: organization.organizationBankAccount || '',
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            const response = await deleteOrganization(deleteTargetId);
            if (response.succeeded) {
                await loadOrganizations();
            }
        } catch (error) {
            console.error('Error deleting organization:', error);
        } finally {
            setDeleteLoading(false);
            setDeleteTargetId(null);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            organizationName: '',
            organizationTaxId: '',
            organizationAddress: '',
            organizationPhone: '',
            organizationEmail: '',
            organizationBankAccount: '',
        });
        setEditingOrganization(null);
    };

    const handleFormChange = (value: Partial<CreateOrganizationRequest>) => {
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
            key: 'organizationName',
            label: 'Tên tổ chức',
            dataKey: 'organizationName',
            flexGrow: 1,
        },
        {
            key: 'organizationTaxId',
            label: 'Mã số thuế',
            dataKey: 'organizationTaxId',
            render: (row: any) => row.organizationTaxId || '-',
            width: 150,
        },
        {
            key: 'organizationPhone',
            label: 'Số điện thoại',
            dataKey: 'organizationPhone',
            render: (row: any) => row.organizationPhone || '-',
            width: 150,
        },
        {
            key: 'organizationEmail',
            label: 'Email',
            dataKey: 'organizationEmail',
            render: (row: any) => row.organizationEmail || '-',
            width: 200,
        },
        {
            key: 'organizationAddress',
            label: 'Địa chỉ',
            render: (row: any) => (
                <div className="truncate max-w-xs" title={row.organizationAddress}>
                    {row.organizationAddress || '-'}
                </div>
            ),
            flexGrow: 1,
        },
        {
            key: 'actions',
            label: 'Thao tác',
            isAction: true,
            flexGrow: 1,
            render: (row: any) => (
                <div>
                    <Button appearance="link" size="sm" className="mr-3" onClick={() => handleEdit(row)}>Sửa</Button>
                    <Button appearance="link" size="sm" color="red" onClick={() => setDeleteTargetId(row.id)}>Xóa</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Tổ chức</h2>
                <Button
                    appearance="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md"
                >
                    Tạo Tổ chức mới
                </Button>
            </div>

            <OrganizationModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                loading={loading}
                editingOrganization={editingOrganization}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            />

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={performDelete}
                title="Xóa tổ chức"
                message="Bạn có chắc chắn muốn xóa tổ chức này?"
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleteLoading}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table
                    data={organizations}
                    columns={columns}
                    loading={loading}
                    className="w-full"
                    showRowNumbers={true}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    emptyText="Không có tổ chức nào"
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