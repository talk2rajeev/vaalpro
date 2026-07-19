import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import LoginPage from '@/apps/portal/pages/loginPage/LoginPage';
import CaaldocDashboardPage from '@/apps/caaldoc/pages/CaaldocDashboardPage';
import PlantDetailsPage from '@/apps/caaldoc/pages/PlantDetailsPage';
import AuditLogPage from '@/apps/caaldoc/pages/AuditLogPage';
import SettingsPage from '@/apps/caaldoc/pages/SettingsPage';
import VaaldocComingSoonPage from '@/apps/vaaldoc/pages/VaaldocComingSoonPage';
import { CaaldocLayout } from '@/apps/caaldoc/pages/CaaldocLayout';
import { VaalProLayout } from '@/apps/portal/components/VaalProLayout';
import VendorEmployeeManagementPage from '@/apps/portal/pages/VendorEmployeeManagementPage/VendorEmployeeManagementPage';
import VendorManagementPage from '@/apps/portal/pages/vendorManagementPage/VendorManagementPage';
import VendorDetailPage from '@/apps/portal/pages/vendorDetailPage/VendorDetailPage';
import RoleManagementPage from '@/apps/portal/pages/roleManagementPage/RoleManagementPage';
import PermissionManagementPage from '@/apps/portal/pages/permissionManagementPage/PermissionManagementPage';
import PermissionGroupPage from '@/apps/portal/pages/permissionGroupPage/PermissionGroupPage';
import SubscriptionManagementPage from '@/apps/portal/pages/subscriptionManagementPage/SubscriptionManagementPage';
import VendorCustomerManagementPage from '@/apps/portal/pages/VendorCustomerManagementPage/VendorCustomerManagementPage';
import RequireAuth from '@/components/auth/requireAuth/RequireAuth';
import RouteGuard from '@/components/auth/routeGuard/RouteGuard';
import { PERMISSIONS } from '@/core/authorization/permissions';

const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/caaldoc/dashboard" replace />,
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
            element: <Navigate to="/system-admin/vendors" replace />,
          },
          {
            path: 'vendors',
            element: <VendorManagementPage />,
          },
          {
            path: 'vendors/:vendorId/detail',
            element: <VendorDetailPage />,
          },
          {
            path: 'vendors/:vendorId/employee',
            element: <VendorEmployeeManagementPage />,
          },
          {
            path: 'vendors/:vendorId/customers',
            element: <VendorCustomerManagementPage />,
          },
          {
            path: 'roles',
            element: <RoleManagementPage />,
          },
          {
            path: 'permissions',
            element: <PermissionManagementPage />,
          },
          {
            path: 'permission-groups',
            element: <PermissionGroupPage />,
          },
          {
            path: 'subscriptions',
            element: <SubscriptionManagementPage />,
          },
        ],
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
                  routeAccessPermissions: PERMISSIONS.CAALDOC.DASHBOARD_VIEW,
                },
              },
              {
                path: '/caaldoc/plants/:id',
                element: <PlantDetailsPage />,
                handle: {
                  routeAccessPermissions: PERMISSIONS.CAALDOC.PLANT_VIEW,
                },
              },
              {
                path: '/caaldoc/audit',
                element: <AuditLogPage />,
                handle: {
                  routeAccessPermissions: PERMISSIONS.CAALDOC.LOG_VIEW,
                },
              },
              {
                path: '/caaldoc/settings',
                element: <SettingsPage />,
                handle: {
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
      },
      {
        path: '*',
        element: <Navigate to="/caaldoc/dashboard" replace />,
      },
    ],
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);
export const AppRouter = () => <RouterProvider router={router} />;
