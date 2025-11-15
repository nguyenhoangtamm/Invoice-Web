import { BaseApiClient } from "../baseApiClient";
import type { ApiResponse, PaginatedResponse } from "../../types/invoice";
import type {
    Menu,
    CreateMenuRequest,
    UpdateMenuRequest,
} from "../../types/menu";

/**
 * Menu Management Service
 * Handles all menu-related operations
 */
export class MenuService extends BaseApiClient {
    async createMenu(data: CreateMenuRequest): Promise<ApiResponse<Menu>> {
        return this.post<Menu>("/api/v1/Menus/create", data);
    }

    async updateMenu(data: UpdateMenuRequest): Promise<ApiResponse<Menu>> {
        return this.post<Menu>(`/api/v1/Menus/update/${data.id}`, data);
    }

    async deleteMenu(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`/api/v1/Menus/delete/${id}`);
    }

    async getMenuById(id: string): Promise<ApiResponse<Menu>> {
        return this.get<Menu>(`/api/v1/Menus/get-by-id/${id}`);
    }

    async getAllMenus(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("/api/v1/Menus/get-all");
    }

    async getMenuTree(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("/api/v1/Menus/tree");
    }

    async getMenusPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<Menu>>> {
        return this.get<PaginatedResponse<Menu>>(
            `/api/v1/Menus/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async assignMenuToRole(
        roleId: string,
        menuIds: string[]
    ): Promise<ApiResponse<void>> {
        return this.post<void>("/api/v1/Menus/assign-to-role", {
            roleId,
            menuIds,
        });
    }

    async getMenusByRole(roleId: string): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>(`/api/v1/Menus/by-role/${roleId}`);
    }
}

export const menuService = new MenuService();
