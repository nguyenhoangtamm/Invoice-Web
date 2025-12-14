// Menu types
export interface Menu {
    id: string;
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    children?: Menu[];
}

export interface CreateMenuRequest {
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
}

export interface UpdateMenuRequest {
    id: string;
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    isActive: boolean;
}

export interface AssignMenuToRoleRequest {
    roleId: string;
    menuIds: string[];
}
