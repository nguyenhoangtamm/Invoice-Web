// Authorization middleware và guards
export { default as AuthGuard } from "./AuthGuard";
export { default as AdminGuard } from "./AdminGuard";
export { default as UserGuard } from "./UserGuard";
export { default as RoleGuard } from "./RoleGuard";
export { default as ProtectedRoute } from "./ProtectedRoute";
export {
    default as PermissionMiddleware,
    createPermission,
} from "./PermissionMiddleware";
export { default as UnauthorizedAccess } from "./UnauthorizedAccess";

// Common components
export { LoadingSpinner } from "./LoadingSpinner";
export { default as ConfirmModal } from "./ConfirmModal";
export { default as Pagination } from "./Pagination";
export { default as ToastProvider } from "./ToastProvider";
export { default as AdminModal } from "./AdminModal";
export { default as AdminTable } from "./AdminTable";

// Re-export table component
export * from "./table";
