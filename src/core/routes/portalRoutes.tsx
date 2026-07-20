import { Navigate } from 'react-router';
import type { RouteObject } from 'react-router';
import { VaalProLayout } from '@/apps/portal/components/VaalProLayout';
import PermissionGroupPage from '@/apps/portal/pages/permissionGroupPage/PermissionGroupPage';
import PermissionManagementPage from '@/apps/portal/pages/permissionManagementPage/PermissionManagementPage';
import RoleManagementPage from '@/apps/portal/pages/roleManagementPage/RoleManagementPage';
import SubscriptionManagementPage from '@/apps/portal/pages/subscriptionManagementPage/SubscriptionManagementPage';
import VendorCustomerManagementPage from '@/apps/portal/pages/VendorCustomerManagementPage/VendorCustomerManagementPage';
import VendorEmployeeManagementPage from '@/apps/portal/pages/VendorEmployeeManagementPage/VendorEmployeeManagementPage';
import VendorDetailPage from '@/apps/portal/pages/vendorDetailPage/VendorDetailPage';
import VendorManagementPage from '@/apps/portal/pages/vendorManagementPage/VendorManagementPage';
import { ROUTES } from '@/core/routes/paths';

export const portalRoutes = [
  {
    path: ROUTES.systemAdmin.root,
    element: <VaalProLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.systemAdmin.vendors} replace />,
      },
      {
        path: 'vendors',
        children: [
          {
            index: true,
            element: <VendorManagementPage />,
          },
          {
            path: ':vendorId/detail',
            element: <VendorDetailPage />,
          },
          {
            path: ':vendorId/employee',
            element: <VendorEmployeeManagementPage />,
          },
          {
            path: ':vendorId/customers',
            element: <VendorCustomerManagementPage />,
          },
        ],
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
] satisfies RouteObject[];
