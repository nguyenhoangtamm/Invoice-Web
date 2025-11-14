import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    Menu,
    CreateMenuRequest,
    UpdateMenuRequest,
    AssignMenuToRoleRequest,
} from "../../types/admin";

/**
 * Menu Management Service
 * Handles all menu-related operations
 */
export class MenuService extends BaseApiClient {
    async createMenu(data: CreateMenuRequest): Promise<ApiResponse<Menu>> {
        return this.post<Menu>("/api/v1/Menus/create", data);
    }

    async updateMenu(data: UpdateMenuRequest): Promise<ApiResponse<Menu>> {
        return this.put<Menu>(`/api/v1/Menus/update/${data.id}`, data);
    }

    async deleteMenu(id: string): Promise<ApiResponse<void>> {
        return this.delete<void>(`/api/v1/Menus/delete/${id}`);
    }

    async getMenuById(id: string): Promise<ApiResponse<Menu>> {
        return this.get<Menu>(`/api/v1/Menus/get-by-id/${id}`);
    }

    async getAllMenus(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("/api/v1/Menus/get-all");
    }

    async getMenusPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<Menu>>> {
        return this.get<PaginatedResponse<Menu>>(
            `/api/v1/Menus/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async getMenuTree(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("/api/v1/Menus/tree");
    }

    async getMenuTreeByRole(roleId: string): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>(`/api/v1/Menus/tree/role/${roleId}`);
    }

    async getMenusByUserRoles(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("/api/v1/Menus/GetMenusByUserRoles");
    }

    async assignMenuToRole(data: AssignMenuToRoleRequest): Promise<ApiResponse<void>> {
        return this.post<void>("/api/v1/Menus/assign-to-role", data);
    }

    async getMenusByRole(roleId: string): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>(`/api/v1/Menus/role/${roleId}`);
    }
}

export const menuService = new MenuService();