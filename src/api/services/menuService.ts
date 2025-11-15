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
        return this.post<Menu>("Menus/create", data);
    }

    async updateMenu(data: UpdateMenuRequest): Promise<ApiResponse<Menu>> {
        return this.post<Menu>(`Menus/update/${data.id}`, data);
    }

    async deleteMenu(id: string): Promise<ApiResponse<void>> {
        return this.post<void>(`Menus/delete/${id}`);
    }

    async getMenuById(id: string): Promise<ApiResponse<Menu>> {
        return this.get<Menu>(`Menus/get-by-id/${id}`);
    }

    async getAllMenus(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("Menus/get-all");
    }

    async getMenuTree(): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>("Menus/tree");
    }

    async getMenusPaginated(
        page: number = 1,
        pageSize: number = 10
    ): Promise<ApiResponse<PaginatedResponse<Menu>>> {
        return this.get<PaginatedResponse<Menu>>(
            `Menus/get-pagination?page=${page}&pageSize=${pageSize}`
        );
    }

    async assignMenuToRole(
        roleId: string,
        menuIds: string[]
    ): Promise<ApiResponse<void>> {
        return this.post<void>("Menus/assign-to-role", {
            roleId,
            menuIds,
        });
    }

    async getMenusByRole(roleId: string): Promise<ApiResponse<Menu[]>> {
        return this.get<Menu[]>(`Menus/by-role/${roleId}`);
    }
}

export const menuService = new MenuService();
