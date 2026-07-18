import type { PermissionCode } from './permissions';

interface AuthPermission {
  permission_code?: string | null;
}

interface AuthStateContext {
  permissions: AuthPermission[];
}

export const createAuthEngine = (context: AuthStateContext) => {
  const { permissions } = context;

  return {
    /** Perimeter validation for workspace environments (Workspace Entry Check) */
    canAccessWorkspace(routeAccessPermissions?: PermissionCode): boolean {
      if (!routeAccessPermissions) return true;
      return permissions.some(p => p.permission_code === routeAccessPermissions);
    },

    /** Atomic feature capability evaluation */
    canPerformAction(actionPermission: PermissionCode): boolean {
      return permissions.some(p => p.permission_code === actionPermission);
    },
  };
};
