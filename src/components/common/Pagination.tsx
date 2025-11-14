import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    showInfo?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage = 10,
    showInfo = true
}: PaginationProps) {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number' && page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    if (totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            {showInfo && totalItems && (
                <div className="flex-1 flex justify-between sm:hidden">
                    <p className="text-sm text-gray-700">
                        Hiển thị {startItem} - {endItem} / {totalItems} kết quả
                    </p>
                </div>
            )}

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                {showInfo && totalItems && (
                    <div>
                        <p className="text-sm text-gray-700">
                            Hiển thị{' '}
                            <span className="font-medium">{startItem}</span>
                            {' - '}
                            <span className="font-medium">{endItem}</span>
                            {' trong '}
                            <span className="font-medium">{totalItems}</span>
                            {' kết quả'}
                        </p>
                    </div>
                )}

                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* First page button */}
                        <button
                            type="button"
                            onClick={() => handlePageClick(1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Trang đầu"
                        >
                            <ChevronsLeft className="h-5 w-5" />
                        </button>

                        {/* Previous page button */}
                        <button
                            type="button"
                            onClick={() => handlePageClick(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Trang trước"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Page numbers */}
                        {getVisiblePages().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handlePageClick(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        aria-label={`Trang ${page}`}
                                        aria-current={page === currentPage ? 'page' : undefined}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Next page button */}
                        <button
                            type="button"
                            onClick={() => handlePageClick(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Trang sau"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Last page button */}
                        <button
                            type="button"
                            onClick={() => handlePageClick(totalPages)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Trang cuối"
                        >
                            <ChevronsRight className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}