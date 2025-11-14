import React, { useState, useEffect } from 'react';
import { menuService } from '../../api/services/menuService';
import { roleService } from '../../api/services/roleService';
import type { Menu, CreateMenuRequest, UpdateMenuRequest, Role } from '../../types/admin';

export default function AdminMenus() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [formData, setFormData] = useState<CreateMenuRequest>({
        title: '',
        url: '',
        icon: '',
        parentId: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        loadMenus();
        loadRoles();
    }, []);

    const loadMenus = async () => {
        setLoading(true);
        try {
            const response = await menuService.getMenuTree();
            if (response.success && response.data) {
                setMenus(response.data);
            }
        } catch (error) {
            console.error('Error loading menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await roleService.getAllRoles();
            if (response.success && response.data) {
                setRoles(response.data);
            }
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const menuData = {
                ...formData,
                parentId: formData.parentId || undefined,
            };

            if (editingMenu) {
                const updateData: UpdateMenuRequest = {
                    id: editingMenu.id,
                    ...menuData,
                };
                const response = await menuService.updateMenu(updateData);
                if (response.success) {
                    await loadMenus();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await menuService.createMenu(menuData);
                if (response.success) {
                    await loadMenus();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (menu: Menu) => {
        setEditingMenu(menu);
        setFormData({
            title: menu.title,
            url: menu.url || '',
            icon: menu.icon || '',
            parentId: menu.parentId || '',
            order: menu.order,
            isActive: menu.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa menu này?')) {
            setLoading(true);
            try {
                const response = await menuService.deleteMenu(id);
                if (response.success) {
                    await loadMenus();
                }
            } catch (error) {
                console.error('Error deleting menu:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            url: '',
            icon: '',
            parentId: '',
            order: 0,
            isActive: true,
        });
        setEditingMenu(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                name === 'order' ? parseInt(value) || 0 : value
        }));
    };

    const renderMenuTree = (menuList: Menu[], level = 0) => {
        return menuList.map((menu) => (
            <React.Fragment key={menu.id}>
                <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center">
                                {level > 0 && <span className="text-gray-400 mr-2">└─</span>}
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{menu.title}</div>
                                    {menu.url && (
                                        <div className="text-sm text-gray-500">{menu.url}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {menu.icon && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {menu.icon}
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {menu.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${menu.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {menu.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(menu.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                            onClick={() => handleEdit(menu)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                            Sửa
                        </button>
                        <button
                            onClick={() => handleDelete(menu.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            Xóa
                        </button>
                    </td>
                </tr>
                {menu.children && menu.children.length > 0 && renderMenuTree(menu.children, level + 1)}
            </React.Fragment>
        ));
    };

    const flattenMenus = (menuList: Menu[]): Menu[] => {
        let result: Menu[] = [];
        menuList.forEach(menu => {
            result.push(menu);
            if (menu.children && menu.children.length > 0) {
                result = result.concat(flattenMenus(menu.children));
            }
        });
        return result;
    };

    const parentMenuOptions = flattenMenus(menus).filter(menu => !menu.parentId);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Menu</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Thêm Menu
                </button>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Icon
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thứ tự
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderMenuTree(menus)}
                    </tbody>
                </table>

                {menus.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        Không có menu nào
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {editingMenu ? 'Sửa Menu' : 'Thêm Menu'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tiêu đề *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        URL
                                    </label>
                                    <input
                                        type="text"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="/admin/example"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Icon
                                    </label>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={formData.icon}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="dashboard, users, settings..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Menu cha
                                    </label>
                                    <select
                                        name="parentId"
                                        value={formData.parentId}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">-- Không có --</option>
                                        {parentMenuOptions.map((menu) => (
                                            <option key={menu.id} value={menu.id}>
                                                {menu.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Thứ tự
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        min="0"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Hoạt động
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {loading ? 'Đang lưu...' : editingMenu ? 'Cập nhật' : 'Thêm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}