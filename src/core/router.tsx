import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import VaaldocComingSoonPage from '@/apps/vaaldoc/pages/VaaldocComingSoonPage';
import RequireAuth from '@/components/auth/requireAuth/RequireAuth';
import { authRoutes } from '@/core/routes/authRoutes';
import { caaldocRoutes } from '@/core/routes/caaldocRoutes';
import { ROUTES } from '@/core/routes/paths';
import { portalRoutes } from '@/core/routes/portalRoutes';

const routes = [
  ...authRoutes,
  {
    element: <RequireAuth />,
    children: [
      ...portalRoutes,
      ...caaldocRoutes,
      {
        path: ROUTES.vaaldoc,
        element: <VaaldocComingSoonPage />,
      },
      {
        path: '*',
        element: <Navigate to={ROUTES.caaldoc.dashboard} replace />,
      },
    ],
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);
export const AppRouter = () => <RouterProvider router={router} />;
