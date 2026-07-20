import type { RouteObject } from 'react-router';
import AuditLogPage from '@/apps/caaldoc/pages/AuditLogPage';
import { CaaldocLayout } from '@/apps/caaldoc/pages/CaaldocLayout';
import CaaldocDashboardPage from '@/apps/caaldoc/pages/CaaldocDashboardPage';
import PlantDetailsPage from '@/apps/caaldoc/pages/PlantDetailsPage';
import SettingsPage from '@/apps/caaldoc/pages/SettingsPage';
import RouteGuard from '@/components/auth/routeGuard/RouteGuard';
import { PERMISSIONS } from '@/core/authorization/permissions';
import { ROUTES } from '@/core/routes/paths';

export const caaldocRoutes = [
  {
    element: <CaaldocLayout />,
    children: [
      {
        element: <RouteGuard />,
        children: [
          {
            path: ROUTES.caaldoc.dashboard,
            element: <CaaldocDashboardPage />,
            handle: {
              routeAccessPermissions: PERMISSIONS.CAALDOC.DASHBOARD_VIEW,
            },
          },
          {
            path: ROUTES.caaldoc.plantDetailsPattern,
            element: <PlantDetailsPage />,
            handle: {
              routeAccessPermissions: PERMISSIONS.CAALDOC.PLANT_VIEW,
            },
          },
          {
            path: ROUTES.caaldoc.audit,
            element: <AuditLogPage />,
            handle: {
              routeAccessPermissions: PERMISSIONS.CAALDOC.LOG_VIEW,
            },
          },
          {
            path: ROUTES.caaldoc.settings,
            element: <SettingsPage />,
            handle: {
              routeAccessPermissions: PERMISSIONS.CAALDOC.SETTING_VIEW,
            },
          },
        ],
      },
    ],
  },
] satisfies RouteObject[];
