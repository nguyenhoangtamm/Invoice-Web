import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import App from '../App';
import Lookup from '../pages/Lookup';
import InvoiceDashboard from '../pages/Dashboard';

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
    }
];