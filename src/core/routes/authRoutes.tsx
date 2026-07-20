import { Navigate } from 'react-router';
import type { RouteObject } from 'react-router';
import LoginPage from '@/apps/portal/pages/loginPage/LoginPage';
import { ROUTES } from '@/core/routes/paths';

export const authRoutes = [
  {
    path: ROUTES.login,
    element: <LoginPage />,
  },
  {
    path: ROUTES.root,
    element: <Navigate to={ROUTES.caaldoc.dashboard} replace />,
  },
] satisfies RouteObject[];
