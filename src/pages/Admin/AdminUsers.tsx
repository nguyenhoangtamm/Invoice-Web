import React, { useState, useEffect } from 'react';
import {
    getUsersPaginated,
    createUser,
    updateUser,
    deleteUser,
    getUser
} from '../../api/services/userService';
import type { AdminUserDto, UserPayload } from '../../types/user';
import { Button, Form, Modal, InputPicker } from 'rsuite';
import Table from '../../components/common/table';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import type { TableColumn } from '../../components/common/table';
import { getAllRoles } from '../../api/services/roleService';

interface Props {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    editingUser: AdminUserDto | null;
    formValue: UserPayload;
    onChange: (val: Partial<UserPayload>) => void;
    onSubmit: (e?: React.FormEvent) => Promise<void> | void;
    roles: Array<{ label: string; value: number }>;
    statusOptions: Array<{ label: string; value: number }>;
}

const UserModal: React.FC<Props> = ({ open, onClose, loading, editingUser, formValue, onChange, onSubmit, roles, statusOptions }) => {
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

                    <Form.Group controlId="fullname">
                        <Form.ControlLabel>Tên đầy đủ *</Form.ControlLabel>
                        <Form.Control name="fullname" />
                    </Form.Group>


                    <Form.Group controlId="phone">
                        <Form.ControlLabel>Số điện thoại</Form.ControlLabel>
                        <Form.Control name="phone" />
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.ControlLabel>Địa chỉ</Form.ControlLabel>
                        <Form.Control name="address" componentClass="textarea" rows={3} />
                    </Form.Group>

                    <Form.Group controlId="roleId">
                        <Form.ControlLabel>Vai trò *</Form.ControlLabel>
                        <Form.Control
                            name="roleId"
                            accepter={InputPicker}
                            data={roles}
                            searchable={true}
                            cleanable={false}
                            style={{ width: '100%' }}
                        />
                    </Form.Group>

                    <Form.Group controlId="status">
                        <Form.ControlLabel>Trạng thái *</Form.ControlLabel>
                        <Form.Control
                            name="status"
                            accepter={InputPicker}
                            data={statusOptions}
                            cleanable={false}
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

const STATUS_OPTIONS = [
    { label: 'Hoạt động', value: 1 },
    { label: 'Không hoạt động', value: 2 },
    { label: 'Tạm khóa', value: 3 },
];

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [roles, setRoles] = useState<Array<{ label: string; value: number }>>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserDto | null>(null);
    const [formData, setFormData] = useState<UserPayload>({
        username: '',
        email: '',
        password: '',
        fullname: '',
        phone: '',
        address: '',
        roleId: 0,
        status: 1,
    });
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Pagination states
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, [pageIndex, pageSize]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsersPaginated(pageIndex + 1, pageSize);
            if (response.succeeded && response.data) {
                setUsers(response.data || []);
                setTotalCount(response.totalPages || 0);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await getAllRoles();
            if (response && response.data) {
                const roleOptions = response.data.map((role: any) => ({
                    label: role.name,
                    value: parseInt(role.id) || role.id // Convert to number
                }));
                setRoles(roleOptions);
            }
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
        setModalLoading(true);

        // Gọi API get-by-id để lấy dữ liệu mới nhất
        getUser(user.id)
            .then((response) => {
                if (response.succeeded && response.data) {
                    const userData = response.data;
                    setFormData({
                        username: userData.username,
                        email: userData.email,
                        password: '',
                        fullname: userData.fullname,
                        phone: userData.phone || '',
                        address: userData.address || '',
                        roleId: userData.roleId,
                        status: userData.status,
                    });
                }
            })
            .catch((error) => {
                console.error('Error loading user details:', error);
            })
            .finally(() => {
                setModalLoading(false);
                setShowModal(true);
            });
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
            fullname: '',
            phone: '',
            address: '',
            roleId: 0,
            status: 1,
        });
        setEditingUser(null);
    };

    const handleFormChange = (value: Partial<UserPayload>) => {
        setFormData(prev => ({ ...prev, ...value }));
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
            key: 'username',
            label: 'Tên đăng nhập',
            dataKey: 'username',
            flexGrow: 1,
        },
        {
            key: 'fullname',
            label: 'Họ tên',
            dataKey: 'fullname',
            flexGrow: 1,
        },
        {
            key: 'email',
            label: 'Email',
            dataKey: 'email',
            flexGrow: 1,
        },
        {
            key: 'phone',
            label: 'Điện thoại',
            dataKey: 'phone',
            width: 150,
        },
        {
            key: 'roleName',
            label: 'Vai trò',
            render: (row: any) => (
                <span className={`inline-block text-white ${row.roleName === "Admin" ? 'bg-blue-400' : 'bg-green-400'} text-xs px-2 py-1 rounded mr-1`}>
                    {row.roleName}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (row: any) => (
                <span className={`inline-block px-2 py-1 rounded text-xs ${row.status === 1 ? 'bg-green-100 text-green-800' :
                    row.status === 2 ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {row.status === 1 ? 'Hoạt động' :
                        row.status === 2 ? 'Không hoạt động' : 'Tạm khóa'}
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
                loading={loading || modalLoading}
                editingUser={editingUser}
                formValue={formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                roles={roles}
                statusOptions={STATUS_OPTIONS}
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
                    showRowNumbers={true}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    emptyText="Không có người dùng nào"
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