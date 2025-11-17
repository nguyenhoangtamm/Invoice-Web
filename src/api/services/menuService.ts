import apiClient from "../apiClient";
import type { Result, PaginatedResult } from "../../types/common";
import type {
    Menu,
    CreateMenuRequest,
    UpdateMenuRequest,
} from "../../types/menu";

/**
 * Menu Management Service
 * Handles all menu-related operations
 */

export const createMenu = async (
    data: CreateMenuRequest
): Promise<Result<Menu>> => {
    const response = await apiClient.post<Result<Menu>>("/Menus/create", data);
    return response.data;
};

export const updateMenu = async (
    data: UpdateMenuRequest
): Promise<Result<Menu>> => {
    const response = await apiClient.post<Result<Menu>>(
        `/Menus/update/${data.id}`,
        data
    );
    return response.data;
};

export const deleteMenu = async (id: string): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(`/Menus/delete/${id}`);
    return response.data;
};

export const getMenuById = async (id: string): Promise<Result<Menu>> => {
    const response = await apiClient.get<Result<Menu>>(
        `/Menus/get-by-id/${id}`
    );
    return response.data;
};

export const getAllMenus = async (): Promise<Result<Menu[]>> => {
    const response = await apiClient.get<Result<Menu[]>>("/Menus/get-all");
    return response.data;
};

export const getMenuTree = async (): Promise<Result<Menu[]>> => {
    const response = await apiClient.get<Result<Menu[]>>("/Menus/tree");
    return response.data;
};

const cleanPaginationParams = (page: number = 1, pageSize: number = 10) => {
    return { page, pageSize };
};

export const getMenusPaginated = async (
    page: number = 1,
    pageSize: number = 10
): Promise<PaginatedResult<Menu>> => {
    const params = cleanPaginationParams(page, pageSize);
    const response = await apiClient.get<PaginatedResult<Menu>>(
        "/Menus/get-pagination",
        {
            params,
        }
    );
    return response.data;
};

export const assignMenuToRole = async (
    roleId: string,
    menuIds: string[]
): Promise<Result<void>> => {
    const response = await apiClient.post<Result<void>>(
        "/Menus/assign-to-role",
        {
            roleId,
            menuIds,
        }
    );
    return response.data;
};

export const getMenusByRole = async (
    roleId: string
): Promise<Result<Menu[]>> => {
    const response = await apiClient.get<Result<Menu[]>>(
        `/Menus/by-role/${roleId}`
    );
    return response.data;
};
