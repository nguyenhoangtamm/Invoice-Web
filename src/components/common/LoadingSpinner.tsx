import React from 'react';

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

export function LoadingSpinner({
    size = 'md',
    className = '',
    text
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div
                className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
                role="status"
                aria-label="Loading"
            />
            {text && (
                <p className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
                    {text}
                </p>
            )}
        </div>
    );
}

export function FullPageLoading({ text = 'Đang tải...' }: { text?: string }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

export function PageLoading({ text = 'Đang tải...' }: { text?: string }) {
    return (
        <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

export function TableLoading() {
    return (
        <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" text="Đang tải dữ liệu..." />
        </div>
    );
}