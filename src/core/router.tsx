import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router';
import type { RouteObject } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import DashboardPage from '@/apps/portal/pages/DashboardPage';
import LoginPage from '@/apps/portal/pages/LoginPage';
import CaaldocDashboardPage from '@/apps/caaldoc/pages/CaaldocDashboardPage';
import PlantDetailsPage from '@/apps/caaldoc/pages/PlantDetailsPage';
import AuditLogPage from '@/apps/caaldoc/pages/AuditLogPage';
import SettingsPage from '@/apps/caaldoc/pages/SettingsPage';
import VaaldocComingSoonPage from '@/apps/vaaldoc/pages/VaaldocComingSoonPage';
import VaalproDashboardPage from '@/apps/vaalpro/pages/VaalproDashboardPage';

const ProtectedLayout = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/caaldoc/dashboard',
        element: <CaaldocDashboardPage />,
      },
      {
        path: '/caaldoc/plants/:id',
        element: <PlantDetailsPage />,
      },
      {
        path: '/caaldoc/audit',
        element: <AuditLogPage />,
      },
      {
        path: '/caaldoc/settings',
        element: <SettingsPage />,
      },
      {
        path: '/vaaldoc',
        element: <VaaldocComingSoonPage />,
      },
      {
        path: '/vaalpro/dashboard',
        element: <VaalproDashboardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);

export const AppRouter = () => <RouterProvider router={router} />;
