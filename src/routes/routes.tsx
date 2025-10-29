import type { RouteObject } from 'react-router-dom';
import { Home, About, Contact } from '../pages';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/about',
        element: <About />,
    },
    {
        path: '/contact',
        element: <Contact />,
    },
    {
        path: '*',
        element: <Home />,
    }
];