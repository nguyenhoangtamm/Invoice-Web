import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
    key: keyof T | string;
    title: string;
    render?: (value: any, record: T, index: number) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

export interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
    rowSelection?: {
        selectedRowKeys: (string | number)[];
        onChange: (selectedRowKeys: (string | number)[]) => void;
    };
    onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
}

export function AdminTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    pagination,
    rowSelection,
    onRow
}: AdminTableProps<T>) {
    const handleSelectAll = (checked: boolean) => {
        if (rowSelection) {
            const allKeys = data.map((item, index) => item.id || index);
            rowSelection.onChange(checked ? allKeys : []);
        }
    };

    const handleSelectRow = (key: string | number, checked: boolean) => {
        if (rowSelection) {
            const newSelectedKeys = checked
                ? [...rowSelection.selectedRowKeys, key]
                : rowSelection.selectedRowKeys.filter(k => k !== key);
            rowSelection.onChange(newSelectedKeys);
        }
    };

    const isAllSelected = rowSelection ? rowSelection.selectedRowKeys.length === data.length && data.length > 0 : false;
    const isIndeterminate = rowSelection ? rowSelection.selectedRowKeys.length > 0 && rowSelection.selectedRowKeys.length < data.length : false;

    return (
        <div className="w-full">
            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {rowSelection && (
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        ref={(input) => {
                                            if (input) input.indeterminate = isIndeterminate;
                                        }}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                            )}
                            {columns.map((column, index) => (
                                <th
                                    key={String(column.key) || index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ width: column.width }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        <span className="ml-2">Đang tải...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (rowSelection ? 1 : 0)}
                                    className="px-6 py-4 text-center text-gray-500"
                                >
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            data.map((record, index) => {
                                const rowKey = record.id || index;
                                const isSelected = rowSelection?.selectedRowKeys.includes(rowKey);
                                const rowProps = onRow?.(record, index) || {};

                                return (
                                    <tr
                                        key={rowKey}
                                        className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                                        {...rowProps}
                                    >
                                        {rowSelection && (
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column, colIndex) => {
                                            const value = record[column.key as keyof T];
                                            const displayValue = column.render
                                                ? column.render(value, record, index)
                                                : String(value || '');

                                            return (
                                                <td
                                                    key={String(column.key) || colIndex}
                                                    className="px-6 py-4 text-sm text-gray-900"
                                                >
                                                    {displayValue}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                    <div className="flex justify-between flex-1 sm:hidden">
                        <button
                            onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                            disabled={pagination.current <= 1}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                            disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Tiếp
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Hiển thị{' '}
                                <span className="font-medium">
                                    {(pagination.current - 1) * pagination.pageSize + 1}
                                </span>{' '}
                                đến{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                                </span>{' '}
                                trong tổng số{' '}
                                <span className="font-medium">{pagination.total}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                                <button
                                    onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                                    disabled={pagination.current <= 1}
                                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) })
                                    .slice(Math.max(0, pagination.current - 3), pagination.current + 2)
                                    .map((_, index) => {
                                        const pageNum = Math.max(0, pagination.current - 3) + index + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => pagination.onChange(pageNum, pagination.pageSize)}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${pageNum === pagination.current
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                <button
                                    onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                                    disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}