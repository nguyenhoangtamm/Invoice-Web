import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import App from '../App';
import Lookup from '../pages/Lookup';
import InvoiceDashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import ForgotPassword from '../pages/ForgotPassword';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import AdminUsers from '../pages/Admin/AdminUsers';
import AdminInvoices from '../pages/Admin/AdminInvoices';
import AdminGuard from '../components/common/AdminGuard';
import AuthGuard from '../components/common/AuthGuard';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/lookup" replace /> },
            { path: 'lookup', element: <Lookup /> },
            { path: 'dashboard', element: <AuthGuard><InvoiceDashboard /></AuthGuard> },
            { path: '*', element: <Lookup /> },
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
            { path: 'invoices', element: <AdminInvoices /> },
        ]
    },
    // Auth routes without layout
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/terms', element: <Terms /> },
    { path: '/privacy', element: <Privacy /> }
];