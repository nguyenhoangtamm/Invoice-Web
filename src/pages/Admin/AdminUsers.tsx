import React, { useState, useEffect } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../api/services/userService';
import type { AdminUserDto, UserPayload } from '../../api/services/userService';
import { Button, Form, Modal, InputPicker } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import { roleService } from '../../api/services/roleService';

interface Props {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingUser: AdminUserDto | null;
    formValue: UserPayload;
    onChange: (val: Partial<UserPayload>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
    roles: Array<{ label: string; value: string }>;
}

const UserModal: React.FC<Props> = ({ open, onClose, loading, editingUser, formValue, onChange, onSubmit, roles }) => {
    return (
        <Modal open={open} onClose={onClose} size="md">
            <Modal.Header>
                <Modal.Title>{editingUser ? 'Sửa Người dùng' : 'Tạo Người dùng'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid formValue={formValue} onChange={(val: any) => onChange(val)}>
                    <Form.Group controlId="username">
                        <Form.ControlLabel>Tên đăng nhập *</Form.ControlLabel>
                        <Form.Control name="username" />
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.ControlLabel>Email *</Form.ControlLabel>
                        <Form.Control name="email" type="email" />
                    </Form.Group>

                    {!editingUser && (
                        <Form.Group controlId="password">
                            <Form.ControlLabel>Mật khẩu *</Form.ControlLabel>
                            <Form.Control name="password" type="password" />
                        </Form.Group>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Group controlId="firstName">
                            <Form.ControlLabel>Tên *</Form.ControlLabel>
                            <Form.Control name="firstName" />
                        </Form.Group>

                        <Form.Group controlId="lastName">
                            <Form.ControlLabel>Họ *</Form.ControlLabel>
                            <Form.Control name="lastName" />
                        </Form.Group>
                    </div>

                    <Form.Group controlId="phone">
                        <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                        <Form.Control name="phone" />
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.ControlLabel>Địa chỉ</Form.ControlLabel>
                        <Form.Control name="address" componentClass="textarea" rows={3} />
                    </Form.Group>

                    <Form.Group controlId="roleIds">
                        <Form.ControlLabel>Vai trò *</Form.ControlLabel>
                        <Form.Control
                            name="roleIds"
                            accepter={InputPicker}
                            data={roles}
                            multiple
                            style={{ width: '100%' }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button appearance="subtle" onClick={onClose}>
                    Hủy
                </Button>
                <Button appearance="primary" onClick={() => { void onSubmit(); }} loading={loading}>
                    {editingUser ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [roles, setRoles] = useState<Array<{ label: string; value: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserDto | null>(null);
    const [formData, setFormData] = useState<UserPayload>({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        roleIds: [],
        status: 'active',
    });
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchUsers({ page: 1, pageSize: 100 });
            setUsers(response.items || []);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await roleService.getAllRoles();
            const roleOptions = response.map((role: any) => ({
                label: role.name,
                value: role.id
            }));
            setRoles(roleOptions);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        setLoading(true);

        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            await loadUsers();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: AdminUserDto) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || '',
            address: user.address || '',
            roleIds: user.roles.map(role => role.id),
            status: user.status,
        });
        setShowModal(true);
    };

    const performDelete = async () => {
        if (!deleteTargetId) return;
        setDeleteLoading(true);
        setLoading(true);
        try {
            await deleteUser(deleteTargetId);
            await loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setDeleteLoading(false);
            setDeleteTargetId(null);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            roleIds: [],
            status: 'active',
        });
        setEditingUser(null);
    };

    const handleFormChange = (value: Partial<UserPayload>) => {
        setFormData(prev => ({ ...prev, ...value }));
    };

    const columns: TableColumn[] = [
        {
            key: 'username',
            label: 'Tên đăng nhập',
            dataKey: 'username',
        },
        {
            key: 'fullName',
            label: 'Họ tên',
            dataKey: 'fullName',
        },
        {
            key: 'email',
            label: 'Email',
            dataKey: 'email',
        },
        {
            key: 'phone',
            label: 'Điện thoại',
            dataKey: 'phone',
        },
        {
            key: 'roles',
            label: 'Vai trò',
            render: (row: any) => (
                <div>
                    {row.roles?.map((role: any) => (
                        <span key={role.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                            {role.name}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row: any) => (
                <span className={`inline-block px-2 py-1 rounded text-xs ${row.status === 'active' ? 'bg-green-100 text-green-800' :
                        row.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {row.status === 'active' ? 'Hoạt động' :
                        row.status === 'inactive' ? 'Không hoạt động' : 'Tạm khóa'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Thao tác',
            isAction: true,
            flexGrow: 1,
            render: (row: any) => (
                <div>
                    <Button appearance="link" size="sm" className="mr-3" onClick={() => handleEdit(row)}>
                        Sửa
                    </Button>
                    <Button appearance="link" size="sm" color="red" onClick={() => setDeleteTargetId(row.id)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
                <Button
                    appearance="primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md"
                >
                    Tạo Người dùng mới
                </Button>
            </div>

            <UserModal
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                loading={loading}
                editingUser={editingUser}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                roles={roles}
            />

            <ConfirmModal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                onConfirm={performDelete}
                title="Xóa người dùng"
                message="Bạn có chắc chắn muốn xóa người dùng này?"
                type="delete"
                confirmText="Xóa"
                cancelText="Hủy"
                loading={deleteLoading}
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table
                    data={users}
                    columns={columns}
                    loading={loading}
                    className="w-full"
                    showRowNumbers={false}
                    pageIndex={0}
                    pageSize={10}
                    emptyText="Không có người dùng nào"
                    showPagination={true}
                    totalCount={users.length}
                />
            </div>
        </div>
    );
}