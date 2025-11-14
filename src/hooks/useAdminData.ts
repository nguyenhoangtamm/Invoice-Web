import { useState, useEffect } from "react";
import {
    fetchUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    fetchRoles,
    getAllRoles,
    fetchOrganizations,
    getAllOrganizations,
} from "../api/services";
import type {
    AdminUserDto,
    UsersQueryParams,
    UserPayload,
    RoleDto,
    OrganizationDto,
} from "../api/services";

// Generic admin data hook
export function useAdminData<T, CreateT, UpdateT>({
    fetchFunction,
    createFunction,
    updateFunction,
    deleteFunction,
    bulkDeleteFunction,
    initialParams,
}: {
    fetchFunction: (
        params: any
    ) => Promise<{
        items: T[];
        totalCount: number;
        page: number;
        pageSize: number;
    }>;
    createFunction?: (payload: CreateT) => Promise<T>;
    updateFunction?: (id: string, payload: UpdateT) => Promise<T>;
    deleteFunction?: (id: string) => Promise<void>;
    bulkDeleteFunction?: (ids: string[]) => Promise<{ message: string }>;
    initialParams?: any;
}) {
    const [data, setData] = useState<T[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchData = async (params: any = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction({
                ...initialParams,
                page,
                pageSize,
                ...params,
            });
            setData(result.items);
            setTotalCount(result.totalCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (payload: CreateT): Promise<T | null> => {
        if (!createFunction) return null;
        try {
            setLoading(true);
            const result = await createFunction(payload);
            await fetchData(); // Refresh data
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Create failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (
        id: string,
        payload: UpdateT
    ): Promise<T | null> => {
        if (!updateFunction) return null;
        try {
            setLoading(true);
            const result = await updateFunction(id, payload);
            await fetchData(); // Refresh data
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: string): Promise<void> => {
        if (!deleteFunction) return;
        try {
            setLoading(true);
            await deleteFunction(id);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const bulkDelete = async (ids: string[]): Promise<void> => {
        if (!bulkDeleteFunction) return;
        try {
            setLoading(true);
            await bulkDeleteFunction(ids);
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bulk delete failed");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, pageSize]);

    return {
        data,
        totalCount,
        loading,
        error,
        page,
        pageSize,
        setPage,
        setPageSize,
        fetchData,
        createItem,
        updateItem,
        deleteItem,
        bulkDelete,
        refresh: fetchData,
    };
}

// Specific hooks for each entity
export function useUsers() {
    return useAdminData<AdminUserDto, UserPayload, Partial<UserPayload>>({
        fetchFunction: fetchUsers,
        createFunction: createUser,
        updateFunction: updateUser,
        deleteFunction: deleteUser,
        bulkDeleteFunction: bulkDeleteUsers,
        initialParams: {},
    });
}

export function useRoles() {
    return useAdminData<RoleDto, any, any>({
        fetchFunction: fetchRoles,
        initialParams: {},
    });
}

export function useOrganizations() {
    return useAdminData<OrganizationDto, any, any>({
        fetchFunction: fetchOrganizations,
        initialParams: {},
    });
}

// Helper hooks for dropdowns/selects
export function useAllRoles() {
    const [roles, setRoles] = useState<RoleDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const result = await getAllRoles();
                setRoles(result);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to fetch roles"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return { roles, loading, error };
}

export function useAllOrganizations() {
    const [organizations, setOrganizations] = useState<OrganizationDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                setLoading(true);
                const result = await getAllOrganizations();
                setOrganizations(result);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch organizations"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    return { organizations, loading, error };
}
