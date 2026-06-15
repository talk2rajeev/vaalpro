import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router';
import type { RouteObject } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useRefreshMutation } from '@/features/auth/authApi';
import { logout, setCredentials } from '@/features/auth/authSlice';
import LoginPage from '@/apps/portal/pages/LoginPage';
import VaalproDashboardPage from '@/apps/portal/pages/VaalproDashboardPage';
import CaaldocDashboardPage from '@/apps/caaldoc/pages/CaaldocDashboardPage';
import PlantDetailsPage from '@/apps/caaldoc/pages/PlantDetailsPage';
import AuditLogPage from '@/apps/caaldoc/pages/AuditLogPage';
import SettingsPage from '@/apps/caaldoc/pages/SettingsPage';
import VaaldocComingSoonPage from '@/apps/vaaldoc/pages/VaaldocComingSoonPage';

let sessionRestorePromise: Promise<void> | null = null;

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isAuthChecked } = useSelector((state: RootState) => state.auth);
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    if (isAuthenticated || isAuthChecked || isLoading || sessionRestorePromise) {
      return;
    }

    sessionRestorePromise = (async () => {
      try {
        const userData = await refresh().unwrap();
        dispatch(setCredentials({ user: userData.user ?? null, accessToken: userData.accessToken }));
      } catch {
        dispatch(logout());
      } finally {
        sessionRestorePromise = null;
      }
    })();
  }, [dispatch, isAuthChecked, isAuthenticated, isLoading, refresh]);

  if (!isAuthenticated && !isAuthChecked) {
    return null;
  }

  if (!isAuthenticated && isAuthChecked) {
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
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <VaalproDashboardPage />,
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
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);

export const AppRouter = () => <RouterProvider router={router} />;
