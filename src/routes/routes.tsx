import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import App from '../App';
import Lookup from '../pages/Lookup';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import ForgotPassword from '../pages/ForgotPassword';
import AdminLayout from '../layouts/AdminLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminInvoices from '../pages/Admin/AdminInvoices';
import AdminApiKeys from '../pages/Admin/AdminApiKeys';
import AdminOrganizations from '../pages/Admin/AdminOrganizations';
import AdminRoles from '../pages/Admin/AdminRoles';
import AdminMenus from '../pages/Admin/AdminMenus';
import AdminInvoiceBatches from '../pages/Admin/AdminInvoiceBatches';
import AdminInvoiceLines from '../pages/Admin/AdminInvoiceLines';
import AdminGuard from '../components/common/AdminGuard';
import AuthGuard from '../components/common/AuthGuard';
import BlockchainVerificationPage from '../pages/BlockchainVerification';
import {
    DashboardPage,
    InvoicesPage,
    OrganizationsPage,
    ApiKeysPage,
    AnalyticsPage,
    SettingsPage
} from '../pages/DashboardPages';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/lookup" replace /> },
            { path: 'lookup', element: <Lookup /> },
            { path: '*', element: <Lookup /> },
        ]
    },
    // Dashboard routes with layout
    {
        path: '/dashboard',
        element: (
            <AuthGuard>
                <DashboardLayout />
            </AuthGuard>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'invoices', element: <InvoicesPage /> },
            { path: 'organizations', element: <OrganizationsPage /> },
            { path: 'api-keys', element: <ApiKeysPage /> },
            { path: 'analytics', element: <AnalyticsPage /> },
            { path: 'settings', element: <SettingsPage /> }
        ]
    },
    // Admin routes with separate layout
    {
        path: '/admin',
        element: (
            <AdminGuard>
                <AdminLayout />
            </AdminGuard>
        ),
        children: [
            { index: true, element: <Navigate to="/admin/dashboard" replace /> },
            { path: 'dashboard', element: <AdminDashboard /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'organizations', element: <AdminOrganizations /> },
            { path: 'roles', element: <AdminRoles /> },
            { path: 'menus', element: <AdminMenus /> },
            { path: 'invoices', element: <AdminInvoices /> },
            { path: 'invoice-lines', element: <AdminInvoiceLines /> },
            { path: 'invoice-batches', element: <AdminInvoiceBatches /> },
            { path: 'api-keys', element: <AdminApiKeys /> },
        ]
    },
    // Auth routes without layout
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/terms', element: <Terms /> },
    { path: '/privacy', element: <Privacy /> },
    // Blockchain verification route
    { path: '/blockchain-verify/:id', element: <BlockchainVerificationPage /> }
];