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

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Navigate to="/lookup" replace /> },
            { path: 'lookup', element: <Lookup /> },
            { path: 'dashboard', element: <InvoiceDashboard /> },
            { path: '*', element: <Lookup /> },
        ]
    },
    // Auth routes without layout
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/terms', element: <Terms /> },
    { path: '/privacy', element: <Privacy /> }
];