import { useState, useEffect } from "react";
import { apiClient } from "../api/apiClient";
import { getDashboardStats } from "../api/services";
import type { ApiResponse, PaginatedResponse } from "../types/invoice";

/**
 * Custom hook for API calls with loading, error, and success states
 */
export function useApi<T>(
    apiCall: () => Promise<ApiResponse<T>>,
    dependencies: any[] = [],
    immediate = true
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(immediate);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const execute = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await apiCall();

            if (response.success) {
                setData(response.data || null);
                setSuccess(true);
            } else {
                setError(response.message || "API call failed");
                setData(null);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unknown error occurred"
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, dependencies);

    return {
        data,
        loading,
        error,
        success,
        execute,
        refetch: execute,
    };
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T>(
    apiCall: (
        page: number,
        limit: number,
        ...args: any[]
    ) => Promise<ApiResponse<PaginatedResponse<T>>>,
    initialPage = 1,
    initialLimit = 10,
    dependencies: any[] = []
) {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (pageNum = page, pageLimit = limit) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall(pageNum, pageLimit);

            if (response.success && response.data) {
                setData(response.data.data);
                setTotal(response.data.total);
                setTotalPages(response.data.totalPages);
            } else {
                setError(response.message || "API call failed");
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, ...dependencies]);

    const goToPage = (pageNum: number) => {
        setPage(pageNum);
    };

    const changeLimit = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when changing limit
    };

    const refresh = () => {
        fetchData(page, limit);
    };

    return {
        data,
        loading,
        error,
        page,
        limit,
        total,
        totalPages,
        goToPage,
        changeLimit,
        refresh,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}

/**
 * Hook for invoice search functionality
 */
export function useInvoiceSearch() {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchByCode = async (code: string) => {
        if (!code.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.searchInvoiceByCode(code);

            if (response) {
                setSearchResults([response]);
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi kết nối");
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const searchByContact = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.searchInvoicesByContact(query);

            setSearchResults(response || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi kết nối");
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const uploadXml = async (file: File) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.uploadXmlFile(file);

            setSearchResults([response]);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload thất bại");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setSearchResults([]);
        setError(null);
    };

    return {
        searchResults,
        loading,
        error,
        searchByCode,
        searchByContact,
        uploadXml,
        clearResults,
    };
}

/**
 * Hook for dashboard statistics (new)
 */
export function useDashboardStats() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const stats = await getDashboardStats();
                setData(stats);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, loading, error };
}

/**
 * Hook for user profile
 */
export function useUserProfile() {
    return useApi(() =>
        apiClient.getUserProfile().then((data) => ({
            success: true,
            data: data,
            message: "Profile loaded successfully",
        }))
    );
}

/**
 * Hook for company information
 */
export function useCompanyInfo() {
    return useApi(() => apiClient.getCompanyInfo());
}

/**
 * Hook for invoices with pagination
 */
export function useInvoices(status?: string) {
    return usePaginatedApi(
        async (page: number, limit: number) => {
            const response = await apiClient.fetchInvoices({
                page,
                pageSize: limit,
                status: status as any,
            });

            // Transform to match expected format
            return {
                success: true,
                data: {
                    data: response.items,
                    total: response.totalCount,
                    page: response.page,
                    limit: response.pageSize,
                    totalPages: Math.ceil(
                        response.totalCount / response.pageSize
                    ),
                },
            };
        },
        1,
        10,
        [status]
    );
}
