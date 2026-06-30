import  type { ReactNode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router';
import type { RouteObject } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import LoginPage from '@/apps/portal/pages/LoginPage';
import VaalproDashboardPage from '@/apps/portal/pages/VaalproDashboardPage';
import CaaldocDashboardPage from '@/apps/caaldoc/pages/CaaldocDashboardPage';
import PlantDetailsPage from '@/apps/caaldoc/pages/PlantDetailsPage';
import AuditLogPage from '@/apps/caaldoc/pages/AuditLogPage';
import SettingsPage from '@/apps/caaldoc/pages/SettingsPage';
import VaaldocComingSoonPage from '@/apps/vaaldoc/pages/VaaldocComingSoonPage';
import UnauthorizedAlert from '@/apps/shared/components/UnauthorizedAlert';
// import DashboardHeader from '@/apps/shared/components/DashboardHeader';
import { CaaldocLayout } from '@/apps/caaldoc/pages/CaaldocLayout';
import RequireAuth from '@/components/auth/RequireAuth';

const PermissionRoute = ({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) => {

  const allowdPermissionList = permission.split(',');
  const permissions = useSelector(
    (state: RootState) => state.auth.permissions
  );

  if (!permissions.some(p => allowdPermissionList.includes(p.permission_code ?? ''))) {
    return (
      <div className="flex flex-col min-h-screen w-full">
        {/* <DashboardHeader showLogo /> */}
        <UnauthorizedAlert title="Unauthorized" description="You do not have permission to view this resource." />
      </div>
    )
  }

  return <>{children}</>;
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
    element: <RequireAuth />,
    children: [
      {
        path: '/dashboard',
        element: (
          <PermissionRoute permission='vaalpro.dashboard.view,plant.config.configure'>
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
