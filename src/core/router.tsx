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
import UnauthorizedAlert from '@/apps/shared/components/UnauthorizedAlert';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';
import { CaaldocLayout } from '@/apps/caaldoc/pages/CaaldocLayout';

let sessionRestorePromise: Promise<void> | null = null;


const PermissionRoute = ({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) => {

  const permissions = useSelector(
    (state: RootState) => state.auth.permissions
  );

  if (!permissions.some(p => p.permission?.name === permission)) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        <DashboardHeader showLogo />
        <UnauthorizedAlert title="Unauthorized" description="You do not have permission to view this resource." />
      </div>
    )
  }

  return <>{children}</>;
};

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
        element: (
          <PermissionRoute permission='vaalpro.dashboard.view'>
            <VaalproDashboardPage />
          </PermissionRoute>
        ),
      },
      {
        element: <CaaldocLayout />,
        children: [
          {
            path: '/caaldoc/dashboard',
            element: (
              <PermissionRoute permission='caaldoc.dashboard.view'>
                <CaaldocDashboardPage />
              </PermissionRoute>
            ),
          },
          {
            path: '/caaldoc/plants/:id',
            element: (
              <PermissionRoute permission='caaldoc.plant.view'>
                <PlantDetailsPage />
              </PermissionRoute>
            ),
          },
          {
            path: '/caaldoc/audit',
            element: (
              <PermissionRoute permission='caaldoc.log.view'>
                <AuditLogPage />
              </PermissionRoute>
            ),
          },
          {
            path: '/caaldoc/settings',
            element: (
              <PermissionRoute permission='caaldoc.setting.view'>
                <SettingsPage />
              </PermissionRoute>
            ),
          },
        ],
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
