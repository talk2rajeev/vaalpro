import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import LoginPage from '@/apps/portal/pages/loginPage/LoginPage';
import VaalproDashboardPage from '@/apps/portal/pages/vaalproDashboardPage/VaalproDashboardPage';
import CaaldocDashboardPage from '@/apps/caaldoc/pages/CaaldocDashboardPage';
import PlantDetailsPage from '@/apps/caaldoc/pages/PlantDetailsPage';
import AuditLogPage from '@/apps/caaldoc/pages/AuditLogPage';
import SettingsPage from '@/apps/caaldoc/pages/SettingsPage';
import VaaldocComingSoonPage from '@/apps/vaaldoc/pages/VaaldocComingSoonPage';
import { CaaldocLayout } from '@/apps/caaldoc/pages/CaaldocLayout';
import { VaalProLayout } from '@/apps/portal/components/VaalProLayout';
import IamUsersManagementPage from '@/apps/portal/pages/iamUsersManagementPage/IamUsersManagementPage';
import VendorManagementPage from '@/apps/portal/pages/vendorManagementPage/VendorManagementPage';
import IamRoleManagementPage from '@/apps/portal/pages/iamRoleManagementPage/IamRoleManagementPage';
import IamPermissionManagementPage from '@/apps/portal/pages/iamPermissionManagementPage/IamPermissionManagementPage';
import RequireAuth from '@/components/auth/requireAuth/RequireAuth';
import ModuleGuard from '@/components/auth/moduleGuard/ModuleGuard';
import RouteGuard from '@/components/auth/routeGuard/RouteGuard';
import { PERMISSIONS } from '@/core/authorization/permissions';
import { MODULES } from '@/core/authorization/modules';

const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/system-admin',
        element: <VaalProLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/system-admin/users" replace />,
          },
          {
            path: 'users',
            element: <IamUsersManagementPage />,
          },
          {
            path: 'vendor-management',
            element: <VendorManagementPage />,
          },
          {
            path: 'roles',
            element: <IamRoleManagementPage />,
          },
          {
            path: 'permissions',
            element: <IamPermissionManagementPage />,
          },
        ],
      },
      {
        element: <ModuleGuard />,
        children: [
          {
            path: '/dashboard',
            element: <VaalproDashboardPage />,
            handle: {
              requiredModule: MODULES.PORTAL,
            },
          },
          {
            element: <CaaldocLayout />,
            children: [
              {
                element: <RouteGuard />,
                children: [
                  {
                    path: '/caaldoc/dashboard',
                    element: <CaaldocDashboardPage />,
                    handle: {
                      requiredModule: MODULES.CAALDOC,
                      routeAccessPermissions: PERMISSIONS.CAALDOC.DASHBOARD_VIEW,
                    },
                  },
                  {
                    path: '/caaldoc/plants/:id',
                    element: <PlantDetailsPage />,
                    handle: {
                      requiredModule: MODULES.CAALDOC,
                      routeAccessPermissions: PERMISSIONS.CAALDOC.PLANT_VIEW,
                    },
                  },
                  {
                    path: '/caaldoc/audit',
                    element: <AuditLogPage />,
                    handle: {
                      requiredModule: MODULES.CAALDOC,
                      routeAccessPermissions: PERMISSIONS.CAALDOC.LOG_VIEW,
                    },
                  },
                  {
                    path: '/caaldoc/settings',
                    element: <SettingsPage />,
                    handle: {
                      requiredModule: MODULES.CAALDOC,
                      routeAccessPermissions: PERMISSIONS.CAALDOC.SETTING_VIEW,
                    },
                  },
                ],
              },
            ],
          },
          {
            path: '/vaaldoc',
            element: <VaaldocComingSoonPage />,
            handle: { requiredModule: MODULES.VAALDOC },
          },
        ],
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
