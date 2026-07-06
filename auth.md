Attach permissions with route config: Example below: 
src/
├── core/authorization/
│   ├── permissions.ts          // Permission constants
│   ├── modules.ts              // Module identifiers
│   ├── permissionUtils.ts      // can(), hasAny(), hasAll()
│   ├── Can.tsx                 // Component-level guard
│   └── types.ts                // Permission and RouteHandle types
│
├── components/
│   └── auth/
│       ├── RequireAuth.tsx     // Authentication
│       └── ModuleGuard.tsx     // Authorization
│
└── core/
    └── router.tsx              // Routes with typed handle metadata

permissions.ts
Single source of truth.
export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard.view',
  },

  PLANT: {
    VIEW: 'plant.view',
    CREATE: 'plant.create',
    EDIT: 'plant.edit',
    DELETE: 'plant.delete',
  },

  ROOM: {
    VIEW: 'room.view',
    CREATE: 'room.create',
    EDIT: 'room.edit',
    DELETE: 'room.delete',
  },

  EMPLOYEE: {
    VIEW: 'employee.view',
    CREATE: 'employee.create',
    EDIT: 'employee.edit',
    DELETE: 'employee.delete',
  },

  CAALDOC: {
    SETTINGS_VIEW: 'caaldoc.settings.view',
    SETTINGS_EDIT: 'caaldoc.settings.edit',

    WORKFLOW_VIEW: 'caaldoc.workflow.view',
    WORKFLOW_CREATE: 'caaldoc.workflow.create',
    WORKFLOW_EDIT: 'caaldoc.workflow.edit',
    WORKFLOW_APPROVE: 'caaldoc.workflow.approve',
  },

  AUDIT: {
    VIEW: 'audit.view',
  },
} as const;

export const ROUTE_PERMISSIONS = {
  dashboard: [PERMISSIONS.DASHBOARD.VIEW],
  plants: [PERMISSIONS.PLANT.VIEW],
  audit: [PERMISSIONS.AUDIT.VIEW],
  settings: [PERMISSIONS.CAALDOC.SETTINGS_VIEW],
  workflow: [PERMISSIONS.CAALDOC.WORKFLOW_VIEW],
};

export const MODULES = {
    CAALDOC: "caaldoc",
    VAALDOC: "vaaldoc",
    INSTCAL: "instcal",
    HVAC: "hvac",
    THERMAL: "thermal",
};

permissionUtils.ts
export function can(
    permissions: string[],
    required: string[]
) {
    return required.every(p => permissions.includes(p));
}

/** Automatically maps raw metadata routes into secured PermissionRoute structures */
export const configureSecureRoutes = (routes: any[]) => {
  return routes.map(route => {
    const requiredPermissions = route.handle?.permissions;

    // If route doesn't require explicit permissions, return it cleanly
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return route;
    }

    // Recursively process child nested routes if they exist
    const securedChildren = route.children ? configureSecureRoutes(route.children) : undefined;

    return {
      ...route,
      element: (
        <PermissionRoute permission={requiredPermissions}>
          {route.element}
        </PermissionRoute>
      ),
      children: securedChildren,
    };
  });
};

rawRoutes.tsx
export const rawRoutes = [
  {
    path: '/caaldoc/settings',
    element: <SettingsPage />,
    // Pass custom metadata into the handle configuration
    handle: {
      permissions: [PERMISSIONS.CAALDOC.SETTINGS_VIEW],
    }
  },
  {
    path: '/caaldoc/audit-logs',
    element: <AuditLogPage />,
    handle: {
      permissions: [PERMISSIONS.AUDIT.VIEW],
    }
  }
];

router.tsx
import { configureSecureRoutes } from '@/core/authorization/permissionUtils';
const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // send root into protexted area; RequireAuth restores the session from the refresh token and redirect to /login if it fails
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <RequireAuth />,
    children: children: configureSecureRoutes(rawRoutes), // Clean, secure injection!,
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);

export const AppRouter = () => <RouterProvider router={router} />;


export interface RouteHandle {
    auth?: {
        permissions: Permission[];
        mode?: "all" | "any";
    };

    module?: Module;
    breadcrumb?: string;
    title?: string;
};
const handle = currentMatch?.handle as RouteHandle;

Route object
{
    path: "/caaldoc/settings",
    element: <SettingsPage />,
    handle: {
        auth: {
            permissions: [
                PERMISSIONS.CAALDOC.SETTINGS_VIEW,
                ....
            ],
            mode: "any" | "all"
        },
        title: "Settings",
        breadcrumb: "Settings",
        module: MODULES.CAALDOC
    }
}

ModuleGuard.tsx
import { Outlet, Navigate, useMatches } from 'react-router';
import { useSelector } from 'react-redux';
import { can } from '@/authorization/permissionUtils';

export const ModuleGuard = () => {
  // 1. Grab the active user permissions array from your Redux Auth State
  const userPermissions = useSelector((state: any) => state.auth.permissions);
  
  // 2. useMatches gets metadata for all matched route segments in the active branch
  const matches = useMatches();

  // 3. Extract permissions required by the deepest matched leaf route
  const currentMatch = matches[matches.length - 1];
  const requiredPermissions = (currentMatch?.handle as any)?.permissions as string[] | undefined;

  // If no permissions are specified in the metadata handle config, let them pass
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return <Outlet />;
  }

  // 4. Run your optimized checker utility
  const hasAccess = can(userPermissions, requiredPermissions);

  if (!hasAccess) {
    // Gracefully fallback to unauthorized screen or dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  // User has the exact cryptographic keys! Render the page.
  return <Outlet />;
};

routes.tsx > with module gaurd
import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { ModuleGuard } from '@/components/auth/ModuleGuard';
import { PERMISSIONS } from '@/authorization/permissions';

// Feature Pages Imports
import { LoginPage } from '@/apps/portal/pages/LoginPage';
import { SettingsPage } from '@/apps/caaldoc/pages/SettingsPage';
import { AuditLogPage } from '@/apps/caaldoc/pages/AuditLogPage';
import { CaaldocDashboardPage } from '@/apps/caaldoc/pages/CaaldocDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    // Layer 1: Restores user session context and token authentication state on page refresh
    element: <RequireAuth />, 
    children: [
      {
        // Layer 2: Validates fine-grained RBAC permission lists from active route metadata handles
        element: <ModuleGuard />,
        children: [
          {
            path: '/caaldoc/dashboard',
            element: <CaaldocDashboardPage />,
            handle: { permissions: [PERMISSIONS.DASHBOARD.VIEW] },
          },
          {
            path: '/caaldoc/settings',
            element: <SettingsPage />,
            handle: { permissions: [PERMISSIONS.CAALDOC.SETTINGS_VIEW] },
          },
          {
            path: '/caaldoc/audit-logs',
            element: <AuditLogPage />,
            handle: { permissions: [PERMISSIONS.AUDIT.VIEW] },
          },
        ],
      },
    ],
  },
]);



button, or other html elemet/component level permission
<Can permission="plants.edit">
  <Button>Edit</Button>
</Can>

Can.tsx
export const Can = ({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) => {

  const permissions = useSelector(
    (state: RootState) => state.auth.permissions
  );

  if (!permissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
};

Usage:
<Can permission="plants.edit">
  <EditButton />
</Can>

# Global Platform Permissions
## User Management
user.view
user.create
user.edit
user.delete
user.activate
user.deactivate
user.reset_password

## Role & Permission Management
role.view
role.create
role.edit
role.delete
permission.view
permission.assign

## Tenant Management
tenant.view
tenant.create
tenant.edit
tenant.delete
tenant.activate
tenant.deactivate

## Customer Management
customer.view
customer.create
customer.edit
customer.delete
customer.manage_users
customer.manage_permissions

# Employee Module
## Employee Master
employee.view
employee.create
employee.edit
employee.delete
employee.import
employee.export

## Employee Location
employee_location.view
employee_location.create
employee_location.edit
employee_location.delete


# Plant Management
## Plant Master
plant.view
plant.create
plant.edit
plant.delete

## Room Management
room.view
room.create
room.edit
room.delete

## Area Management
area.view
area.create
area.edit
area.delete

# Workflow Management
## Workflow Definition
workflow.view
workflow.create
workflow.edit
workflow.delete
workflow.clone

## Workflow Execution
workflow_execution.view
workflow_execution.start
workflow_execution.edit
workflow_execution.submit
workflow_execution.approve
workflow_execution.reject
workflow_execution.cancel

## Service Orders
service_order.view
service_order.create
service_order.edit
service_order.delete
service_order.assign_engineer
service_order.assign_standard
service_order.approve
service_order.close

## SOP Management
sop.view
sop.create
sop.edit
sop.delete
sop.approve

## Standard Instruments
standard.view
standard.create
standard.edit
standard.delete
standard.calibrate

## Calibration Standards
calibration_standard.view
calibration_standard.create
calibration_standard.edit
calibration_standard.delete

# DUC (Device Under Calibration)
## Master
duc.view
duc.create
duc.edit
duc.delete
duc.import
duc.export

## Calibration Activities
duc.schedule
duc.start_calibration
duc.complete_calibration
duc.view_raw_data
duc.edit_raw_data
duc.submit_review
duc.approve
duc.reject

## Certificates
certificate.view
certificate.create
certificate.edit
certificate.delete
certificate.generate
certificate.approve
certificate.reject

## Labels
label.view
label.create
label.edit

## Reports
report.view
report.generate

## Excel Uploads
bulk_upload.duc
bulk_upload.standard
bulk_upload.employee
bulk_upload.plant
